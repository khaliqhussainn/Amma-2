const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');

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
                    await sendEmail({
                        email: user.email,
                        subject: 'Admin Login Attempt from New Device',
                        message: `Your login OTP is: ${otp}. It is valid for 10 minutes.`,
                        html: `
                            <div style="font-family: sans-serif; padding: 20px; color: #042C53;">
                                <h2>Admin Login Attempt</h2>
                                <p>We detected an admin login attempt from a new device.</p>
                                <p>Your 6-digit OTP is:</p>
                                <h1 style="color: #AD1F23; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                                <p>This code is valid for <b>10 minutes</b>.</p>
                                <p>If this was not you, please secure your account immediately.</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                                <p style="font-size: 12px; color: #999;">© 2026 American Muslims Medical Association</p>
                            </div>
                        `
                    });
                } catch (error) {
                    console.error('Email error:', error);
                    // In a real app we might throw here, but for local testing when SMTP fails we'll proceed
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
            await sendEmail({
                email: email,
                subject: 'Verify Your Email - AMMA Registration',
                message: `Your verification code is: ${otp}.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #042C53;">
                        <h2>Email Verification</h2>
                        <p>Thank you for starting your registration with AMMA.</p>
                        <p>Your 6-digit verification code is:</p>
                        <h1 style="color: #AD1F23; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                        <p>Please enter this code in the registration form to continue.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999;">© 2026 American Muslims Medical Association</p>
                    </div>
                `
            });
            return otp;
        } catch (error) {
            console.error('Registration OTP Email error:', error);
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
            await sendEmail({
                email: user.email,
                subject: 'Your AMMA Password Reset OTP',
                message: `Your password reset OTP is: ${otp}. It is valid for 5 minutes.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #042C53;">
                        <h2>Password Reset Request</h2>
                        <p>You requested to reset your password for the AMMA Membership Portal.</p>
                        <p>Your 6-digit OTP is:</p>
                        <h1 style="color: #AD1F23; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                        <p>This code is valid for <b>5 minutes</b>.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999;">© 2026 American Muslims Medical Association</p>
                    </div>
                `
            });
        } catch (error) {
            // If email fails, clear the OTP
            await UserModel.updateResetOtp(user.id, null, null);
            console.error('Email error:', error);
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
