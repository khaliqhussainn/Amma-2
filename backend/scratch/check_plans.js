const { pool } = require('../src/config/db');

async function checkPlans() {
    try {
        const [rows] = await pool.query('SELECT * FROM subscription_plans');
        console.log('Plans in DB:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkPlans();
