const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_SMTP_API_URL = 'https://api.brevo.com/v3/smtp/email';
const REQUEST_TIMEOUT_MS = 8000; // 8 seconds timeout per request
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000; // 1s initial delay for backoff

class BrevoService {
    /**
     * Splits a full name string into firstName and lastName.
     * @param {string} name 
     * @returns {{ firstName: string, lastName: string }}
     */
    static splitName(name) {
        if (!name || typeof name !== 'string') {
            return { firstName: '', lastName: '' };
        }
        const trimmed = name.trim();
        const parts = trimmed.split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        return { firstName, lastName };
    }

    /**
     * Filters out null, undefined, and empty string attributes.
     * @param {Object} attributes 
     * @returns {Object}
     */
    static sanitizeAttributes(attributes) {
        const sanitized = {};
        for (const [key, value] of Object.entries(attributes)) {
            if (value !== null && value !== undefined && String(value).trim() !== '') {
                sanitized[key] = typeof value === 'string' ? value.trim() : value;
            }
        }
        return sanitized;
    }

    /**
     * Constructs the payload for Brevo Contacts API.
     * @param {Object} user 
     * @returns {Object}
     */
    static buildPayload(user) {
        const { firstName, lastName } = this.splitName(user.name);

        const rawAttributes = {
            FIRSTNAME: firstName,
            LASTNAME: lastName,
            PHONE: user.phone || null,
            CITY_STATE: user.cityState || null,
            COUNTRY: user.country || null,
            PROFESSION: user.profession || null,
            SPECIALTY: user.specialty || null,
            EMPLOYER: user.employer || null,
            JOB_ROLE: user.job_role || null,
            STATUS: user.status || null,
            ROLE: user.role || null,
            PAYMENT_STATUS: user.payment_status || null,
            MEMBERSHIP_PLAN: user.plan_name || null
        };

        const attributes = this.sanitizeAttributes(rawAttributes);

        const listIdEnv = process.env.BREVO_LIST_ID;
        const listIds = listIdEnv
            ? listIdEnv.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
            : [];

        const payload = {
            email: user.email.toLowerCase().trim(),
            attributes,
            updateEnabled: true // Upsert contact if already exists
        };

        if (listIds.length > 0) {
            payload.listIds = listIds;
        }

        return payload;
    }

