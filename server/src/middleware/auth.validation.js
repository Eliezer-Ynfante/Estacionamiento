const { body } = require('express-validator');

const validaciones = {
    registro: [
        body('nombre')
            .trim()
            .isLength({ min: 3, max: 150 })
            .withMessage('El nombre debe ser más extenso'),
        
        body('email')
            .isEmail()
            .withMessage('Debe proporcionar un email válido')
            .normalizeEmail(),
        
        body('telefono')
            .optional()
            .isInt()
            .withMessage('El teléfono debe ser un número válido'),
        
        body('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres')
            .matches(/\d/)
            .withMessage('La contraseña debe contener al menos un número')
    ],

    login: [
        body('email')
            .isEmail()
            .withMessage('Debe proporcionar un email válido')
            .normalizeEmail(),
        
        body('password')
            .notEmpty()
            .withMessage('La contraseña es requerida')
    ]
};

module.exports = validaciones;