# 🅿️ Sistema de Gestión de Estacionamiento

**Aplicación web de reserva de plazas de estacionamiento** con arquitectura full-stack. Permite a los usuarios autenticarse, reservar plazas, visualizar tarifas, contratar servicios adicionales y gestionar sus reservas y vehículos.

**Desarrollado por:** Adriel Eliezer Ynfante Torres

---

## 📋 Requisitos Previos

- **Node.js** v16 o superior
- **npm** (incluido con Node.js)
- **MySQL** 5.7 o superior
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

---

## 📦 Descripción General

### 🎯 Funcionalidades Principales

**Cliente (Frontend):**
- Autenticación de usuarios (registro, login)
- Reserva de plazas de estacionamiento
- Visualización de tarifas
- Servicios adicionales (lavado, custodia, etc.)
- Panel de control de reservas
- Dashboard administrativo
- Contacto y soporte

**Servidor (Backend):**
- API RESTful completa
- Autenticación con JWT
- Gestión de usuarios y vehículos
- Cálculo de tarifas dinámicas
- Procesamiento de pagos
- Control de disponibilidad de plazas
- Notificaciones por email
- Logging y auditoría

---

## 📁 Estructura del Proyecto

```
estacionamiento/
├── README.md
├── client/                          # Frontend - React + Vite
│   ├── src/
│   │   ├── api/                     # Llamadas API
│   │   ├── assets/                  # Imágenes y recursos
│   │   ├── components/              # Componentes reutilizables
│   │   ├── context/                 # Context API
│   │   ├── hooks/                   # Custom Hooks
│   │   ├── pages/                   # Páginas/vistas
│   │   │   ├── admin/               # Funciones administrativas
│   │   │   └── auth/                # Autenticación
│   │   ├── routes/                  # Enrutamiento
│   │   ├── schema/                  # Validaciones Zod
│   │   ├── styles/                  # Estilos globales
│   │   └── util/                    # Utilidades
│   └── public/                      # Archivos estáticos
│
└── server/                          # Backend - Express.js
    ├── src/
    │   ├── config/                  # Configuración (BD, Sequelize)
    │   ├── controllers/             # Controladores (lógica)
    │   ├── database/                # Scripts SQL
    │   ├── middleware/              # Middlewares personalizados
    │   ├── models/                  # Modelos Sequelize
    │   ├── routes/                  # Definición de rutas API
    │   ├── schemas/                 # Validaciones
    │   ├── security/                # Funciones de seguridad
    │   ├── services/                # Servicios de negocio
    │   └── utils/                   # Funciones auxiliares
    └── logs/                        # Registros de la aplicación
```

---

## 📦 Stack Tecnológico

### Frontend (React + Vite)

| Dependencia | Versión | Propósito |
|---|---|---|
| `react` | ^19.2.1 | Biblioteca de UI |
| `react-dom` | ^19.2.1 | Renderización en DOM |
| `react-router-dom` | ^7.9.6 | Enrutamiento |
| `axios` | ^1.13.1 | Cliente HTTP |
| `tailwindcss` | ^4.1.16 | Framework CSS |
| `framer-motion` | ^12.23.25 | Animaciones |
| `lucide-react` | ^0.553.0 | Iconos |
| `react-toastify` | ^11.0.5 | Notificaciones |
| `zod` | ^4.3.6 | Validación de datos |
| `vite` | ^7.1.7 | Build tool |
| `eslint` | ^9.36.0 | Linting |

### Backend (Express.js + Sequelize)

| Dependencia | Versión | Propósito |
|---|---|---|
| `express` | ^5.1.0 | Framework web |
| `sequelize` | ^6.37.7 | ORM para Node.js |
| `mysql2` | ^3.15.3 | Driver MySQL |
| `bcrypt` | ^6.0.0 | Hash de contraseñas |
| `jsonwebtoken` | ^9.0.2 | Autenticación JWT |
| `cookie-parser` | ^1.4.7 | Parseo de cookies |
| `cors` | ^2.8.5 | Control de CORS |
| `helmet` | ^8.1.0 | Seguridad HTTP |
| `express-validator` | ^7.3.0 | Validación de datos |
| `express-rate-limit` | ^8.2.1 | Rate limiting |
| `dotenv` | ^17.2.3 | Variables de entorno |
| `morgan` | ^1.10.1 | Logger HTTP |
| `winston` | ^3.18.3 | Logger avanzado |
| `nodemailer` | ^7.0.12 | Envío de emails |
| `zod` | ^4.3.6 | Validación de datos |
| `nodemon` | ^3.1.10 | (Dev) Auto-recarga |

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `server/`:

