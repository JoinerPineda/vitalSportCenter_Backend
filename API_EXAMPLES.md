# API Examples - Vital Sport Center

## Base URL
```
http://localhost:5000/api
```

## Autenticación

### Registrar usuario
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "640a1234567890abcdef1234",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "client"
  }
}
```

### Iniciar sesión
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "640a1234567890abcdef1234",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "client"
  }
}
```

### Obtener usuario actual
```bash
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "user": {
    "_id": "640a1234567890abcdef1234",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+57 300 123 4567",
    "role": "client",
    "isActive": true,
    "createdAt": "2025-12-10T10:00:00Z",
    "updatedAt": "2025-12-10T10:00:00Z"
  }
}
```

## Canchas (Courts)

### Listar todas las canchas
```bash
GET /courts
GET /courts?sport=Fútbol
GET /courts?location=Centro
GET /courts?page=1&limit=10

Response:
{
  "courts": [
    {
      "_id": "640a1234567890abcdef1234",
      "name": "Cancha Fútbol Centro",
      "sport": "Fútbol",
      "location": "Centro, Manizales",
      "price": 60000,
      "capacity": 22,
      "description": "Cancha de fútbol profesional",
      "amenities": ["Iluminación LED", "Estacionamiento"],
      "image": "https://...",
      "isAvailable": true,
      "createdAt": "2025-12-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### Obtener cancha por ID
```bash
GET /courts/:id

Response:
{
  "court": {
    "_id": "640a1234567890abcdef1234",
    "name": "Cancha Fútbol Centro",
    "sport": "Fútbol",
    "location": "Centro, Manizales",
    "price": 60000,
    "capacity": 22,
    "description": "Cancha de fútbol profesional",
    "amenities": ["Iluminación LED", "Estacionamiento"],
    "image": "https://...",
    "isAvailable": true,
    "admin": {
      "_id": "640a1234567890abcdef1233",
      "name": "Admin Vital Sport",
      "email": "admin@vitalsport.com"
    },
    "createdAt": "2025-12-10T10:00:00Z"
  }
}
```

### Crear cancha (solo admin)
```bash
POST /courts
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Nueva Cancha",
  "sport": "Tenis",
  "location": "Barrio Nuevo, Manizales",
  "price": 50000,
  "capacity": 2,
  "description": "Cancha de tenis de arena",
  "amenities": ["Agua", "Iluminación"],
  "image": "https://..."
}

Response:
{
  "message": "Court created successfully",
  "court": {
    "_id": "640a1234567890abcdef1235",
    "name": "Nueva Cancha",
    "sport": "Tenis",
    "location": "Barrio Nuevo, Manizales",
    "price": 50000,
    "capacity": 2,
    "description": "Cancha de tenis de arena",
    "amenities": ["Agua", "Iluminación"],
    "image": "https://...",
    "isAvailable": true
  }
}
```

### Actualizar cancha (solo admin propietario)
```bash
PUT /courts/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 55000,
  "description": "Actualizado"
}

Response:
{
  "message": "Court updated successfully",
  "court": { ... }
}
```

### Eliminar cancha (solo admin propietario)
```bash
DELETE /courts/:id
Authorization: Bearer <admin_token>

Response:
{
  "message": "Court deleted successfully"
}
```

## Reservas (Bookings)

### Crear reserva
```bash
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "court": "640a1234567890abcdef1234",
  "date": "2025-12-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "duration": 1,
  "paymentMethod": "card",
  "notes": "Reserva con amigos"
}

Response:
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "640a1234567890abcdef1236",
    "user": "640a1234567890abcdef1234",
    "court": "640a1234567890abcdef1234",
    "date": "2025-12-20T00:00:00Z",
    "startTime": "14:00",
    "endTime": "15:00",
    "duration": 1,
    "totalPrice": 60000,
    "serviceFee": 3000,
    "status": "pending",
    "paymentMethod": "card",
    "notes": "Reserva con amigos",
    "createdAt": "2025-12-10T10:00:00Z"
  }
}
```

### Obtener mis reservas
```bash
GET /bookings/my-bookings
Authorization: Bearer <token>
GET /bookings/my-bookings?status=confirmed
GET /bookings/my-bookings?page=1&limit=10

Response:
{
  "bookings": [
    {
      "_id": "640a1234567890abcdef1236",
      "user": {
        "_id": "640a1234567890abcdef1234",
        "name": "Juan Pérez"
      },
      "court": {
        "_id": "640a1234567890abcdef1234",
        "name": "Cancha Fútbol Centro"
      },
      "date": "2025-12-20T00:00:00Z",
      "startTime": "14:00",
      "endTime": "15:00",
      "duration": 1,
      "totalPrice": 60000,
      "serviceFee": 3000,
      "status": "pending",
      "paymentMethod": "card"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

### Obtener detalles de reserva
```bash
GET /bookings/:id
Authorization: Bearer <token>

Response:
{
  "booking": {
    "_id": "640a1234567890abcdef1236",
    "user": { ... },
    "court": { ... },
    "date": "2025-12-20T00:00:00Z",
    "startTime": "14:00",
    "endTime": "15:00",
    "duration": 1,
    "totalPrice": 60000,
    "serviceFee": 3000,
    "status": "pending",
    "paymentMethod": "card",
    "notes": "Reserva con amigos"
  }
}
```

### Actualizar estado de reserva (admin)
```bash
PATCH /bookings/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "confirmed"
}

Response:
{
  "message": "Booking status updated",
  "booking": { ... }
}
```

### Cancelar reserva
```bash
DELETE /bookings/:id
Authorization: Bearer <token>

Response:
{
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "640a1234567890abcdef1236",
    "status": "cancelled",
    ...
  }
}
```

### Obtener todas las reservas (solo admin)
```bash
GET /bookings/all
Authorization: Bearer <admin_token>
GET /bookings/all?status=confirmed
GET /bookings/all?page=1&limit=10

Response:
{
  "bookings": [ ... ],
  "pagination": { ... }
}
```

## Estados de Reserva

- `pending`: Reserva creada, esperando confirmación de pago
- `confirmed`: Reserva confirmada y pagada
- `completed`: Reserva ya realizada
- `cancelled`: Reserva cancelada

## Códigos de Error

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
