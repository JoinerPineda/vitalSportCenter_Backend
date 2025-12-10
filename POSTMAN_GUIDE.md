# Guía de Postman - Vital Sport Center API

## Importar la Colección y Ambiente en Postman

### Opción 1: Importar archivos JSON

1. **Descarga Postman** (si no lo tienes): https://www.postman.com/downloads/

2. **Importar la colección:**
   - Abre Postman
   - Click en **Import** (botón superior izquierdo)
   - Selecciona el archivo `Vital_Sport_Center_API.postman_collection.json`
   - Click en **Import**

3. **Importar el ambiente:**
   - Click en el ícono de engranaje (⚙️) en la esquina superior derecha
   - Click en **Manage Environments**
   - Click en **Import**
   - Selecciona el archivo `Vital_Sport_Center_Environment.postman_environment.json`
   - Click en **Import**

4. **Seleccionar el ambiente:**
   - En la esquina superior derecha, en el dropdown que dice "No Environment"
   - Selecciona "Vital Sport Center - Development"

## Flujo de Pruebas Recomendado

### 1️⃣ Registrar un nuevo usuario

**Endpoint:** `POST /auth/register`

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

✅ El token se guardará automáticamente en la variable `token`
✅ El userId se guardará en `userId`

### 2️⃣ Iniciar sesión (alternativa)

**Endpoint:** `POST /auth/login`

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

### 3️⃣ Obtener usuario actual

**Endpoint:** `GET /auth/me`

Verifica que tu token funciona correctamente.

### 4️⃣ Listar todas las canchas

**Endpoint:** `GET /courts`

Parámetros opcionales:
- `sport=Fútbol` - Filtrar por deporte
- `location=Centro` - Filtrar por ubicación
- `page=1` - Número de página
- `limit=10` - Resultados por página

### 5️⃣ Obtener detalles de una cancha

**Endpoint:** `GET /courts/:courtId`

- Copia el ID de una cancha de la respuesta anterior
- Pégalo en la variable `courtId` (o en la URL directamente)

### 6️⃣ Crear una reserva

**Endpoint:** `POST /bookings`

```json
{
  "court": "{{courtId}}",
  "date": "2025-12-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "duration": 1,
  "paymentMethod": "card",
  "notes": "Reserva con amigos"
}
```

✅ El bookingId se guardará automáticamente en la variable `bookingId`

### 7️⃣ Obtener mis reservas

**Endpoint:** `GET /bookings/my-bookings`

Parámetros opcionales:
- `status=confirmed` - Filtrar por estado (pending, confirmed, completed, cancelled)
- `page=1` - Número de página
- `limit=10` - Resultados por página

### 8️⃣ Obtener detalles de una reserva

**Endpoint:** `GET /bookings/:bookingId`

### 9️⃣ Cancelar una reserva

**Endpoint:** `DELETE /bookings/:bookingId`

## Para Pruebas de Admin

### Registrar como Admin

Si necesitas un usuario admin, cambia el email y usa:

```bash
npm run seed
```

Esto creará:
- **Admin:** admin@vitalsport.com / admin123
- **Client:** juan@example.com / user123

### Crear una cancha (solo admin)

**Endpoint:** `POST /courts`

Headers:
- `Authorization: Bearer {{admin_token}}`
- `Content-Type: application/json`

Body:
```json
{
  "name": "Nueva Cancha",
  "sport": "Tenis",
  "location": "Barrio Nuevo, Manizales",
  "price": 50000,
  "capacity": 2,
  "description": "Cancha de tenis",
  "amenities": ["Iluminación", "Agua"],
  "image": "https://..."
}
```

### Actualizar estado de reserva (admin)

**Endpoint:** `PATCH /bookings/:bookingId/status`

Headers:
- `Authorization: Bearer {{admin_token}}`

Body:
```json
{
  "status": "confirmed"
}
```

Estados permitidos: `pending`, `confirmed`, `completed`, `cancelled`

### Ver todas las reservas (admin)

**Endpoint:** `GET /bookings/all`

## Variables de Entorno Disponibles

| Variable | Descripción |
|----------|-------------|
| `base_url` | URL base de la API (http://localhost:5000/api) |
| `token` | Token JWT del usuario cliente |
| `admin_token` | Token JWT del usuario admin |
| `userId` | ID del usuario cliente |
| `admin_userId` | ID del usuario admin |
| `userRole` | Rol del usuario (client o admin) |
| `courtId` | ID de la cancha actual |
| `bookingId` | ID de la reserva actual |

## Cookies y Autenticación

Los tokens se guardan automáticamente después de:
- ✅ POST /auth/register
- ✅ POST /auth/login

Los IDs se guardan automáticamente después de:
- ✅ POST /bookings (guarda el bookingId)

## Troubleshooting

### Error 401 - Unauthorized
- Verifica que el token no esté vacío
- Vuelve a hacer login o register
- El token puede haber expirado (7 días)

### Error 403 - Forbidden
- Necesitas ser admin para esta operación
- Usa `admin_token` en lugar de `token`

### Error 404 - Not Found
- Verifica que el ID de la cancha o reserva sea válido
- La cancha/reserva podría haber sido eliminada

### El servidor no responde
- Verifica que el backend esté corriendo: `npm run dev`
- Comprueba que MongoDB esté corriendo
- Verifica el `base_url` en el ambiente

## Exportar Datos de Postman

Para guardar tus pruebas:
1. Click derecho en la colección
2. **Export**
3. Elige formato JSON
4. Guarda el archivo

## Tips Útiles

- 💾 **Guardar respuestas:** Click en **Save Response** en cada endpoint
- 📊 **Ver historia:** Abre la pestaña **History** para ver todas tus peticiones
- 🔄 **Reutilizar valores:** Usa `{{variable}}` en cualquier campo
- ⏱️ **Ejecutar en serie:** Usa **Runner** para ejecutar múltiples endpoints
- 📝 **Documentación:** Cada endpoint tiene descripción en la sección **Description**

## Documentación Completa

Ver `API_EXAMPLES.md` para más detalles sobre cada endpoint y sus respuestas.