```env
# Entorno
NODE_ENV=development

# Servidor
PORT=3050

# Base de Datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=estacionamiento
DB_PORT=3306

# Frontend
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_app
EMAIL_FROM=noreply@estacionamiento.com
```

### Configuración Frontend

- **Bundler:** Vite
- **Estilos:** Tailwind CSS
- **Enrutamiento:** React Router v7
- **Validación:** Zod
- **HTTP Client:** Axios
- **Proxy API:** `/api` → `http://localhost:3000`

### Configuración Backend

- **Framework:** Express.js v5
- **ORM:** Sequelize v6
- **Base de Datos:** MySQL
- **Autenticación:** JWT + Cookies
- **Validación:** Express Validator + Zod
- **Seguridad:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan + Winston
- **Puerto:** 3000

---

## 🚀 Instalación y Ejecución

### 1️⃣ Clonar y Navegar

```bash
cd "tu ruta"/Estacionamiento
```

### 2️⃣ Instalar Dependencias del Backend

```bash
cd server
npm install
```

### 3️⃣ Instalar Dependencias del Frontend

```bash
cd ../client
npm install
```

### 4️⃣ Configurar Base de Datos

1. Abre MySQL Workbench o línea de comandos
2. Ejecuta los scripts en `server/src/database/`:
   - `db.sql` - Crea la estructura de tablas
   - `insert.sql` - Inserta datos iniciales (opcional)

### 5️⃣ Configurar Variables de Entorno

- Crea `.env` en `server/`
- Rellena los valores según tu configuración

### 6️⃣ Ejecutar Aplicación

**Terminal 1 - Backend:**
```bash
cd server
npm run dev          # Desarrollo (con nodemon)
# o
npm start            # Producción
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev          # Ejecuta en http://localhost:5173
```

---

## 📝 Scripts Disponibles

### Backend (server/)
```bash
npm start            # Inicia servidor en producción (node server.js)
npm run dev          # Inicia servidor en desarrollo (nodemon server.js)
```

### Frontend (client/)
```bash
npm run dev          # Inicia servidor de desarrollo (Vite)
npm run build        # Compila para producción
npm run preview      # Vista previa de build
npm run lint         # Ejecuta ESLint
```

---

## 🔌 Endpoints API

### Autenticación (`/api/auth`)
- `POST /registro` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión

### Usuario (`/api/user`)
- `GET /me` - Obtener perfil del usuario
- `PATCH /me` - Actualizar perfil
- `POST /me/password` - Cambiar contraseña

### Vehículos (`/api/vehicle`)
- `POST /create` - Registrar vehículo
- `GET /types` - Obtener tipos de vehículos
- `GET /me` - Obtener mis vehículos
- `GET /:id` - Obtener vehículo por ID
- `PATCH /:id` - Actualizar vehículo
- `DELETE /:id` - Eliminar vehículo

### Tarifas (`/api/rate`)
- `GET /rates` - Obtener todas las tarifas
- `GET /rates/:id` - Obtener tarifa por ID
- `GET /vehicle/:tipo_vehiculo_id` - Obtener tarifas por tipo de vehículo

### Reservas (`/api/booking`)
- `POST /create` - Crear reserva
- `GET /me` - Obtener historial de reservas

### Pagos (`/api/payment`)
- `POST /validate` - Validar pago

### Servicios (`/api/service`)
- `GET /services` - Obtener servicios adicionales

### Contacto (`/api/contact`)
- `POST /` - Enviar formulario de contacto

---

## 📂 Descripción Detallada de Directorios

### Frontend (client/src/)

| Directorio | Descripción |
|---|---|
| `api/` | Funciones para llamadas HTTP a la API con Axios |
| `assets/` | Imágenes, iconos y recursos multimedia |
| `components/` | Componentes React reutilizables (Footer, Cookie Notice, etc.) |
| `context/` | Context API para estado global (autenticación) |
| `hooks/` | Custom Hooks personalizados (useAuth, useDebounce, etc.) |
| `pages/` | Componentes de páginas principales (Home, Booking, etc.) |
| `pages/admin/` | Funcionalidades administrativas |
| `pages/auth/` | Componentes de autenticación (Login, Register) |
| `routes/` | Configuración de rutas de React Router |
| `schema/` | Validaciones con Zod para formularios |
| `styles/` | Archivos CSS globales |
| `util/` | Funciones utilitarias y constantes |

