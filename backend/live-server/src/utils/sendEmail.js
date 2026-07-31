const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const isGmail = process.env.EMAIL_HOST.includes('gmail');
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Allow self-signed or non-matching certificates
        }
    });

    // Define email options
    // NOTE: Gmail usually requires the 'from' to match the 'user'
    const mailOptions = {
        from: `"AMMA Membership" <${process.env.EMAIL_FROM || 'membership@ammanational.org'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
