-- *************************************************************
-- ** Script de Creación de Esquema de Base de Datos MySQL (InnoDB) **
-- ** Sistema de Estacionamiento - Versión 1.0 **
-- *************************************************************

-- 1. Creación y Uso de la Base de Datos
CREATE DATABASE IF NOT EXISTS estacionamiento
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE estacionamiento;

-- 2. Tabla Roles (Maestra)
CREATE TABLE Roles (
    rol_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (rol_id)
) ENGINE=InnoDB;

-- 3. Tabla Tarifas (Maestra)
CREATE TABLE Tarifas (
    tarifa_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    precio_hora DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    precio_dia DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    precio_semana DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (tarifa_id)
) ENGINE=InnoDB;

-- 4. Tabla Usuarios (Secundaria)
CREATE TABLE Usuarios (
    usuario_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    rol_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono INT(12) UNIQUE;
    hash_contrasena CHAR(60) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id),
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES Roles (rol_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Tabla Vehiculos (Secundaria)
CREATE TABLE Vehiculos (
    vehiculo_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT UNSIGNED NOT NULL,
    placa VARCHAR(8) NOT NULL UNIQUE,
    marca VARCHAR(50),
    color VARCHAR(30),
    PRIMARY KEY (vehiculo_id),
    CONSTRAINT fk_vehiculo_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES Usuarios (usuario_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabla Plazas (Maestra)
CREATE TABLE Plazas (
    plaza_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tarifa_id INT UNSIGNED NOT NULL,
    numero_plaza VARCHAR(10) NOT NULL UNIQUE,
    tipo VARCHAR(30) NOT NULL, 
    esta_activa BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (plaza_id),
    CONSTRAINT fk_plaza_tarifa
        FOREIGN KEY (tarifa_id)
        REFERENCES Tarifas (tarifa_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. Tabla Reservas (Transaccional)
CREATE TABLE Reservas (
    reserva_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT UNSIGNED NOT NULL,
    plaza_id INT UNSIGNED NOT NULL,
    vehiculo_id BIGINT UNSIGNED NOT NULL,
    fecha_hora_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_fin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    costo_total_calculado DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reserva_id),
    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES Usuarios (usuario_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_reserva_plaza
        FOREIGN KEY (plaza_id)
        REFERENCES Plazas (plaza_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_reserva_vehiculo
        FOREIGN KEY (vehiculo_id)
        REFERENCES Vehiculos (vehiculo_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Tabla Pagos (Transaccional)
CREATE TABLE Pagos (
    pago_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reserva_id BIGINT UNSIGNED NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo VARCHAR(50) NOT NULL, 
    estado_pago VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pago_id),
    CONSTRAINT fk_pago_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES Reservas (reserva_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Índices Adicionales
CREATE INDEX idx_usuario_email ON Usuarios (email);
CREATE INDEX idx_vehiculo_placa ON Vehiculos (placa);
CREATE INDEX idx_reserva_inicio ON Reservas (fecha_hora_inicio);
CREATE INDEX idx_reserva_fin ON Reservas (fecha_hora_fin);

-- Fin del Script