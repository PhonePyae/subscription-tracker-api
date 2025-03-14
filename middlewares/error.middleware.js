const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err }; // Copy the error object
        error.message = err.message; // Ensure message is preserved

        console.error(err); // Log the error for debugging

        // Mongoose Bad ObjectId (Invalid MongoDB ID)
        if (err.name === 'CastError') { 
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose Duplicate Key Error (Unique constraint violation)
        if (err.code === 11000) { 
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose Validation Error (Schema validation failed)
        if (err.name === 'ValidationError') { 
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        // Send error response with appropriate status code and message
        res.status(error.statusCode || 500).json({ 
            success: false, 
            error: error.message || 'Server Error' 
        });

    } catch (catchError) { 
        next(catchError); // Forward unexpected errors to the next middleware
    }
};

export default errorMiddleware;