const InquiryModel = require('../models/inquiryModel');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');
const SubscriptionPlan = require('../models/subscriptionPlanModel');
const ExcelJS = require('exceljs');
const BrevoService = require('../services/brevoService');
const { pool } = require('../config/db');

// @desc    Get all dashboard data for admin
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = asyncHandler(async (req, res) => {
    const members = await InquiryModel.getAllMembers();
    const contactInquiries = await InquiryModel.getAllContactInquiries();
    const newsletterSubscribers = await InquiryModel.getAllNewsletterSubscriptions();
    const comingSoonInquiries = await InquiryModel.getAllComingSoonInquiries();
    const subscriptionPlans = await SubscriptionPlan.getAll();

    res.json({
        success: true,
        data: {
            members,
            contactInquiries,
            newsletterSubscribers,
            comingSoonInquiries,
            subscriptionPlans
        }
    });
});

// @desc    Submit contact inquiry
// @route   POST /api/public/contact
// @access  Public
const submitContactInquiry = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        throw new AppError('Please provide name, email and message', 400);
    }
    
    await InquiryModel.createContactInquiry(req.body);

    // Respond to the user immediately — don't make them wait for email
    res.status(201).json({ success: true, message: 'Inquiry sent successfully!' });

    // Notify admin team in the background (fire-and-forget)
    const ADMIN_EMAILS = ['info@ammanational.org', 'bpiracha@hotmail.com', 'abdur833@yahoo.com'];
    BrevoService.sendTransactionalEmail({
        to:      ADMIN_EMAILS[0],
        subject: `[AMMA Contact] ${subject || 'New Inquiry'} — from ${name}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #042C53; margin-bottom: 4px;">New Contact Inquiry</h2>
                <p style="color: #888; font-size: 13px; margin-top: 0;">Received via AMMA Contact Form</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="padding: 6px 0; color: #555; width: 80px;"><strong>From</strong></td><td style="padding: 6px 0;">${name}</td></tr>
                    <tr><td style="padding: 6px 0; color: #555;"><strong>Email</strong></td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #AD1F23;">${email}</a></td></tr>
                    <tr><td style="padding: 6px 0; color: #555;"><strong>Subject</strong></td><td style="padding: 6px 0;">${subject || 'N/A'}</td></tr>
                </table>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
                <p style="font-size: 13px; color: #555; white-space: pre-wrap;">${message}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 11px; color: #aaa;">© 2026 AMMA National Headquarters</p>
            </div>
        `,
        text: `New contact inquiry received.\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`
    }).catch(err => console.error('[ContactInquiry] Admin email failed:', err.message));
});

// @desc    Subscribe to newsletter
// @route   POST /api/public/subscribe
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new AppError('Please provide an email', 400);
    }
    
    await InquiryModel.subscribeNewsletter(email);
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
});

// @desc    Submit coming soon interest
// @route   POST /api/public/coming-soon
// @access  Public
const submitComingSoon = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new AppError('Please provide an email', 400);
    }
    
    await InquiryModel.createComingSoonInquiry(req.body);
    res.status(201).json({ success: true, message: 'Interest registered successfully!' });
});

