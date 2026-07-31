const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Ensure we load from the backend root .env file regardless of where script is run from
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedAdmin = async () => {
    try {
        console.log('Connecting to database...');
        
        // Connect to MySQL server (without specific DB) to ensure DB exists
        const rootPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });
        
        const dbName = process.env.DB_NAME || 'amma_portal';
        await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await rootPool.end();

        // Connect to the specific DB
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
        });

        // Ensure users table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('MEMBER', 'ADMIN') DEFAULT 'MEMBER',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        const email = 'admin@amma.com';
        const rawPassword = 'admin123';
        
        // Check if admin already exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existing.length > 0) {
            console.log(`Admin user ${email} already exists in the database!`);
        } else {
            console.log(`Creating admin user: ${email}...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(rawPassword, salt);
            
            await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['AMMA Admin', email, hashedPassword, 'ADMIN']
            );
            console.log(`✅ Successfully seeded admin!`);
            console.log(`Email: ${email}`);
            console.log(`Password: ${rawPassword}`);
        }

        await pool.end();
        console.log('Seeding finished. Exiting...');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
        process.exit(1);
    }
};

seedAdmin();
