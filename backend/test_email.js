require('dotenv').config({ path: './.env' });
const sendEmail = require('./src/utils/sendEmail');

async function test() {
    console.log('Testing email...');
    try {
        await sendEmail({
            email: 'qaviashraf100@gmail.com',
            cc: 'qavi@yopmail.com',
            subject: 'Test Email from AMMA Backend',
            message: 'This is a test email.',
            html: '<p>This is a test email.</p>'
        });
        console.log('Email sent successfully!');
    } catch (err) {
        console.error('Email failed to send:', err);
    }
}

test();