// @desc    Update member payment status
// @route   PATCH /api/admin/members/:id/status
// @access  Private/Admin
const updateMemberStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!['PENDING', 'APPROVED', 'BLOCKED'].includes(status)) {
        throw new AppError('Invalid status. Must be PENDING, APPROVED, or BLOCKED', 400);
    }

    const success = await InquiryModel.updateMemberStatus(id, status);
    if (!success) {
        throw new AppError('Member not found or status already set', 404);
    }

    // Send notification email
    try {
        const member = await InquiryModel.getMemberById(id);
        if (member) {
            let subject = '';
            let message = '';
            let html = '';

            if (status === 'APPROVED') {
                subject = 'Welcome to AMMA - Your Membership is Approved!';
                message = `Hello ${member.name},\n\nWe are pleased to inform you that your membership with AMMA has been approved. You can now access all features of the member portal.\n\nLogin here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login\n\nBest regards,\nAMMA Membership Team`;
                html = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #042C53;">Welcome to AMMA!</h2>
                        <p>Hello <strong>${member.name}</strong>,</p>
                        <p>We are pleased to inform you that your membership with <strong>American Muslim Medical Association (AMMA)</strong> has been approved.</p>
                        <p>You now have full access to the member portal, community features, and professional resources.</p>
                        <div style="margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #AD1F23; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
                        </div>
                        <p>If you have any questions, feel free to reply to this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">&copy; 2026 AMMA National Headquarters. All rights reserved.</p>
                    </div>
                `;
            } else if (status === 'BLOCKED') {
                subject = 'Important Information Regarding Your AMMA Membership';
                message = `Hello ${member.name},\n\nYour membership access has been updated. If you believe this is an error, please contact support.\n\nBest regards,\nAMMA Membership Team`;
            }

            if (subject) {
                await BrevoService.sendTransactionalEmail({
                    to:      member.email,
                    subject,
                    html,
                    text: message
                });
            }
        }
    } catch (emailError) {
        console.error('Failed to send status update email', emailError);
        // Don't throw error here to avoid breaking the status update process
    }

    res.json({ success: true, message: `Member status updated to ${status}` });
});

// @desc    Update inquiry status (contact, newsletter, coming-soon)
// @route   PATCH /api/admin/inquiries/:id/status
// @access  Private/Admin
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const { status, type } = req.body;
    const { id } = req.params;

    let success = false;
    switch (type) {
        case 'contactInquiries':
            success = await InquiryModel.updateContactInquiryStatus(id, status);
            break;
        case 'newsletterSubscribers':
            success = await InquiryModel.updateNewsletterStatus(id, status);
            break;
        case 'comingSoonInquiries':
            success = await InquiryModel.updateComingSoonStatus(id, status);
            break;
        default:
            throw new AppError('Invalid inquiry type', 400);
    }

    if (!success) {
        throw new AppError('Inquiry not found', 404);
    }

    res.json({ success: true, message: `Status updated to ${status}` });
});

// @desc    Export data to Excel based on type
// @route   GET /api/admin/export?type=...
// @access  Private/Admin
const exportData = asyncHandler(async (req, res) => {
    const { type } = req.query;
    const workbook = new ExcelJS.Workbook();
    let worksheet;
    let data = [];
    let filename = '';

    switch (type) {
        case 'contactInquiries':
            data = await InquiryModel.getAllContactInquiries();
            worksheet = workbook.addWorksheet('Contact Inquiries');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Subject', key: 'subject', width: 25 },
                { header: 'Message', key: 'message', width: 50 },
                { header: 'Date', key: 'created_at', width: 20 }
            ];
            filename = 'Contact_Inquiries';
            break;

        case 'newsletterSubscribers':
            data = await InquiryModel.getAllNewsletterSubscriptions();
            worksheet = workbook.addWorksheet('Newsletter Subscribers');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Email', key: 'email', width: 40 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Date', key: 'created_at', width: 20 }
            ];
            filename = 'Newsletter_Subscribers';
            break;

        case 'comingSoonInquiries':
            data = await InquiryModel.getAllComingSoonInquiries();
            worksheet = workbook.addWorksheet('Coming Soon Inquiries');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Email', key: 'email', width: 40 },
                { header: 'Interest Area', key: 'interest_area', width: 25 },
                { header: 'Date', key: 'created_at', width: 20 }
            ];
            filename = 'Coming_Soon_Inquiries';
            break;

        case 'subscriptionPlans':
            data = await SubscriptionPlan.getAll();
            worksheet = workbook.addWorksheet('Subscription Plans');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Price', key: 'price', width: 15 },
                { header: 'Duration (Mo)', key: 'duration_months', width: 15 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Description', key: 'description', width: 50 }
            ];
            filename = 'Subscription_Plans';
            break;

        default: // members
            data = await InquiryModel.getAllMembers();
            worksheet = workbook.addWorksheet('Members');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Role', key: 'role', width: 15 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Category', key: 'plan_name', width: 25 },
                { header: 'Title', key: 'title', width: 15 },
                { header: 'Profession', key: 'profession', width: 25 },
                { header: 'Specialty', key: 'specialty', width: 25 },
                { header: 'Employer', key: 'employer', width: 30 },
                { header: 'Job Role', key: 'job_role', width: 25 },
                { header: 'Phone', key: 'phone', width: 20 },
                { header: 'City/State', key: 'cityState', width: 25 },
                { header: 'Country', key: 'country', width: 15 },
                { header: 'License Number', key: 'licenseNumber', width: 20 },
                { header: 'Licensing State', key: 'licensingState', width: 20 },
                { header: 'Training Institution', key: 'trainingInstitution', width: 30 },
                { header: 'Joined At', key: 'created_at', width: 20 }
            ];
            filename = 'AMMA_Members';
    }

    // Format header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    data.forEach(item => {
        worksheet.addRow({
            ...item,
            created_at: new Date(item.created_at).toLocaleDateString()
        });
    });

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + filename + '_' + new Date().toISOString().split('T')[0] + '.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
});

// @desc    Download Database Backup (.sql)
// @route   GET /api/admin/database/backup
// @access  Private/Admin
const backupDatabase = asyncHandler(async (req, res) => {
    const [tables] = await pool.query('SHOW TABLES');
    const dbName = process.env.DB_NAME || 'amma_portal';
    let sqlDump = `-- AMMA Portal Database Backup\n-- Generated: ${new Date().toISOString()}\n\n`;
    sqlDump += `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;\nUSE \`${dbName}\`;\n\n`;

    for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0];
        
        // Get Create Table statement
        const [createResult] = await pool.query(`SHOW CREATE TABLE \`${tableName}\``);
        sqlDump += `${createResult[0]['Create Table']};\n\n`;

        // Get Data
        const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
        if (rows.length > 0) {
            sqlDump += `INSERT INTO \`${tableName}\` VALUES \n`;
            const inserts = rows.map(row => {
                const values = Object.values(row).map(val => {
                    if (val === null) return 'NULL';
                    if (typeof val === 'number') return val;
                    if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                    return `'${String(val).replace(/'/g, "''")}'`;
                });
                return `(${values.join(', ')})`;
            });
            sqlDump += inserts.join(',\n') + ';\n\n';
        }
    }

    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', `attachment; filename=AMMA_Backup_${new Date().toISOString().split('T')[0]}.sql`);
    res.send(sqlDump);
});

const UserModel = require('../models/userModel');

// @desc    Soft delete member
// @route   DELETE /api/admin/members/:id
// @access  Private/Admin
const deleteMember = asyncHandler(async (req, res) => {
    await UserModel.delete(req.params.id);
    res.json({ success: true, message: 'Member deleted successfully' });
});

module.exports = {
    getAdminDashboard,
    submitContactInquiry,
    subscribeNewsletter,
    submitComingSoon,
    updateMemberStatus,
    updateInquiryStatus,
    exportData,
    backupDatabase,
    deleteMember
};
