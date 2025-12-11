# Estacionamiento

Sistema de gestión de estacionamiento con arquitectura full-stack. Aplicación web con servidor Express.js y cliente React con Vite.

---

## 📋 Requisitos

- **Node.js** v16+ 
- **npm** (incluido con Node)
- **MySQL** (para base de datos)
- **nodemon** (opcional, para desarrollo)

---

## 📁 Estructura del Proyecto

```
├── README.md
├── client/                          # Frontend - React + Vite
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── api/                    # Llamadas API
│       ├── assets/
│       ├── components/             # Componentes reutilizables
│       │   ├── Carrucel.jsx
│       │   ├── Footer.jsx
│       │   ├── LoadingButton.jsx
│       │   ├── Pricing-Section.jsx
│       │   └── Stats Section.jsx
│       ├── context/                # Context API
│       ├── hooks/                  # Custom Hooks
│       ├── pages/                  # Páginas
│       │   ├── home/
│       │   ├── reservar/
│       │   ├── tarifas/
│       │   ├── nosotros/
│       │   ├── contact/
│       │   └── NotFound.jsx
│       ├── routes/                 # Enrutamiento
│       │   ├── Navigation.jsx
│       │   └── routes.jsx
│       ├── styles/
│       └── ui/
│
└── server/                          # Backend - Express.js
    ├── package.json
    ├── server.js                   # Punto de entrada
    ├── .env                        # Variables de entorno
    ├── logs/                       # Registros de la aplicación
    └── src/
        ├── app.js                  # Configuración de Express
        ├── config/
        │   ├── conexion.js         # Conexión a BD
        │   └── sequelize.js        # Configuración Sequelize
        ├── controllers/            # Lógica de negocio
        │   ├── auth.controller.js
        │   ├── user.controller.js
        │   ├── plaza.controller.js
        │   └── reservar.controller.js
        ├── database/
        │   ├── db.sql              # Esquema de BD
        │   └── de_insert.sql       # Datos iniciales
        ├── middleware/             # Middlewares personalizados
        │   ├── auth.middleware.js
        │   ├── auth.validation.js
        │   ├── error.middleware.js
        │   ├── limit.middleware.js
        │   └── reservar.validation.js
        ├── models/                 # Modelos Sequelize
        │   ├── index.js
        │   ├── usuario.model.js
        │   ├── vehiculo.model.js
        │   ├── plaza.model.js
        │   ├── reserva.model.js
        │   ├── pago.model.js
        │   ├── tarifa.model.js
        │   └── role.model.js
        ├── routes/                 # Rutas de la API
        │   ├── main.routes.js
        │   ├── auth.routes.js
        │   ├── user.routes.js
        │   ├── plaza.routes.js
        │   └── reservar.routes.js
        ├── security/               # Funciones de seguridad
        └── services/               # Servicios de negocio
```

---

## 📦 Dependencias

### Frontend (Client)
**Dependencias de Producción:**
- `react@^19.2.1` - Biblioteca UI
- `react-dom@^19.2.1` - Renderizado en DOM
- `react-router-dom@^7.9.6` - Enrutamiento
- `axios@^1.13.1` - Cliente HTTP
- `tailwindcss@^4.1.16` - Estilos CSS
- `@tailwindcss/vite@^4.1.16` - Plugin Vite para Tailwind
- `framer-motion@^12.23.25` - Animaciones
- `lucide-react@^0.553.0` - Iconos

**Dependencias de Desarrollo:**
- `vite@^7.1.7` - Bundler
- `@vitejs/plugin-react@^5.0.4` - Plugin React para Vite
- `eslint@^9.36.0` - Linter
- `@eslint/js@^9.36.0`
- `eslint-plugin-react-hooks@^5.2.0`
- `eslint-plugin-react-refresh@^0.4.22`

