const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const REQUEST_TIMEOUT_MS = 8000; // 8 seconds timeout per request attempt
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000; // 1s initial delay for exponential backoff

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
        const parts = name.trim().split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        return { firstName, lastName };
    }

    /**
     * Strips null, undefined, and empty-string values from an attributes object.
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
     * Builds the full Brevo Contacts API payload from a user object.
     * @param {Object} user
     * @returns {Object}
     */
    static buildPayload(user) {
        const { firstName, lastName } = this.splitName(user.name);

        const rawAttributes = {
            FIRSTNAME:       firstName,
            LASTNAME:        lastName,
            PHONE:           user.phone           || null,
            CITY_STATE:      user.cityState        || null,
            COUNTRY:         user.country          || null,
            PROFESSION:      user.profession       || null,
            SPECIALTY:       user.specialty        || null,
            EMPLOYER:        user.employer         || null,
            JOB_ROLE:        user.job_role         || null,
            STATUS:          user.status           || null,
            ROLE:            user.role             || null,
            PAYMENT_STATUS:  user.payment_status   || null,
            MEMBERSHIP_PLAN: user.plan_name        || null
        };

        const attributes = this.sanitizeAttributes(rawAttributes);

        // Support single or comma-separated list IDs from environment
        const listIdEnv = process.env.BREVO_LIST_ID;
        const listIds = listIdEnv
            ? listIdEnv.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
            : [];

        const payload = {
            email: user.email.toLowerCase().trim(),
            attributes,
            updateEnabled: true // Upsert: creates or updates contact on duplicate email
        };

        if (listIds.length > 0) {
            payload.listIds = listIds;
        }

        return payload;
    }

    /**
     * Promise-based delay utility for exponential backoff.
     * @param {number} ms
     * @returns {Promise<void>}
     */
    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Syncs a user as a Brevo contact with retry logic, exponential backoff,
     * request timeouts, and structured logging.
     * @param {Object} user
     * @returns {Promise<{ success: boolean, message: string, data?: Object }>}
     */
    static async syncContact(user) {
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            console.warn('[Brevo] BREVO_API_KEY is not configured. Skipping contact sync.');
            return { success: false, message: 'BREVO_API_KEY not configured' };
        }

        if (!user || !user.email) {
            console.error('[Brevo] Validation error: user object is invalid or missing email.', { userId: user?.id });
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
                console.log(`[Brevo] Syncing contact: ${payload.email} (Attempt ${attempt}/${MAX_RETRIES})`);

                const response = await fetch(BREVO_API_URL, {
                    method: 'POST',
                    headers: {
                        'accept':       'application/json',
                        'content-type': 'application/json',
                        'api-key':      apiKey
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Success: 200 OK, 201 Created, 204 No Content
                if (response.ok) {
                    const data = response.status !== 204
                        ? await response.json().catch(() => ({}))
                        : {};
                    console.log(`[Brevo] Contact sync successful for ${payload.email}. HTTP ${response.status}`, data);
                    return { success: true, message: 'Contact synced successfully', data };
                }

                const errorData = await response.json().catch(() => ({}));
                const { status } = response;

                // Non-retryable: bad API key
                if (status === 401) {
                    console.error('[Brevo] 401 Unauthorized — BREVO_API_KEY is invalid. Aborting retries.');
                    return { success: false, message: 'Unauthorized: invalid API key' };
                }

                // Non-retryable: malformed payload
                if (status === 400) {
                    console.error(`[Brevo] 400 Bad Request for ${payload.email}:`, errorData);
                    return { success: false, message: errorData.message || 'Payload validation error' };
                }

                // Retryable: rate limit or server error (429, 500, 502, 503, 504)
                if (status === 429 || status >= 500) {
                    console.warn(`[Brevo] HTTP ${status} for ${payload.email} — ${errorData.message || 'retryable server error'}`);
                } else {
                    // Non-retryable unexpected status
                    console.error(`[Brevo] Unexpected HTTP ${status} for ${payload.email}:`, errorData);
                    return { success: false, message: `Unexpected API response: HTTP ${status}` };
                }

            } catch (err) {
                clearTimeout(timeoutId);

                if (err.name === 'AbortError') {
                    console.warn(`[Brevo] Timeout (${REQUEST_TIMEOUT_MS}ms) for ${payload.email} — Attempt ${attempt}/${MAX_RETRIES}`);
                } else {
                    // Network errors: DNS failure, connection reset, etc.
                    console.warn(`[Brevo] Network error for ${payload.email} — Attempt ${attempt}/${MAX_RETRIES}: ${err.message}`);
                }
            }

            // Backoff before next retry
            if (attempt < MAX_RETRIES) {
                console.log(`[Brevo] Retrying in ${delay}ms...`);
                await this.wait(delay);
                delay *= 2; // 1000ms → 2000ms → 4000ms
            }
        }

        console.error(`[Brevo] All ${MAX_RETRIES} attempts failed for ${payload.email}. Contact not synced.`);
        return { success: false, message: 'Max retries exceeded' };
    }
}

module.exports = BrevoService;
