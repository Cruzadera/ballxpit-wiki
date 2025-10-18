# 🧩 Ball x Pit Wiki — MVP

Ball x Pit Wiki es una aplicación web sencilla para consultar bolas, evoluciones y fusiones del juego **Ball x Pit**. El objetivo del MVP es ofrecer una base de datos navegable donde se pueda ver "A + B → C" de forma rápida.

## 📁 Estructura del repositorio

```
ballxpit-wiki/
├── backend/           # API NestJS + Prisma + SQLite
├── frontend/          # React + Vite + TailwindCSS
├── docker-compose.yml
└── README.md
```

## ⚙️ Stack principal
- **Frontend:** React 18, Vite, TailwindCSS, React Router
- **Backend:** NestJS, Prisma ORM, SQLite
- **Infraestructura:** Docker Compose para orquestar servicios

## 🚀 Puesta en marcha con Docker

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tuusuario/ballxpit-wiki.git
   cd ballxpit-wiki
   ```

2. **Arranca los servicios**
   ```bash
   docker-compose up --build
   ```

   - Frontend disponible en: http://localhost:5173
   - Backend disponible en: http://localhost:3000

El volumen `sqlite_data` conserva la base de datos `dev.db` generada por Prisma (ubicada en `backend/prisma/data/dev.db`).

## 🧠 API REST (MVP)

| Método | Ruta             | Descripción                            |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/balls`         | Lista todas las bolas disponibles      |
| GET    | `/balls/:id`     | Detalle con evoluciones y fusiones     |
| GET    | `/fusions`       | Lista todas las recetas de fusión      |
| GET    | `/fusions/:id`   | Detalle de una receta de fusión        |
| GET    | `/evolutions`    | Lista todas las evoluciones            |
| GET    | `/evolutions/:id`| Detalle de una evolución específica    |

La API expone ejemplos iniciales como:
- Burn + Iron → Bomb
- Ghost + Freeze → Wrath
- Ghost + Poison → Virus
- Bleed + Brood Mother → Leech

## 🖥️ Frontend

- Grid responsive de bolas con imagen, nombre, tipo y nivel.
- Buscador por nombre y filtro por tipo elemental.
- Página de detalle `/ball/:id` con información básica, evoluciones y fusiones asociadas.
- Diseño claro con modo oscuro opcional desde el propio header.

## 🌱 Base de datos y seeds

La configuración de Prisma se encuentra en `backend/prisma/schema.prisma`. El seed inicial está en `backend/prisma/seed.ts` e incluye los datos de ejemplo mencionados.

Para ejecutar la seed manualmente (fuera de Docker) desde la carpeta `backend/`:

```bash
npm install
npx prisma db push
npx prisma db seed
```

El archivo `.env` del backend define `DATABASE_URL=file:./prisma/data/dev.db` y `PORT=3000`.

## ➕ Añadir nuevos registros

Hay dos opciones principales:

1. **Editar el seed de Prisma** (`backend/prisma/seed.ts`) y volver a ejecutar:
   ```bash
   npx prisma db seed
   ```

2. **Insertar datos manualmente** usando Prisma Client en un script propio o mediante endpoints adicionales.

También puedes importar datos desde un JSON adaptando el seed o creando un script que lea el archivo y utilice Prisma para persistirlo.

## 🔧 Variables de entorno

- **Backend (`backend/.env`):**
  - `DATABASE_URL="file:./prisma/data/dev.db"`
  - `PORT=3000`
- **Frontend:**
  - Copia `frontend/.env.example` a `frontend/.env` y ajusta `VITE_API_URL` si necesitas apuntar a otro backend.

## 📌 Notas adicionales

- El backend habilita CORS para permitir solicitudes desde el frontend Vite.
- Las imágenes de las bolas utilizan placeholders (`https://via.placeholder.com/128`). Sustitúyelas por assets reales cuando los tengas disponibles.
- Para un despliegue productivo considera construir el frontend estático y servirlo desde un CDN o servidor dedicado.

¡Disfruta explorando las fusiones del Ball x Pit! 🔥
