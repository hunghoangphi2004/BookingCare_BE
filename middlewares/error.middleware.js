// middlewares/error.middleware.js
module.exports = (err, req, res, next) => {
    console.error(err); // log chi tiết để debug

    const statusCode = err.statusCode || 500;
    const status = err.status || (statusCode >= 400 && statusCode < 500 ? 'fail' : 'error');

    // 1. Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            status: 'fail',
            statusCode: 400,
            message: err.message
        });
    }

    // 2. Duplicate key (unique field)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            status: 'fail',
            statusCode: 409,
            message: `Duplicate value for field: ${field}`
        });
    }

    // 3. CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            status: 'fail',
            statusCode: 400,
            message: `Invalid ${err.path}: ${err.value}`
        });
    }

    // 4. Custom AppError
    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            status,
            statusCode,
            message: err.message
        });
    }

    // 5. Mặc định: Internal Server Error
    res.status(statusCode).json({
        success: false,
        status,
        statusCode,
        message: 'Internal Server Error',
        error: err.message
    });
};
