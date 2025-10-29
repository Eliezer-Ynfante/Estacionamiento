# Estacionamiento — Resumen del proyecto y cómo iniciarlo

Proyecto Express que sirve como base para una aplicación de estacionamiento. Este README refleja los recientes cambios en la estructura: ahora el servidor está contenido en la carpeta `server/` y los recursos públicos están en `public/`.

## Requisitos
- Node.js v16+ recomendado
- npm (incluido con Node)
- (opcional) nodemon para desarrollo

## Nueva estructura del repositorio (visión rápida)
- Raíz del proyecto:
  - .gitignore
  - README.md
  - public/                — frontend / recursos estáticos
  - server/
    - .env                 — variables de entorno del servidor
    - package.json
    - server.js            — punto de entrada del servidor
    - logs/                — registros generados por el servidor
    - src/
      - app.js
      - config/
      - controllers/
      - database/
      - middleware/
      - public/             — recursos estáticos servidos por Express (si aplica)
        - css/
        - js/
        - images/
        - upload/
      - routes/
      - security/
      - services/
      - views/
        - admin/
        - auth/
        - contents/
        - layout/
        - mod/
        - partials/

## Punto de entrada
- El servidor se inicia desde `server/server.js`. Dentro de `server/src/` está el código modular (por ejemplo `app.js`).

## Cómo iniciar el proyecto

1) Desde la raíz — ejecutar el servidor directamente (recomendado si no hay scripts raíz):
- En PowerShell / CMD:
  ```powershell
  node server\server.js
  ```
- Con nodemon (si lo tienes disponible global o usar npx):
  ```powershell
  npx nodemon server\server.js
  ```

2) Instalar dependencias e iniciar desde la carpeta del servidor:
- Abrir terminal en la raíz del proyecto:
  ```powershell
  cd server
  npm install
  npm start      # si package.json de server tiene "start" correcto
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
