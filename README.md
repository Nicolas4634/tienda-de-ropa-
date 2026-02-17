# STUDIO — E-commerce de ropa moderna

Aplicación full-stack de tienda de ropa con diseño moderno (estilo Zara/Nike): React + Vite + Tailwind en frontend y Node.js + Express + MongoDB en backend.

## Requisitos

- **Node.js** 18+
- **MongoDB** (local o Atlas)
- **npm** o **yarn**

## Estructura del proyecto

```
tienda de ropa/
├── backend/          # API Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/    # Conexión DB
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/   # seed de productos
│   │   └── server.js
│   └── package.json
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
└── README.md
```

## Configuración

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env`:

- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/tienda-ropa` (o tu URI de MongoDB Atlas)
- `JWT_SECRET=una_clave_secreta_larga_y_segura`

Instala dependencias y arranca:

```bash
npm install
npm run seed    # Carga productos de ejemplo y usuario admin
npm run dev     # Servidor en http://localhost:5000
```

### 2. Frontend

El frontend usa el proxy de Vite hacia `http://localhost:5000` para las peticiones a `/api`. No es obligatorio crear `.env` en frontend salvo que cambies la URL del API.

```bash
cd frontend
npm install
npm run dev     # App en http://localhost:5173
```

## Usuario administrador (tras el seed)

- **Email:** admin@tienda.com  
- **Contraseña:** admin123  

Con este usuario puedes acceder al panel de administración (`/admin`) para crear, editar y eliminar productos.

## Funcionalidades

### Frontend

- Diseño responsive (mobile-first), estilo marca moderna
- **Inicio:** productos destacados y CTA al catálogo
- **Catálogo:** filtros por categoría, rango de precios, talle y búsqueda
- **Detalle de producto:** talles, cantidad y añadir al carrito
- **Carrito:** ver, cambiar cantidad y eliminar (persistido si hay sesión)
- **Checkout:** formulario de dirección y confirmación de pedido (ruta protegida)
- **Login y registro** con JWT
- **Navbar:** logo, catálogo, carrito (contador) y menú de usuario / admin
- **Panel admin:** CRUD de productos (ruta protegida solo admin)
- Animaciones suaves con Framer Motion

### Backend

- **Auth:** registro, login y ruta `GET /api/auth/me` (JWT)
- **Productos:** `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` (CRUD admin)
- **Carrito:** `GET/POST /api/cart/items`, `PUT/DELETE /api/cart/items/:itemId`, `DELETE /api/cart`
- **Pedidos:** `GET/POST /api/orders`, `PATCH /api/orders/:id/status` (admin)
- Rutas protegidas con middleware JWT y rol `admin` donde corresponde

## Scripts

| Ubicación  | Comando     | Descripción              |
|-----------|-------------|--------------------------|
| backend   | `npm run dev`  | Servidor con watch       |
| backend   | `npm run start` | Servidor producción     |
| backend   | `npm run seed`  | Seed productos + admin   |
| frontend  | `npm run dev`   | Dev con Vite             |
| frontend  | `npm run build` | Build para producción   |

## Variables de entorno

### Backend (`.env`)

| Variable     | Descripción                          |
|-------------|--------------------------------------|
| PORT        | Puerto del servidor (ej. 5000)       |
| MONGODB_URI | URI de conexión a MongoDB            |
| JWT_SECRET  | Clave para firmar tokens JWT         |
| NODE_ENV    | `development` o `production`        |

### Frontend (opcional)

Si en producción el API está en otra URL, define `VITE_API_URL` y úsala en tu cliente HTTP (en este proyecto el proxy de Vite apunta a `localhost:5000` en desarrollo).

---

Desarrollado con React, Vite, TailwindCSS, Node.js, Express, MongoDB y Mongoose.
