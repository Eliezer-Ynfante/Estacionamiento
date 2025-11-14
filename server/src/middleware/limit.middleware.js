const rateLimit = require('express-rate-limit');

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: { success: false, message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limit;