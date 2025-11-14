const { body, param } = require('express-validator');

const validar = [
    body('plaza_id')
        .isInt({ min: 1 })
        .withMessage('ID de plaza inválido'),
    body('vehiculo_id')
        .isInt({ min: 1 })
        .withMessage('ID de vehículo inválido'),
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
        .withMessage('Fecha de expiración inválida (formato MM/YY)')
];


module.exports = validar;