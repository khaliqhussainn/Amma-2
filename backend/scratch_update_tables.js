const { pool } = require('./src/config/db');

async function updateTables() {
    try {
        console.log('Updating tables...');
        
        // Contact Inquiries
        const [contactCols] = await pool.query('SHOW COLUMNS FROM contact_inquiries LIKE "status"');
        if (contactCols.length === 0) {
            await pool.query('ALTER TABLE contact_inquiries ADD COLUMN status ENUM("PENDING", "REPLIED", "CLOSED") DEFAULT "PENDING"');
            console.log('Added status to contact_inquiries');
        }

        // Coming Soon
        const [comingSoonCols] = await pool.query('SHOW COLUMNS FROM coming_soon_inquiries LIKE "status"');
        if (comingSoonCols.length === 0) {
            await pool.query('ALTER TABLE coming_soon_inquiries ADD COLUMN status ENUM("PENDING", "REPLIED", "CLOSED") DEFAULT "PENDING"');
            console.log('Added status to coming_soon_inquiries');
        }

        console.log('Tables updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateTables();
