-- Crear base de datos
CREATE DATABASE IF NOT EXISTS estacionamiento;
USE estacionamiento;

-- Tabla Tipo_Vehiculo
CREATE TABLE Tipo_Vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    INDEX idx_nombre (nombre)
);

-- Tabla Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL COMMENT 'Almacenado con hash bcrypt o argon2',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_correo (correo_electronico)
);

-- Tabla Vehiculo
CREATE TABLE Vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_vehiculo_id INT NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    color VARCHAR(30),
    año INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_vehiculo_id) REFERENCES Tipo_Vehiculo(id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_placa (placa)
);

-- Tabla Tarifas
CREATE TABLE Tarifas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_vehiculo_id INT NOT NULL UNIQUE,
    precio_hora DECIMAL(10, 2) NOT NULL,
    precio_dia DECIMAL(10, 2) NOT NULL,
    precio_semana DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (tipo_vehiculo_id) REFERENCES Tipo_Vehiculo(id) ON DELETE CASCADE,
    INDEX idx_tipo_vehiculo (tipo_vehiculo_id)
);

-- Tabla Plazas
CREATE TABLE Plazas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_vehiculo_id INT NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tipo_vehiculo_id) REFERENCES Tipo_Vehiculo(id) ON DELETE CASCADE,
    INDEX idx_tipo_vehiculo (tipo_vehiculo_id),
    INDEX idx_codigo (codigo)
);

-- Tabla Historial_Plaza
CREATE TABLE Historial_Plaza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plaza_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    reserva_id INT,
    FOREIGN KEY (plaza_id) REFERENCES Plazas(id) ON DELETE CASCADE,
    INDEX idx_plaza (plaza_id),
    INDEX idx_fecha_inicio (fecha_inicio)
);

-- Tabla Servicios
CREATE TABLE Servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripción TEXT
);

-- Tabla Reserva
CREATE TABLE Reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    usuario_id INT NOT NULL,
    plaza_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    servicio_id INT,
    fecha_hora_inicio DATETIME NOT NULL,
    fecha_hora_fin DATETIME,
    monto_total DECIMAL(10, 2),
    estado ENUM('pendiente', 'activa', 'completada') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (plaza_id) REFERENCES Plazas(id),
    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculo(id),
    FOREIGN KEY (servicio_id) REFERENCES Servicios(id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_plaza (plaza_id),
    INDEX idx_codigo (codigo)
);

-- Tabla Pago
CREATE TABLE Pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL UNIQUE,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado ENUM('pagado', 'reembolso') DEFAULT 'pagado',
    fecha_pago DATETIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES Reserva(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id)
);