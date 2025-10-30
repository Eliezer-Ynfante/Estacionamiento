-- Inserción en la tabla roles
INSERT INTO `roles` (`nombre_rol`) VALUES
('Administrador'),
('Cliente');

-- Inserción en la tabla tarifas
INSERT INTO `tarifas` (`nombre`, `precio_hora`, `precio_dia`, `precio_semana`) VALUES
('Estándar Auto', 2.50, 20.00, 100.00),
('Premium Moto', 1.50, 12.00, 60.00);

-- Inserción en la tabla plazas (tarifa_id 1 = Estándar Auto, 2 = Premium Moto)
INSERT INTO `plazas` (`tarifa_id`, `numero_plaza`, `tipo`, `esta_activa`) VALUES
(1, 'A01', 'Automóvil', 1),
(1, 'A02', 'Automóvil', 1),
(2, 'M01', 'Motocicleta', 1);

SELECT
    p.plaza_id,
    p.numero_plaza,
    p.tipo,
    p.esta_activa,
    t.nombre AS nombre_tarifa,
    t.precio_hora
FROM
    plazas p -- Alias 'p' para la tabla plazas
INNER JOIN
    tarifas t ON p.tarifa_id = t.tarifa_id; -- Alias 't' para la tabla tarifas