### Backend (Server)
**Dependencias de Producción:**
- `express@^5.1.0` - Framework web
- `sequelize@^6.37.7` - ORM para Node.js
- `mysql2@^3.15.3` - Driver MySQL
- `bcryptjs@^3.0.2` - Hash de contraseñas
- `jsonwebtoken@^9.0.2` - Autenticación JWT
- `express-session@^1.18.2` - Gestión de sesiones
- `cookie-parser@^1.4.7` - Parseo de cookies
- `cors@^2.8.5` - Control de CORS
- `helmet@^8.1.0` - Seguridad HTTP
- `express-validator@^7.3.0` - Validación de datos
- `express-rate-limit@^8.2.0` - Rate limiting
- `dotenv@^17.2.3` - Variables de entorno
- `morgan@^1.10.1` - Logger HTTP
- `winston@^3.18.3` - Logger avanzado

**Dependencias de Desarrollo:**
- `nodemon@^3.1.10` - Auto-recarga en desarrollo

---

## ⚙️ Configuración

### Frontend
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Proxy** configurado para `/api` → `http://localhost:3000`
- **React Router** para navegación
- **ESLint** para linting

### Backend
- **Puerto:** 3000
- **CORS:** Habilitado con credenciales
- **Base de datos:** MySQL con Sequelize ORM
- **Autenticación:** JWT + Sessions
- **Validación:** express-validator
- **Seguridad:** Helmet, bcryptjs, rate-limiting
- **Logging:** Morgan + Winston
- **Variables de entorno:** .env

---

## 🚀 Cómo Iniciar

### Instalar Dependencias

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Ejecutar el Proyecto

**Backend (desde `server/`):**
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

**Frontend (desde `client/`):**
```bash
npm run dev        # Desarrollo
npm run build      # Compilación
npm run preview    # Vista previa
```

**Desde la raíz (terminal PowerShell/CMD):**
```powershell
# Backend
node server\server.js

# Frontend
cd client && npm run dev
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` en `server/`:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=estacionamiento
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
JWT_SECRET=tu_secreto_jwt
```

---

## 📝 Scripts Disponibles

**Backend:**
- `npm start` - Inicia servidor en producción
- `npm run dev` - Inicia servidor en desarrollo

**Frontend:**
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run lint` - Ejecuta ESLint
- `npm run preview` - Vista previa de compilación

---

## 👤 Autor

**Adriel Eliezer Ynfante Torres**
  # o
  npx nodemon server.js
  ```

Nota: Verifica `server/package.json` para confirmar que `scripts.start` apunte a `node server.js` o al archivo correcto.

## Variables de entorno
- Crea y edita `server/.env` para configurar:
  - PORT (por defecto 3000)
  - DB connection strings, credenciales, etc.
- Asegúrate de que `.gitignore` incluya `server/.env` para no subir credenciales.

Ejemplo mínimo de `server/.env`:
PORT=3000
NODE_ENV=development

## Rutas y recursos estáticos
- Contenido estático público disponible en `public/` (frontend) y/o `server/src/public/` si Express sirve assets desde ahí.
- Añade rutas en `server/src/routes/` y controladores en `server/src/controllers/`.

## Scripts recomendados (sugerencia para `server/package.json`)
- "start": "node server.js"
- "dev": "nodemon server.js"

Si prefieres ejecutar con npm desde la raíz, puedes añadir un script en el `package.json` raíz que ejecute `node server/server.js`.

## Logs
- Archivos de registro se guardan en `server/logs/`. Revisa permisos y rutas si no aparecen.

## Desarrollo y despliegue
- Para desarrollo: usar `npx nodemon server/server.js` para recarga automática.
- Para producción: ejecutar `node server/server.js` o usar un proceso administrador (pm2, systemd).

## Problemas comunes
- "Puerto en uso": cambia `PORT` en `server/.env` o mata el proceso que lo usa.
- "Dependencias faltantes": dentro de `server/` corre `npm install`.
- "nodemon no encontrado": usar `npx nodemon ...` o instalarlo localmente `npm i -D nodemon`.

## Referencias rápidas
- Archivo principal del servidor: `server/server.js`
- Código modular del servidor: `server/src/app.js`
- Scripts del servidor: `server/package.json`
- Variables de entorno: `server/.env`
- Recursos estáticos (frontend): `public/`

## Notas finales
- Actualiza los scripts en `server/package.json` si el punto de entrada cambia.
- Mantén `server/.env` fuera del control de versiones.
- Para cualquier cambio en la estructura, sincroniza las rutas en `server/src/app.js` y `server/server.js`.
