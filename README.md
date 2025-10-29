# Estacionamiento — Resumen del proyecto y cómo iniciarlo

Proyecto Express minimal que sirve como base para una aplicación de estacionamiento.

## Estructura principal (visión rápida)
- Archivos raíz:
  - [.env](.env)
  - [.gitignore](.gitignore)
  - [app.js](app.js)
  - [package.json](package.json)
  - [README.md](README.md)
  - [logs/](logs/)
- Código fuente y recursos:
  - [src/](src/)
    - [src/config/](src/config/)
    - [src/controllers/](src/controllers/)
    - [src/database/](src/database/)
    - [src/middleware/](src/middleware/)
    - [src/public/](src/public/)
      - [src/public/css/](src/public/css/)
      - [src/public/fonts/](src/public/fonts/)
      - [src/public/images/](src/public/images/)
      - [src/public/js/](src/public/js/)
      - [src/public/upload/](src/public/upload/)
    - [src/routes/](src/routes/)
    - [src/security/](src/security/)
    - [src/services/](src/services/)
    - [src/views/](src/views/)
      - [src/views/admin/](src/views/admin/)
      - [src/views/auth/](src/views/auth/)
      - [src/views/contents/](src/views/contents/)
      - [src/views/layout/](src/views/layout/)
      - [src/views/mod/](src/views/mod/)
      - [src/views/partials/](src/views/partials/)

## Punto de entrada
- El servidor arranca desde [app.js](app.js).
- En [app.js](app.js) se usa el middleware [`express.json()`](app.js) y hay una ruta de ejemplo definida con [`app.get`](app.js). El servidor se inicializa con [`app.listen`](app.js) en el puerto 3000 por defecto.

## Scripts útiles (definidos en [package.json](package.json))
- `npm start` — ejecuta el servidor: corresponde a [`scripts.start`](package.json).
- `npm run dev` — ejecuta con `nodemon` para desarrollo automático: corresponde a [`scripts.dev`](package.json).

## Requisitos
- Node.js (recomendado v16+)
- npm (incluido con Node)

## Cómo iniciar el proyecto (rápido)
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Iniciar en modo producción:
   ```bash
   npm start
   ```
3. Iniciar en modo desarrollo (reinicio automático con nodemon):
   ```bash
   npm run dev
   ```
4. Abrir en el navegador:
   - http://localhost:3000/

## Variables de entorno
- Si necesita configurar puerto u otras credenciales, cree o edite el archivo [.env](.env). Este archivo está listado en [.gitignore](.gitignore) para que no se suba al repositorio.

## Logs
- Los archivos/registro pueden escribirse en la carpeta [logs/](logs/).

## Desarrollo
- Agregue rutas en [src/routes/](src/routes/) e implemente controladores en [src/controllers/](src/controllers/).
- Use [src/public/](src/public/) para recursos estáticos (css, js, imágenes, uploads).
- Conserve la configuración en [src/config/](src/config/) y la lógica de servicios en [src/services/](src/services/).

## Problemas comunes
- Si `npm run dev` falla, asegúrese de que `nodemon` esté en `devDependencies` (ver [package.json](package.json)) y use `npm install`.
- Si el puerto 3000 está en uso, cambie la configuración en `.env` y en [app.js](app.js).

## Referencias rápidas en el código
- Archivo principal: [app.js](app.js)
- Scripts: [package.json](package.json)
- Ignorar .env: [.gitignore](.gitignore)
