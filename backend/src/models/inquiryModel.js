const { pool } = require('../config/db');

class InquiryModel {
    static async createContactInquiry(data) {
        const { name, email, subject, message } = data;
        const [result] = await pool.query(
            'INSERT INTO contact_inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        return result.insertId;
    }

    static async subscribeNewsletter(email) {
        // Use IGNORE to prevent error on duplicate email, or handle explicitly
        const [result] = await pool.query(
            'INSERT INTO newsletter_subscriptions (email) VALUES (?) ON DUPLICATE KEY UPDATE status = "ACTIVE"',
            [email]
        );
        return result.insertId;
    }

    static async createComingSoonInquiry(data) {
        const { email, interest_area } = data;
        const [result] = await pool.query(
            'INSERT INTO coming_soon_inquiries (email, interest_area) VALUES (?, ?)',
            [email, interest_area]
        );
        return result.insertId;
    }

    // Admin Methods
    static async getAllContactInquiries() {
        const [rows] = await pool.query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
        return rows;
    }

    static async getAllNewsletterSubscriptions() {
        const [rows] = await pool.query('SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC');
        return rows;
    }

    static async getAllComingSoonInquiries() {
        const [rows] = await pool.query('SELECT * FROM coming_soon_inquiries ORDER BY created_at DESC');
        return rows;
    }

    static async getAllMembers() {
        const [rows] = await pool.query(`
            SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
                   p.package, p.profession, p.specialty, p.phone, p.cityState, p.employer,
                   p.title, p.country, p.job_role, p.licenseNumber, p.licensingState, p.trainingInstitution,
                   sp.name as plan_name
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            LEFT JOIN subscription_plans sp ON p.plan_id = sp.id
            WHERE u.role = 'MEMBER' AND u.deleted_at IS NULL
            ORDER BY u.created_at DESC
        `);
        return rows;
    }

    static async updateMemberStatus(userId, status) {
        const [result] = await pool.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, userId]
        );
        return result.affectedRows > 0;
    }

    static async updateContactInquiryStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE contact_inquiries SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async updateNewsletterStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE newsletter_subscriptions SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async updateComingSoonStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE coming_soon_inquiries SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async getMemberById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = InquiryModel;
