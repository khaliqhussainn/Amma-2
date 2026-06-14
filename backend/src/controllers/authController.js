const asyncHandler = require('express-async-handler');
const AuthService = require('../services/authService');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password, remember } = req.body;
    const deviceId = req.cookies.amma_device_id;
    
    const result = await AuthService.loginUser(email, password, remember, deviceId);

    if (result.requiresMfa) {
        return res.json({
            success: true,
            requiresMfa: true,
            email: result.email
        });
    }

    res.json({
        success: true,
        user: result.user,
        token: result.token,
    });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
    const { user, token } = await AuthService.registerUser(req.body);

    res.status(201).json({
        success: true,
        user,
        token,
    });
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    // req.user is set in protect middleware
    res.json({
        success: true,
        user: req.user
    });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    await AuthService.forgotPassword(req.body.email);

    res.json({
        success: true,
        message: '6-digit OTP sent to your email'
    });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    await AuthService.verifyOtp(email, otp);

    res.json({
        success: true,
        message: 'OTP verified successfully'
    });
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, password } = req.body;
    await AuthService.resetPassword(email, otp, password);

    res.json({
        success: true,
        message: 'Password reset successful'
    });
});

// @desc    Google Login
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = asyncHandler(async (req, res, next) => {
    const { user, token } = await AuthService.googleLogin(req.body);

    res.json({
        success: true,
        user,
        token
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
    const updatedUser = await AuthService.updateProfile(req.user.id, req.body);

    res.json({
        success: true,
        user: updatedUser
    });
});

const sendRegistrationOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const otp = await AuthService.sendRegistrationOtp(email);

    res.json({
        success: true,
        message: 'Verification code sent to your email',
        otp // In a real app, we wouldn't send this back, but for simplicity we can or store in session
    });
});

const verifyAdminMfa = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    const { user, token, deviceId } = await AuthService.verifyAdminMfa(email, otp);

    res.cookie('amma_device_id', deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
        success: true,
        user,
        token
    });
});

const checkStatus = asyncHandler(async (req, res, next) => {
    const user = await AuthService.checkStatus(req.params.id);
    let token = null;
    if (user.role === 'ADMIN' || user.status === 'APPROVED') {
        token = AuthService.generateToken(user.id);
    }
    res.json({
        success: true,
        status: user.status,
        token
    });
});

module.exports = {
    loginUser,
    registerUser,
    getMe,
    forgotPassword,
    verifyOtp,
    resetPassword,
    googleLogin,
    updateProfile,
    checkStatus,
    sendRegistrationOtp,
    verifyAdminMfa
};
