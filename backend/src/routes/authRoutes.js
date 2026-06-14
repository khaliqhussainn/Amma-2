const express = require('express');
const { loginUser, getMe, registerUser, forgotPassword, verifyOtp, resetPassword, googleLogin, updateProfile, checkStatus, sendRegistrationOtp, verifyAdminMfa } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/verify-mfa', verifyAdminMfa);
router.post('/send-registration-otp', sendRegistrationOtp);
router.put('/reset-password', resetPassword);
router.post('/google-login', googleLogin);
router.get('/status/:id', checkStatus);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
