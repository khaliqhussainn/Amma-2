const express = require('express');
const { getAdminDashboard, updateMemberStatus, updateInquiryStatus, exportData, backupDatabase, deleteMember } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware to ensure user is ADMIN
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

router.get('/dashboard', protect, adminOnly, getAdminDashboard);
router.get('/export', protect, adminOnly, exportData);
router.get('/database/backup', protect, adminOnly, backupDatabase);
router.patch('/members/:id/status', protect, adminOnly, updateMemberStatus);
router.patch('/inquiries/:id/status', protect, adminOnly, updateInquiryStatus);
router.delete('/members/:id', protect, adminOnly, deleteMember);

module.exports = router;
