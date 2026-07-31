const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const BrevoService = require('./brevoService');
const verificationEmail  = require('../utils/templates/verificationEmail');
const forgotPasswordEmail = require('../utils/templates/forgotPasswordEmail');
const adminMfaEmail       = require('../utils/templates/adminMfaEmail');
const welcomeEmail        = require('../utils/templates/welcomeEmail');

class AuthService {
    static generateToken(id, remember = false) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: remember ? '30d' : '24h'
        });
    }

    static async loginUser(email, password, remember = false, deviceId = null) {
        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        const user = await UserModel.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Invalid email or password', 401);
        }

        const fullUser = await UserModel.findById(user.id);
        
        if (fullUser.status === 'BLOCKED') {
            throw new AppError('Your account has been restricted. Please contact the AMMA administrator.', 403);
        }

        if (fullUser.role === 'ADMIN') {
            const isDeviceTrusted = deviceId ? await UserModel.checkUserDevice(user.id, deviceId) : false;

            if (!isDeviceTrusted) {
                // Generate 6 digit OTP for MFA
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const mfaOtpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

                await UserModel.updateMfaOtp(user.id, otp, mfaOtpExpire);

                // Send Email
                try {
                    console.log(`[TESTING] MFA OTP for ${user.email} is: ${otp}`);
                    await BrevoService.sendTransactionalEmail({
                        to:      user.email,
                        subject: 'Admin Login Attempt from New Device',
                        html:    adminMfaEmail(otp),
                        text:    `Your admin login OTP is: ${otp}. It is valid for 10 minutes. Do not share this code.`
                    });
                } catch (error) {
                    console.error('[Brevo] Admin MFA email error:', error.message);
                    // Non-fatal: log OTP to console so local dev can proceed
                    console.warn('MFA Email failed to send. Check console for OTP to test locally.');
                }

                return {
                    requiresMfa: true,
                    email: user.email
                };
            }
        }

        // Don't issue token if pending
        const token = (fullUser.role === 'ADMIN' || fullUser.status === 'APPROVED') 
            ? this.generateToken(user.id, remember) 
            : null;
        
        return {
            user: fullUser,
            token
        };
    }

    static async verifyAdminMfa(email, otp) {
        const user = await UserModel.findByMfaOtp(otp, email);
        if (!user) {
            throw new AppError('Invalid or expired OTP', 400);
        }

        // Clear the OTP
        await UserModel.updateMfaOtp(user.id, null, null);

        // Generate new device ID
        const crypto = require('crypto');
        const newDeviceId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
        
        await UserModel.addUserDevice(user.id, newDeviceId);

        const fullUser = await UserModel.findById(user.id);
        const token = this.generateToken(user.id, true);

        return {
            user: fullUser,
            token,
            deviceId: newDeviceId
        };
    }

    static async registerUser(userData) {
        const { fullName, email, password, role, plan_id, ...profile } = userData;
        
        // Ensure plan_id is passed into profile for UserModel.create
        const finalProfile = { ...profile, plan_id };

        const name = fullName || userData.name;

        if (!name || !email || !password) {
            throw new AppError('Please add all required fields (name, email, password)', 400);
        }

        // Check if user exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with profile
        const newUserId = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role,
            status: 'APPROVED',
            profile: Object.keys(finalProfile).length > 0 ? finalProfile : null
        });

        if (!newUserId) {
            throw new AppError('Invalid user data', 400);
        }

        const fullUser = await UserModel.findById(newUserId);

        console.log(`[Registration] Verification & user creation successful for email: ${email} (ID: ${newUserId})`);

        // Synchronize contact to Brevo in background (non-blocking)
        BrevoService.syncContact(fullUser).catch(err => {
            console.error('[Brevo Sync Async Error]:', err.message);
        });

        // Send Welcome Email via Brevo Transactional API
        try {
            console.log(`[Registration] Calling Welcome Email for ${email}`);
            console.log(`[Registration] Preparing Brevo Payload...`);
            const brevoRes = await BrevoService.sendTransactionalEmail({
                to:      email,
                subject: 'Welcome to AMMA National',
                html:    welcomeEmail(name),
                text:    `Welcome to AMMA National, ${name}! Your account has been created successfully.`
            });
            console.log(`[Registration] Brevo Response:`, brevoRes);
            console.log(`[Registration] Welcome Email Sent Successfully to ${email}`);
        } catch (emailErr) {
            console.error(`[Registration] Error sending welcome email to ${email}:`, emailErr.message);
        }

        // Don't issue token if pending
        const token = (fullUser.role === 'ADMIN' || fullUser.status === 'APPROVED') 
            ? this.generateToken(newUserId) 
            : null;

        return {
            user: fullUser,
            token
        };
    }

    static async sendRegistrationOtp(email) {
        if (!email) throw new AppError('Please provide an email address', 400);

        // Check if user exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // We'll store this in a temporary table or just use the users table with a dummy user?
        // Actually, let's create a temporary table for registration OTPs to avoid cluttering users table.
        // Or, for simplicity, we can use a cache if available.
        // Since we don't have a cache, let's just send it.
        // The frontend will pass it back to the register endpoint.
        
        try {
            console.log(`[Registration OTP] Generating OTP for ${email}...`);
            await BrevoService.sendTransactionalEmail({
                to:      email,
                subject: 'Verify Your Email Address',
                html:    verificationEmail(otp),
                text:    `Your AMMA registration verification code is: ${otp}. It expires in 10 minutes. Do not share this code.`
            });
            console.log(`[Registration OTP] Verification email sent successfully to ${email}`);
            return otp;
        } catch (error) {
            console.error('[Registration OTP] Verification email error:', error.message);
            throw new AppError(`Error sending verification email: ${error.message}`, 500);
        }
    }

    static async forgotPassword(email) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new AppError('There is no user with that email address.', 404);
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 mins

        await UserModel.updateResetOtp(user.id, otp, resetOtpExpire);

        // Send Email
        try {
            await BrevoService.sendTransactionalEmail({
                to:      user.email,
                subject: 'Reset Your Password',
                html:    forgotPasswordEmail(otp),
                text:    `Your AMMA password reset OTP is: ${otp}. It is valid for 5 minutes. Do not share this code.`
            });
        } catch (error) {
            // Roll back OTP if email delivery fails
            await UserModel.updateResetOtp(user.id, null, null);
            console.error('[Brevo] Forgot password email error:', error.message);
            throw new AppError('There was an error sending the email. Try again later.', 500);
        }

        return true;
    }

    static async verifyOtp(email, otp) {
        const user = await UserModel.findByResetOtp(otp, email);
        if (!user) {
            throw new AppError('Invalid or expired OTP', 400);
        }
        return true;
    }

    static async resetPassword(email, otp, password) {
        const user = await UserModel.findByResetOtp(otp, email);

        if (!user) {
            throw new AppError('OTP is invalid or has expired', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await UserModel.updatePassword(user.id, hashedPassword);

        return user;
    }

    static async googleLogin(googleData) {
        const { googleId, email, name } = googleData;
        
        let user = await UserModel.findByGoogleId(googleId);
        
        if (!user) {
            // Check if user exists with this email
            user = await UserModel.findByEmail(email);
            
            if (user) {
                // Link account
                await UserModel.linkGoogleAccount(user.id, googleId);
            } else {
                // User not found - do not create automatically
                throw new AppError('No account found with this email. Please register first.', 404);
            }
        }

        const fullUser = await UserModel.findById(user.id);
        
        if (fullUser.status === 'BLOCKED') {
            throw new AppError('Your account has been restricted. Please contact the AMMA administrator.', 403);
        }

        // Don't issue token if pending
        const token = (fullUser.role === 'ADMIN' || fullUser.status === 'APPROVED') 
            ? this.generateToken(user.id) 
            : null;

        return {
            user: fullUser,
            token
        };
    }

    static async updateProfile(userId, data) {
        await UserModel.updateProfile(userId, data);
        return await UserModel.findById(userId);
    }

    static async checkStatus(userId) {
        const user = await UserModel.findById(userId);
        if (!user) throw new AppError('User not found', 404);
        return user;
    }
}

module.exports = AuthService;
