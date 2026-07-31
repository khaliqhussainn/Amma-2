const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await UserModel.findById(decoded.id);
            
            if (!user) {
                return next(new AppError('The user belonging to this token does no longer exist.', 401));
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            return next(new AppError('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

module.exports = { protect, restrictTo };
