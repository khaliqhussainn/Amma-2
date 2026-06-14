const { pool } = require('./src/config/db');
require('dotenv').config();

const migrateStatuses = async () => {
    console.log('Migrating all users to APPROVED status...');
    try {
        const [result] = await pool.query("UPDATE users SET status = 'APPROVED' WHERE status IS NULL OR status = 'PENDING'");
        console.log(`Successfully updated ${result.affectedRows} users to APPROVED.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateStatuses();
