export function globalErrorHandler(err, req, res, _next) {
    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    return res.status(500).json({
        message: 'Something went wrong', success: false,
    });
}
