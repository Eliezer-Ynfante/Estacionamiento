const jwt = require('jsonwebtoken');

exports.cookieJwtAuth = (req, res, next) => {
    let token = req.cookies.token;

    // Si no hay token en cookies, intentar obtenerlo del header Authorization
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Extrae el token después de "Bearer "
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Acceso denegado. No se encontró un token activo.'
        });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).json({
            success: false,
            error: 'Sesión expirada o inválida. Por favor, inicia sesión de nuevo.'
        });
    }
};