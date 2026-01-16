const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log detallado para auditoría (solo en servidor)
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, {
        statusCode,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Mensajes genéricos para el cliente (sin detalles técnicos)
    const clientResponse = {
        success: false,
        message: 'Hubo un problema procesando tu solicitud. Por favor intenta de nuevo.'
    };

    // En desarrollo, mostrar más detalles
    if (process.env.NODE_ENV === 'development') {
        clientResponse.error = err.message;
    }

    res.status(statusCode).json(clientResponse);
};

module.exports = { notFound, errorHandler };
