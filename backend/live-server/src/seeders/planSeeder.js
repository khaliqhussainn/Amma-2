const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedPlans = async () => {
    try {
        console.log('Connecting to database...');
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'amma_portal',
        });

        const plans = [
            { name: "Physicians & Dentists", description: "Membership for physicians, dentists, and other high-level medical professionals.", price: 0, duration_months: 12 },
            { name: "Other Licensed Healthcare Professionals", description: "Membership for NPs, PAs, Nurses, Pharmacists, and other licensed clinicians.", price: 0, duration_months: 12 },
            { name: "Allied Staff", description: "Membership for healthcare administrators, medical assistants, and public health professionals.", price: 0, duration_months: 12 },
            { name: "Trainees & Students", description: "Membership for residents, fellows, and medical/dental students.", price: 0, duration_months: 12 }
        ];

        for (const plan of plans) {
            const [existing] = await pool.query('SELECT * FROM subscription_plans WHERE name = ?', [plan.name]);
            if (existing.length === 0) {
                console.log(`Creating plan: ${plan.name}...`);
                await pool.query(
                    'INSERT INTO subscription_plans (name, description, price, duration_months, status) VALUES (?, ?, ?, ?, ?)',
                    [plan.name, plan.description, plan.price, plan.duration_months, 'ACTIVE']
                );
            } else {
                console.log(`Plan already exists: ${plan.name}`);
            }
        }

        await pool.end();
        console.log('✅ Plan seeding finished.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding plans:', error.message);
        process.exit(1);
    }
};

seedPlans();
