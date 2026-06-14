require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTPConnection() {
    console.log('Testing SMTP connection...');
    console.log('Host:', process.env.EMAIL_HOST);
    console.log('Port:', process.env.EMAIL_PORT);
    console.log('User:', process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // IMPORTANT for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});

    try {
        console.log('\nVerifying connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        
        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'SMTP Test - ' + new Date().toISOString(),
            text: 'This is a test email to verify SMTP is working.',
            html: '<p>This is a test email to verify SMTP is working.</p>'
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        
    } catch (error) {
        console.error('❌ SMTP Error:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
    }
}

testSMTPConnection();
