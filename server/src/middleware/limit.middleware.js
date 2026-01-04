const rateLimit = require('express-rate-limit');

const limit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100,
    message: { success: false, message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limit;