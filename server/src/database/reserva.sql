-- =====================================================
-- EJEMPLO DE CÓMO SE REGISTRA UNA RESERVA COMPLETA
-- =====================================================

-- DATOS DE EJEMPLO:
-- Usuario: Juan Pérez (ID 1)
-- Vehículo: Toyota Corolla, placa ABC-1234 (ID 2)
-- Tipo de Vehículo: Auto (ID 2)
-- Plaza: A005 (ID 5)
-- Tarifa: Auto - S/. 8/hora, S/. 50/día, S/. 280/semana
-- Servicio: Lavado Express (ID 1) - S/. 25
-- Fechas: 2024-01-30 08:00 a 2024-02-06 10:00 (7 días + 2 horas)
-- Monto: S/. 305.36 (S/. 280 semana + S/. 25 servicio)

-- =====================================================
-- PASO 1: VERIFICAR DATOS EXISTENTES
-- =====================================================

-- Verificar que el usuario existe
SELECT * FROM Usuario WHERE id = 1;

-- Verificar que el vehículo existe y pertenece al usuario
SELECT v.*, tv.nombre as tipo_nombre 
FROM Vehiculo v
JOIN Tipo_Vehiculo tv ON v.tipo_vehiculo_id = tv.id
WHERE v.id = 2 AND v.usuario_id = 1;

-- Verificar que la plaza existe y está activa
SELECT p.*, tv.nombre as tipo_nombre
FROM Plazas p
JOIN Tipo_Vehiculo tv ON p.tipo_vehiculo_id = tv.id
WHERE p.id = 5 AND p.activo = TRUE;

-- Verificar la tarifa para el tipo de vehículo
SELECT t.*, tv.nombre as tipo_nombre
FROM Tarifas t
JOIN Tipo_Vehiculo tv ON t.tipo_vehiculo_id = tv.id
WHERE tv.id = 2;

-- Verificar disponibilidad de la plaza (sin conflictos en las fechas)
SELECT * FROM Historial_Plaza
WHERE plaza_id = 5
AND fecha_inicio <= '2024-02-06 10:00:00'
AND fecha_fin >= '2024-01-30 08:00:00';

-- Si no hay registros, la plaza está disponible

-- Verificar el servicio si se incluye
SELECT * FROM Servicios WHERE id = 1;

-- =====================================================
-- PASO 2: CREAR LA RESERVA
-- =====================================================

INSERT INTO Reserva (
    codigo,
    usuario_id,
    plaza_id,
    vehiculo_id,
    servicio_id,
    fecha_hora_inicio,
    fecha_hora_fin,
    monto_total,
    estado,
    fecha_creacion
) VALUES (
    'RES-1706540800000-ABC123XYZ',
    1,
    5,
    2,
    1,
    '2024-01-30 08:00:00',
    '2024-02-06 10:00:00',
    305.36,
    'pendiente',
    CURRENT_TIMESTAMP
);

-- El ID de la reserva creada será: 1 (auto_increment)

-- =====================================================
-- PASO 3: REGISTRAR EN HISTORIAL DE PLAZAS
-- =====================================================

INSERT INTO Historial_Plaza (
    plaza_id,
    fecha_inicio,
    fecha_fin,
    reserva_id
) VALUES (
    5,
    '2024-01-30 08:00:00',
    '2024-02-06 10:00:00',
    1
);

-- =====================================================
-- PASO 4: CREAR EL REGISTRO DE PAGO
-- =====================================================

INSERT INTO Pago (
    reserva_id,
    monto,
    metodo_pago,
    estado,
    fecha_pago,
    fecha_creacion
) VALUES (
    1,
    305.36,
    'pendiente',
    'pagado',
    NULL,
    CURRENT_TIMESTAMP
);

-- =====================================================
-- VERIFICAR LA RESERVA CREADA (CONSULTA DE LECTURA)
-- =====================================================

