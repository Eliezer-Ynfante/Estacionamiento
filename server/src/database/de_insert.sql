-- Inserción en la tabla roles
INSERT INTO `roles` (`nombre_rol`) VALUES
('Administrador'),
('Cliente');

-- Inserción en la tabla tarifas
INSERT INTO Tarifas (nombre, precio_hora, precio_dia, precio_semana, descripcion) VALUES
('Auto Básico', 5.00, 30.00, 150.00, 'Acceso inmediato, Tarifa por hora, Sin reserva previa'),
('Auto Premium', 7.00, 60.00, 280.00, 'Espacio cubierto, Prioridad de entrada, Seguro de daños menores'),
('Moto Básico', 2.00, 12.00, 60.00, 'Estacionamiento seguro, Sin compromiso, Rápido acceso'),
('Moto Premium', 3.50, 25.00, 120.00, 'Zona vigilada 24/7, Carga de batería gratis, Asistencia en el sitio'),
('Camion Básico', 15.00, 80.00, 400.00, 'Acceso amplio, Espacio garantizado, Puertas automáticas'),
('Camion Premium', 20.00, 150.00, 700.00, 'Zona de carga prioritaria, Vigilancia completa, Asesor disponible');

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