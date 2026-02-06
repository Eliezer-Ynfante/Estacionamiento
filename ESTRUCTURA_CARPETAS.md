# 📁 Estructura de Carpetas - Referencia Rápida

## Proyecto: Sistema de Gestión de Estacionamiento

```
estacionamiento/
│
├── README.md
│
├── client/                          # Frontend - React + Vite
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── auth/
│   │   ├── routes/
│   │   ├── schema/
│   │   ├── styles/
│   │   └── util/
│   └── public/
│
└── server/                          # Backend - Express.js
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── database/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── schemas/
    │   ├── security/
    │   ├── services/
    │   └── utils/
    └── logs/
```

## Estructura Sistema de Carpetas (Visual)

```
estacionamiento
├── client
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   │   ├── admin
│   │   └── auth
│   ├── routes
│   ├── schema
│   ├── styles
│   └── util
├── public
└── server
    ├── config
    ├── controllers
    ├── database
    ├── middleware
    ├── models
    ├── routes
    ├── schemas
    ├── security
    ├── services
    ├── utils
    └── logs
```

## 📊 Resumen de Directorios

### Frontend (client/src/) - 10 carpetas
1. **api/** - Funciones HTTP
2. **assets/** - Recursos multimedia
3. **components/** - Componentes React reutilizables
4. **context/** - Context API
5. **hooks/** - Custom Hooks
6. **pages/** - Páginas principales
7. **pages/admin/** - Admin
8. **pages/auth/** - Autenticación
9. **routes/** - Enrutamiento
10. **schema/** - Validaciones Zod
11. **styles/** - CSS global
12. **util/** - Utilidades

### Backend (server/src/) - 9 carpetas
1. **config/** - Configuración
2. **controllers/** - Controladores
3. **database/** - Scripts SQL
4. **middleware/** - Middlewares
5. **models/** - Modelos Sequelize
6. **routes/** - Rutas API
7. **schemas/** - Validaciones
8. **security/** - Seguridad
9. **services/** - Servicios
10. **utils/** - Funciones auxiliares
11. **logs/** - Registros

---

**Estructura creada:** Febrero 6, 2026
