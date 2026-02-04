const rateLimit = require('express-rate-limit');

const limite = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limite;