SELECT 
    r.id as reserva_id,
    r.codigo,
    u.nombre as usuario_nombre,
    u.correo_electronico,
    v.placa,
    v.marca,
    v.color,
    tv.nombre as tipo_vehiculo,
    p.codigo as plaza_codigo,
    s.nombre as servicio_nombre,
    s.precio as servicio_precio,
    r.fecha_hora_inicio,
    r.fecha_hora_fin,
    TIMESTAMPDIFF(HOUR, r.fecha_hora_inicio, r.fecha_hora_fin) as duracion_horas,
    ROUND(TIMESTAMPDIFF(HOUR, r.fecha_hora_inicio, r.fecha_hora_fin) / 24, 2) as duracion_dias,
    t.precio_hora,
    t.precio_dia,
    t.precio_semana,
    r.monto_total,
    r.estado as reserva_estado,
    pa.monto as pago_monto,
    pa.metodo_pago,
    pa.estado as pago_estado,
    pa.fecha_pago,
    r.fecha_creacion
FROM Reserva r
JOIN Usuario u ON r.usuario_id = u.id
JOIN Vehiculo v ON r.vehiculo_id = v.id
JOIN Tipo_Vehiculo tv ON v.tipo_vehiculo_id = tv.id
JOIN Plazas p ON r.plaza_id = p.id
JOIN Tarifas t ON tv.id = t.tipo_vehiculo_id
LEFT JOIN Servicios s ON r.servicio_id = s.id
LEFT JOIN Pago pa ON r.id = pa.reserva_id
WHERE r.id = 1;

-- =====================================================
-- CONSULTA PARA VER TODAS LAS RESERVAS DE UN USUARIO
-- =====================================================

SELECT 
    r.id,
    r.codigo,
    r.fecha_hora_inicio,
    r.fecha_hora_fin,
    v.placa,
    p.codigo as plaza,
    r.monto_total,
    r.estado,
    COALESCE(pa.metodo_pago, 'pendiente') as metodo_pago,
    COALESCE(pa.estado, 'pendiente') as pago_estado
FROM Reserva r
JOIN Vehiculo v ON r.vehiculo_id = v.id
JOIN Plazas p ON r.plaza_id = p.id
LEFT JOIN Pago pa ON r.id = pa.reserva_id
WHERE r.usuario_id = 1
ORDER BY r.fecha_creacion DESC;

-- =====================================================
-- CONSULTA PARA VERIFICAR DISPONIBILIDAD DE PLAZAS
-- =====================================================

SELECT 
    p.id,
    p.codigo,
    tv.nombre as tipo_vehiculo,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM Historial_Plaza hp
            WHERE hp.plaza_id = p.id
            AND hp.fecha_inicio <= '2024-02-06 10:00:00'
            AND hp.fecha_fin >= '2024-01-30 08:00:00'
        ) THEN 'No disponible'
        ELSE 'Disponible'
    END as estado_disponibilidad
FROM Plazas p
JOIN Tipo_Vehiculo tv ON p.tipo_vehiculo_id = tv.id
WHERE p.tipo_vehiculo_id = 2
AND p.activo = TRUE
ORDER BY p.codigo;

-- =====================================================
-- CONSULTA PARA VER PLAZAS OCUPADAS EN UN RANGO DE FECHAS
-- =====================================================

SELECT 
    p.codigo as plaza,
    r.codigo as reserva,
    u.nombre as usuario,
    v.placa,
    hp.fecha_inicio,
    hp.fecha_fin,
    TIMESTAMPDIFF(HOUR, hp.fecha_inicio, hp.fecha_fin) as horas_ocupadas
FROM Historial_Plaza hp
JOIN Plazas p ON hp.plaza_id = p.id
JOIN Reserva r ON hp.reserva_id = r.id
JOIN Usuario u ON r.usuario_id = u.id
JOIN Vehiculo v ON r.vehiculo_id = v.id
WHERE hp.fecha_inicio <= '2024-02-06 10:00:00'
AND hp.fecha_fin >= '2024-01-30 08:00:00'
ORDER BY p.codigo;