### Backend (server/src/)

| Directorio | Descripción |
|---|---|
| `config/` | Configuración de BD y Sequelize |
| `controllers/` | Controladores con la lógica de negocio |
| `database/` | Scripts SQL para inicializar BD |
| `middleware/` | Middlewares (autenticación, validación, errores, rate limit) |
| `models/` | Modelos de datos Sequelize |
| `routes/` | Definición de rutas API |
| `schemas/` | Esquemas de validación |
| `security/` | Funciones de seguridad |
| `services/` | Servicios de negocio (lógica reutilizable) |
| `utils/` | Funciones auxiliares |
| `logs/` | Archivos de registro (generados en runtime) |

---

## 🔐 Seguridad

✅ **Implementadas:**
- Hash de contraseñas con bcrypt
- JWT para autenticación
- CORS configurado
- Helmet para headers HTTP seguros
- Rate limiting en endpoints
- Cookie-based JWT authentication
- Validación de datos con express-validator y Zod
- Protección de rutas autenticadas

📋 **Recomendaciones:**
- Cambiar `JWT_SECRET` en producción
- Usar variables de entorno sensibles
- Implementar HTTPS en producción
- Actualizar dependencias regularmente
- Revisar logs en `server/logs/`

---

## 🐛 Solución de Problemas

### Puerto 3000 en uso
```bash
# Windows - Buscar proceso en puerto 3000
netstat -ano | findstr :3000

# Ver qué proceso usa el puerto y terminarlo
taskkill /PID <PID> /F

# O cambiar puerto en server/.env
PORT=3001
```

### Dependencias no encontradas
```bash
# Dentro del directorio (server o client)
npm install

# O reinstalar todo
npm cache clean --force
npm install
```

### Error de conexión a BD
1. Verificar que MySQL esté corriendo
2. Revisar credenciales en `server/.env`
3. Confirmar que BD `estacionamiento` existe
4. Ejecutar scripts en `server/src/database/db.sql`

### nodemon no encontrado
```bash
# Opción 1: Usar npx
npx nodemon server.js

# Opción 2: Instalar globalmente
npm install -g nodemon

# Opción 3: Instalar localmente en dev
npm install -D nodemon
```

### CORS errors
- Verificar `FRONTEND_URL` en `server/.env`
- Por defecto es `http://localhost:5173`
- Revisar que frontend esté en ese puerto

---

## 📊 Modelos de Datos

### Principales Entidades

**Usuario:**
- ID, Email, Contraseña (hasheada), Nombre, Teléfono, Dirección

**Vehículo:**
- ID, Usuario, Placa, TipoVehiculo, Color, Marca

**Reserva:**
- ID, Usuario, Vehículo, Plaza, FechaInicio, FechaFin, Estado, Monto

**Plaza:**
- ID, Número, Estado (disponible/ocupada), Tipo

**Tarifa:**
- ID, TipoVehiculo, PrecioHora, PrecioMes

**Pago:**
- ID, Reserva, Monto, Método, Estado, FechaPago

**Servicio:**
- ID, Nombre, Descripción, Precio

---

## 📦 Empaquetado y Despliegue

### Build para Producción

```bash
# Frontend
cd client
npm run build       # Genera dist/

# Backend
# Actualizar server/package.json si es necesario
# No requiere build, solo npm install --production
```

### Opciones de Despliegue

- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Backend:** Heroku, Railway, AWS EC2, DigitalOcean
- **BD:** MySQL en AWS RDS, DigitalOcean, o servidor dedicado

---

## 📞 Contacto y Soporte

**Desarrollado por:** Adriel Eliezer Ynfante Torres

Para reportes de bugs o sugerencias, contacta al desarrollador.

---

## 📄 Licencia

ISC

---

## 🎯 Siguiente Pasos

- [ ] Configurar variables de entorno
- [ ] Ejecutar scripts de BD
- [ ] Instalar dependencias (npm install)
- [ ] Iniciar servidor backend
- [ ] Iniciar servidor frontend
- [ ] Acceder a http://localhost:5173
- [ ] Crear cuenta de prueba
- [ ] Realizar reservas de prueba

---

**Última actualización:** Febrero 6, 2026
