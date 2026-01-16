const { body, param, validationResult } = require('express-validator');

const validar = [
    body('plaza_id')
        .isInt({ min: 1 })
        .withMessage('ID de plaza inválido'),
    body('fecha_hora_inicio')
        .isISO8601()
        .withMessage('Fecha de inicio inválida'),
    body('fecha_hora_fin')
        .isISO8601()
        .withMessage('Fecha de fin inválida'),
    body('card')
        .isLength({ min: 13, max: 19 })
        .isNumeric()
        .withMessage('Número de tarjeta inválido'),
    body('cvv')
        .isLength({ min: 3, max: 4 })
        .isNumeric()
        .withMessage('CVV inválido'),
    body('fecha_expire')
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
        .withMessage('Fecha de expiración inválida (formato MM/YY)'),
    // Validación condicional: si es invitado, requiere placa_guest; si es autenticado, requiere vehiculo_id
    (req, res, next) => {
        const esInvitado = !req.user?.usuario_id;
        
        if (esInvitado) {
            // Para invitados: validar placa_vehiculo
            body('placa_vehiculo')
                .notEmpty()
                .withMessage('Placa del vehículo requerida para invitados')
                .isLength({ min: 3, max: 10 })
                .withMessage('Placa debe tener entre 3 y 10 caracteres')(req, res, () => {});
            
            body('tipo_vehiculo')
                .notEmpty()
                .withMessage('Tipo de vehículo requerido')(req, res, () => {});
        } else {
            // Para usuarios autenticados: validar vehiculo_id
            body('vehiculo_id')
                .isInt({ min: 1 })
                .withMessage('ID de vehículo inválido')(req, res, () => {});
        }
        
        next();
    }
];


module.exports = validar;