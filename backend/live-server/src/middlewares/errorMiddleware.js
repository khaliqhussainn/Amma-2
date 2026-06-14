const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // MySQL specific errors
    if (err.code === 'ER_DUP_ENTRY') {
        err.statusCode = 400;
        err.message = 'Duplicate field value entered';
    }

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };
