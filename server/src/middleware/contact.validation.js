const { body, validationResult } = require('express-validator');

// Validaciones para el formulario de contacto
const contactValidations = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-záéíóúñ\s'-]+$/i)
        .withMessage('El nombre contiene caracteres no permitidos'),

    body('apellido')
        .trim()
        .notEmpty()
        .withMessage('El apellido es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .matches(/^[a-záéíóúñ\s'-]+$/i)
        .withMessage('El apellido contiene caracteres no permitidos'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debes proporcionar un email válido')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('El email no puede exceder 100 caracteres'),

    body('asunto')
        .trim()
        .notEmpty()
        .withMessage('El asunto es requerido')
        .isLength({ min: 3, max: 100 })
        .withMessage('El asunto debe tener entre 3 y 100 caracteres'),

    body('mensaje')
        .trim()
        .notEmpty()
        .withMessage('El mensaje es requerido')
        .isLength({ min: 10, max: 1000 })
        .withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            mensaje: 'Error en la validación del formulario',
            errores: errors.array().map(err => ({
                campo: err.param,
                mensaje: err.msg
            }))
        });
    }
    next();
};

module.exports = {
    contactValidations,
    handleValidationErrors
};
