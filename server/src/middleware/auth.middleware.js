const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

// ===============================
// Middleware para verificar token desde COOKIE
// ===============================
exports.verifyToken = (req, res, next) => {
  try {
    //OPCIÓN 1: Leer token desde cookie (MÁS SEGURO)
    let token = req.cookies.accessToken;
    
    //OPCIÓN 2: Si no hay cookie, intentar leer desde header Authorization (compatibilidad)
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token no proporcionado. Por favor inicie sesión.' 
      });
    }

    // Verificar token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false, 
            message: 'Token expirado. Por favor inicie sesión nuevamente.',
            code: 'TOKEN_EXPIRED'
          });
        }
        return res.status(403).json({ 
          success: false, 
          message: 'Token inválido' 
        });
      }

      // Adjuntar información del usuario a la request
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Error en verificación de token:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al verificar token' 
    });
  }
};

// ===============================
// Middleware de autorización por roles
// ===============================
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    const userRole = req.user.rol_id;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tiene permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

// ===============================
// Middleware para verificar propietario del recurso
// ===============================
exports.isOwner = (req, res, next) => {
  const userIdFromToken = req.user?.usuario_id;
  const userIdFromParam = parseInt(req.params.id);

  // Permitir si es el mismo usuario O es admin (rol_id = 1)
  if (userIdFromToken === userIdFromParam || req.user?.rol_id === 1) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'No tiene permisos para modificar este recurso'
  });
};