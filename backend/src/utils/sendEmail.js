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
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 15000       // 15 seconds
    });

    // Define email options
    // NOTE: Gmail usually requires the 'from' to match the 'user'
    const mailOptions = {
        from: `"AMMA Membership" <${process.env.EMAIL_FROM || 'membership@ammanational.org'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
        ...(options.cc && { cc: options.cc }),
    };

    // Actually send the email with timeout
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Email sending failed to ${options.email}:`, error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
