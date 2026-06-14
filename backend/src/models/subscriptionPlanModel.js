const { pool } = require('../config/db');

class SubscriptionPlan {
    static async getAll() {
        const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE deleted_at IS NULL ORDER BY created_at DESC');
        return plans;
    }

    static async getActive() {
        const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE status = "ACTIVE" AND deleted_at IS NULL ORDER BY price ASC');
        return plans;
    }

    static async findById(id) {
        const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ? AND deleted_at IS NULL', [id]);
        return plans[0];
    }

    static async findByName(name) {
        const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE name = ? AND deleted_at IS NULL', [name]);
        return plans[0];
    }

    static async create(planData) {
        const { name, description, price, duration_months, status } = planData;
        const [result] = await pool.query(
            'INSERT INTO subscription_plans (name, description, price, duration_months, status) VALUES (?, ?, ?, ?, ?)',
            [name, description, price || 0, duration_months || 12, status || 'ACTIVE']
        );
        return result.insertId;
    }

    static async update(id, planData) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(planData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await pool.query(
            `UPDATE subscription_plans SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.query('UPDATE subscription_plans SET deleted_at = CURRENT_TIMESTAMP, status = "INACTIVE" WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async seedInitialPlans() {
        const plans = [
            { name: "Physicians & Dentists", description: "Membership for physicians, dentists, and other high-level medical professionals.", price: 0, duration_months: 12 },
            { name: "Other Licensed Healthcare Professionals", description: "Membership for NPs, PAs, Nurses, Pharmacists, and other licensed clinicians.", price: 0, duration_months: 12 },
            { name: "Allied Staff", description: "Membership for healthcare administrators, medical assistants, and public health professionals.", price: 0, duration_months: 12 },
            { name: "Trainees & Students", description: "Membership for residents, fellows, and medical/dental students.", price: 0, duration_months: 12 }
        ];

        for (const plan of plans) {
            const existing = await this.findByName(plan.name);
            if (!existing) {
                await this.create(plan);
            }
        }
    }
}

module.exports = SubscriptionPlan;