    /**
     * Utility delay helper for exponential backoff.
     * @param {number} ms 
     * @returns {Promise<void>}
     */
    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Main method to sync contact to Brevo with retries, timeouts, and logging.
     * @param {Object} user 
     * @returns {Promise<{ success: boolean, message: string }>}
     */
    static async syncContact(user) {
        const apiKey = process.env.BREVO_API_KEY;

        // Check if API key is configured
        if (!apiKey) {
            console.warn('[Brevo Service] BREVO_API_KEY is not configured in environment variables. Skipping sync.');
            return { success: false, message: 'BREVO_API_KEY not configured' };
        }

        // Validate user object & email
        if (!user || !user.email) {
            console.error('[Brevo Service] Validation error: Invalid user object or missing email.', { user });
            return { success: false, message: 'Invalid user or missing email' };
        }

        const payload = this.buildPayload(user);
        let attempt = 0;
        let delay = INITIAL_RETRY_DELAY_MS;

        while (attempt < MAX_RETRIES) {
            attempt++;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

            try {
                console.log(`[Brevo Service] Syncing contact for ${payload.email} (Attempt ${attempt}/${MAX_RETRIES})...`);

                const response = await fetch(BREVO_API_URL, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json',
                        'api-key': apiKey
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // HTTP Success (200 OK, 201 Created, 204 No Content)
                if (response.ok) {
                    const responseData = response.status !== 204 ? await response.json().catch(() => ({})) : {};
                    console.log(`[Brevo Service] Contact sync successful for ${payload.email}. Status: ${response.status}`, responseData);
                    return { success: true, message: 'Brevo contact synced successfully', data: responseData };
                }

                const errorData = await response.json().catch(() => ({}));
                const status = response.status;

                // Handle Non-retryable Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden)
                if (status === 401) {
                    console.error('[Brevo Service] 401 Unauthorized: Invalid BREVO_API_KEY. Aborting retries.');
                    return { success: false, message: 'Unauthorized API key' };
                }

                if (status === 400) {
                    console.error(`[Brevo Service] 400 Bad Request for ${payload.email}:`, errorData);
                    return { success: false, message: errorData.message || 'Validation error in Brevo payload' };
                }

                // Handle Retryable Errors (429 Rate Limit, 500, 502, 503, 504)
                if (status === 429 || status >= 500) {
                    console.warn(`[Brevo Service] API returned HTTP ${status} for ${payload.email}. Error: ${errorData.message || 'Server error'}`);
                } else {
                    console.error(`[Brevo Service] Unexpected HTTP status ${status} for ${payload.email}:`, errorData);
                }

            } catch (error) {
                clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    console.warn(`[Brevo Service] Network Timeout after ${REQUEST_TIMEOUT_MS}ms for ${payload.email} (Attempt ${attempt}/${MAX_RETRIES}).`);
                } else {
                    console.warn(`[Brevo Service] Network / Fetch error for ${payload.email} (Attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);
                }
            }

            // Exponential backoff before retrying
            if (attempt < MAX_RETRIES) {
                console.log(`[Brevo Service] Retrying in ${delay}ms...`);
                await this.wait(delay);
                delay *= 2; // Double delay for next attempt (1s -> 2s -> 4s)
            }
        }

        console.error(`[Brevo Service] Max retries (${MAX_RETRIES}) reached. Failed to sync contact for ${payload.email}.`);
        return { success: false, message: 'Max retries exceeded' };
    }

    /**
     * Sends a transactional email via the Brevo Transactional Email API.
     * Sender name and address are pulled from environment variables with safe defaults.
     *
     * @param {Object} options
     * @param {string}  options.to      - Recipient email address.
     * @param {string}  options.subject - Email subject line.
     * @param {string}  [options.html]  - HTML body content.
     * @param {string}  [options.text]  - Plain-text fallback body.
     * @returns {Promise<{ success: boolean, messageId?: string }>}
     * @throws {Error} Descriptive error if the API call fails.
     */
    static async sendTransactionalEmail({ to, subject, html, text }) {
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            throw new Error('BREVO_API_KEY is not configured. Cannot send transactional email.');
        }

        if (!to || !subject) {
            throw new Error('sendTransactionalEmail requires both "to" and "subject".');
        }

        // Sender identity — falls back to AMMA defaults if env vars are missing
        const senderName    = process.env.EMAIL_FROM_NAME    || 'AMMA National';
        const senderAddress = process.env.EMAIL_FROM_ADDRESS || 'membership@ammanational.org';

        const payload = {
            sender: {
                name:  senderName,
                email: senderAddress
            },
            to: [{ email: to }],
            subject,
            ...(html  && { htmlContent: html }),
            ...(text  && { textContent: text })
        };

        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            console.log(`[Brevo] Sending transactional email to ${to} — Subject: "${subject}"`);

            const response = await fetch(BREVO_SMTP_API_URL, {
                method: 'POST',
                headers: {
                    'accept':       'application/json',
                    'content-type': 'application/json',
                    'api-key':      apiKey
                },
                body:   JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const responseData = await response.json().catch(() => ({}));

            if (response.ok) {
                console.log(`[Brevo] Email sent successfully to ${to}. MessageId: ${responseData.messageId || 'N/A'}`);
                return { success: true, messageId: responseData.messageId };
            }

            // Log full Brevo error details for debugging — without exposing the API key
            console.error(
                `[Brevo] Failed to send email to ${to}.`,
                `HTTP Status: ${response.status}`,
                `API Message: ${responseData.message || JSON.stringify(responseData)}`
            );

            throw new Error(
                `Failed to send verification email. Brevo responded with HTTP ${response.status}: ${responseData.message || 'Unknown error'}`
            );

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error(`Failed to send verification email. Brevo API timed out after ${REQUEST_TIMEOUT_MS}ms.`);
            }

            // Re-throw errors that we already crafted above
            if (error.message.startsWith('Failed to send')) {
                throw error;
            }

            // Unexpected network / runtime error
            console.error(`[Brevo] Unexpected error sending email to ${to}:`, error.message);
            throw new Error(`Failed to send verification email. Network error: ${error.message}`);
        }
    }
}

module.exports = BrevoService;
