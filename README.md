# Vital Sport Center - Backend API

Backend de Vital Sport Center, una plataforma para reservar canchas deportivas en Manizales, Colombia.

## Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** MongoDB
- **Autenticación:** JWT (JSON Web Tokens)

## Requisitos Previos

- Node.js 18+
- MongoDB (local o Atlas)
- npm o yarn

## Instalación

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-sport-center
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```

## Scripts

- `npm run dev` - Ejecutar en modo desarrollo (con hot-reload)
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar la versión compilada
- `npm run watch` - Compilar TypeScript en modo watch

## Estructura del Proyecto

```
src/
├── config/           # Configuración (base de datos)
├── controllers/      # Lógica de negocio
├── middleware/       # Middlewares de autenticación
├── models/          # Modelos de Mongoose
├── routes/          # Rutas de la API
└── index.ts         # Entrada principal
```

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Canchas

- `GET /api/courts` - Listar todas las canchas
- `GET /api/courts/:id` - Obtener cancha por ID
- `POST /api/courts` - Crear cancha (solo admin)
- `PUT /api/courts/:id` - Actualizar cancha (solo admin)
- `DELETE /api/courts/:id` - Eliminar cancha (solo admin)

### Reservas

- `POST /api/bookings` - Crear reserva
- `GET /api/bookings/my-bookings` - Obtener mis reservas
- `GET /api/bookings/all` - Obtener todas las reservas (solo admin)
- `GET /api/bookings/:id` - Obtener detalles de reserva
- `PATCH /api/bookings/:id/status` - Actualizar estado de reserva
- `DELETE /api/bookings/:id` - Cancelar reserva

## Ejemplo de Uso

### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@example.com","password":"123456"}'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"123456"}'
```

### Listar canchas
```bash
curl http://localhost:5000/api/courts
```

### Crear reserva (requiere token)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "court":"640a1234567890abcdef1234",
    "date":"2025-12-15",
    "startTime":"14:00",
    "endTime":"15:00",
    "duration":1,
    "paymentMethod":"card",
    "notes":""
  }'
```

## Autenticación

La API utiliza JWT (JSON Web Tokens). Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <your_jwt_token>
```

## Roles de Usuario

- **client:** Usuario normal que puede hacer reservas
- **admin:** Administrador que puede gestionar canchas y ver todas las reservas

## Despliegue

Para desplegar en producción:

1. Compilar TypeScript: `npm run build`
2. Configurar variables de entorno para producción
3. Ejecutar: `npm start`

## Mejoras Futuras

- Integración con pasarela de pagos (Stripe, PayPal)
- Notificaciones por email
- Sistema de calificaciones y reseñas
- Búsqueda avanzada y filtros
- Historial de transacciones
- Reportes de admin

## Licencia

ISC
