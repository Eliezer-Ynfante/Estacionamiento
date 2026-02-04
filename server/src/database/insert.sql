USE estacionamiento;

-- =====================================================
-- INSERTAR TIPOS DE VEHÍCULOS
-- =====================================================
INSERT INTO Tipo_Vehiculo (nombre) VALUES
('Moto'),
('Auto'),
('Camion');

-- =====================================================
-- INSERTAR TARIFAS (precios en soles peruanos)
-- =====================================================
INSERT INTO Tarifas (tipo_vehiculo_id, precio_hora, precio_dia, precio_semana) VALUES
(1, 5.00, 35.00, 200.00),      -- Moto: más económica
(2, 8.00, 50.00, 280.00),      -- Auto: estándar
(3, 12.00, 70.00, 400.00);     -- Camion: más grande

-- =====================================================
-- INSERTAR PLAZAS (30 plazas distribuidas)
-- =====================================================
-- 10 plazas para motos
INSERT INTO Plazas (tipo_vehiculo_id, codigo, activo) VALUES
(1, 'M001', TRUE),
(1, 'M002', TRUE),
(1, 'M003', TRUE),
(1, 'M004', TRUE),
(1, 'M005', TRUE),
(1, 'M006', TRUE),
(1, 'M007', TRUE),
(1, 'M008', TRUE),
(1, 'M009', TRUE),
(1, 'M010', TRUE),

-- 15 plazas para autos
(2, 'A001', TRUE),
(2, 'A002', TRUE),
(2, 'A003', TRUE),
(2, 'A004', TRUE),
(2, 'A005', TRUE),
(2, 'A006', TRUE),
(2, 'A007', TRUE),
(2, 'A008', TRUE),
(2, 'A009', TRUE),
(2, 'A010', TRUE),
(2, 'A011', TRUE),
(2, 'A012', TRUE),
(2, 'A013', TRUE),
(2, 'A014', TRUE),
(2, 'A015', TRUE),

-- 5 plazas para camiones
(3, 'C001', TRUE),
(3, 'C002', TRUE),
(3, 'C003', TRUE),
(3, 'C004', TRUE),
(3, 'C005', TRUE);

-- =====================================================
-- INSERTAR SERVICIOS
-- =====================================================
INSERT INTO Servicios (nombre, precio, descripción) VALUES
('Lavado Express', 25.00, 'Lavado rápido del vehículo (15 minutos)'),
('Recarga Eléctrica', 8.00, 'Carga de batería para vehículos eléctricos (por kWh)');