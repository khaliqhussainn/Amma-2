const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
    console.log('Testing email with config:');
    console.log('Host:', process.env.EMAIL_HOST);
    console.log('Port:', process.env.EMAIL_PORT);
    console.log('User:', process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"AMMA Test" <${process.env.EMAIL_USER}>`,
            to: "ashrafbhatti1000@gmail.com",
            subject: "Test Email",
            text: "This is a test email from AMMA Portal.",
        });
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('Email failed:', error);
    }
};

testEmail();
