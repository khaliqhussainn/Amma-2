const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool instead of a single connection for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amma_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database schema if tables don't exist
const initDB = async () => {
    try {
        // Create DB if not exists (requires connecting without database first)
        const rootPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'amma_portal'}\``);
        await rootPool.end();

        const connection = await pool.getConnection();

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NULL,
                role ENUM('MEMBER', 'ADMIN') DEFAULT 'MEMBER',
                status ENUM('PENDING', 'APPROVED', 'BLOCKED') DEFAULT 'PENDING',
                google_id VARCHAR(255) NULL UNIQUE,
                reset_otp VARCHAR(10) NULL,
                reset_otp_expire BIGINT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Migration: Add columns if they don't exist (for existing databases)
        const [columns] = await connection.query('SHOW COLUMNS FROM users');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('status')) {
            await connection.query("ALTER TABLE users ADD COLUMN status ENUM('PENDING', 'APPROVED', 'BLOCKED') DEFAULT 'APPROVED' AFTER role");
        }
        if (!columnNames.includes('google_id')) {
            await connection.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE AFTER status');
        }
        if (!columnNames.includes('reset_otp')) {
            await connection.query('ALTER TABLE users ADD COLUMN reset_otp VARCHAR(10) NULL AFTER google_id');
        }
        if (!columnNames.includes('reset_otp_expire')) {
            await connection.query('ALTER TABLE users ADD COLUMN reset_otp_expire BIGINT NULL AFTER reset_otp');
        }
        if (!columnNames.includes('mfa_otp')) {
            await connection.query('ALTER TABLE users ADD COLUMN mfa_otp VARCHAR(10) NULL AFTER reset_otp_expire');
        }
        if (!columnNames.includes('mfa_otp_expire')) {
            await connection.query('ALTER TABLE users ADD COLUMN mfa_otp_expire BIGINT NULL AFTER mfa_otp');
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_devices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                device_identifier VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Ensure password is nullable for Google users
        await connection.query('ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                package VARCHAR(255),
                title VARCHAR(100),
                phone VARCHAR(50),
                cityState VARCHAR(100),
                country VARCHAR(100),
                profession VARCHAR(100),
                specialty VARCHAR(100),
                employer VARCHAR(255),
                job_role VARCHAR(100),
                licenseNumber VARCHAR(100),
                licensingState VARCHAR(100),
                trainingInstitution VARCHAR(255),
                payment_status ENUM('PENDING', 'PAID', 'EXEMPT') DEFAULT 'PENDING',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Migration: Add payment_status if it doesn't exist
        const [profileColumns] = await connection.query('SHOW COLUMNS FROM profiles');
        const profileColumnNames = profileColumns.map(c => c.Field);
        if (!profileColumnNames.includes('payment_status')) {
            await connection.query("ALTER TABLE profiles ADD COLUMN payment_status ENUM('PENDING', 'PAID', 'EXEMPT') DEFAULT 'PENDING' AFTER trainingInstitution");
        }

        // New Tables for Admin Portal
        await connection.query(`
            CREATE TABLE IF NOT EXISTS contact_inquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status ENUM('NEW', 'READ', 'RESPONDED') DEFAULT 'NEW',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                status ENUM('ACTIVE', 'UNSUBSCRIBED') DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS coming_soon_inquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL,
                interest_area VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS subscription_plans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                price DECIMAL(10, 2) DEFAULT 0.00,
                duration_months INT DEFAULT 12,
                status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Migration: Add plan_id and deleted_at to profiles and plans
        const [profileColumnsUpdate] = await connection.query('SHOW COLUMNS FROM profiles');
        const profileColumnNamesUpdate = profileColumnsUpdate.map(c => c.Field);
        if (!profileColumnNamesUpdate.includes('plan_id')) {
            await connection.query("ALTER TABLE profiles ADD COLUMN plan_id INT NULL AFTER user_id");
            await connection.query("ALTER TABLE profiles ADD CONSTRAINT fk_profile_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL");
        }

        const [planColumns] = await connection.query('SHOW COLUMNS FROM subscription_plans');
        const planColumnNames = planColumns.map(c => c.Field);
        if (!planColumnNames.includes('deleted_at')) {
            await connection.query("ALTER TABLE subscription_plans ADD COLUMN deleted_at TIMESTAMP NULL AFTER status");
        }

        if (!columnNames.includes('deleted_at')) {
            await connection.query("ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL AFTER status");
        }

        // Check if admin exists
        const [admins] = await connection.query(`SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`);
        if (admins.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.query(`
                INSERT INTO users (name, email, password, role, status) 
                VALUES ('Admin User', 'admin@amma.com', ?, 'ADMIN', 'APPROVED')
            `, [hashedPassword]);
            console.log('Default admin created: admin@amma.com / admin123');
        }

        connection.release();
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        throw error;
    }
};

module.exports = { pool, initDB };
