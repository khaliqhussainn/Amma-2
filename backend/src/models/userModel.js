const { pool } = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return users[0];
    }

    static async findById(id) {
        const [users] = await pool.query(`
            SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
                   p.plan_id, p.package, p.title, p.phone, p.cityState, p.country, 
                   p.profession, p.specialty, p.employer, p.job_role, 
                   p.licenseNumber, p.licensingState, p.trainingInstitution, p.payment_status,
                   sp.name as plan_name, sp.price as plan_price
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            LEFT JOIN subscription_plans sp ON p.plan_id = sp.id
            WHERE u.id = ? AND u.deleted_at IS NULL
        `, [id]);
        return users[0];
    }

    static async findByResetOtp(otp, email) {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE reset_otp = ? AND email = ? AND reset_otp_expire > ?',
            [otp, email, Date.now()]
        );
        return users[0];
    }

    static async findByGoogleId(googleId) {
        const [users] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
        return users[0];
    }

    static async updatePassword(id, password) {
        await pool.query(
            'UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expire = NULL WHERE id = ?',
            [password, id]
        );
    }

    static async linkGoogleAccount(id, googleId) {
        await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, id]);
    }

    static async updateResetOtp(id, otp, expire) {
        await pool.query(
            'UPDATE users SET reset_otp = ?, reset_otp_expire = ? WHERE id = ?',
            [otp, expire, id]
        );
    }

    static async updateMfaOtp(id, otp, expire) {
        await pool.query(
            'UPDATE users SET mfa_otp = ?, mfa_otp_expire = ? WHERE id = ?',
            [otp, expire, id]
        );
    }

    static async findByMfaOtp(otp, email) {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE mfa_otp = ? AND email = ? AND mfa_otp_expire > ?',
            [otp, email, Date.now()]
        );
        return users[0];
    }

    static async checkUserDevice(userId, deviceId) {
        const [devices] = await pool.query(
            'SELECT * FROM user_devices WHERE user_id = ? AND device_identifier = ?',
            [userId, deviceId]
        );
        return devices.length > 0;
    }

    static async addUserDevice(userId, deviceId) {
        await pool.query(
            'INSERT INTO user_devices (user_id, device_identifier) VALUES (?, ?)',
            [userId, deviceId]
        );
    }

    static async create(userData) {
        const { name, email, password, role, status, profile } = userData;

        // Start transaction manually since we're inserting into two tables
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [userResult] = await connection.query(
                'INSERT INTO users (name, email, password, role, status, google_id) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, password || null, role || 'MEMBER', status || 'APPROVED', userData.googleId || null]
            );

            const userId = userResult.insertId;

            if (profile) {
                await connection.query(
                    `INSERT INTO profiles 
                    (user_id, plan_id, package, title, phone, cityState, country, profession, specialty, employer, job_role, licenseNumber, licensingState, trainingInstitution, payment_status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId, profile.plan_id || null, profile.package || null, profile.title || null, profile.phone || null,
                        profile.cityState || null, profile.country || null, profile.profession || null,
                        profile.specialty || null, profile.employer || null, profile.job_role || null,
                        profile.licenseNumber || null, profile.licensingState || null, profile.trainingInstitution || null,
                        profile.payment_status || 'PENDING'
                    ]
                );
            }

            await connection.commit();
            return userId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateProfile(userId, data) {
        const { name, ...profileData } = data;
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Update user name if provided
            if (name) {
                await connection.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
            }

            // Update profile
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(profileData)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }

            if (fields.length > 0) {
                values.push(userId);
                await connection.query(
                    `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = ?`,
                    values
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        await pool.query('UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = "BLOCKED" WHERE id = ?', [id]);
        return true;
    }
}

module.exports = UserModel;
