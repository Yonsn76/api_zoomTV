# API de Transmisiones - Zoom TV Canal 10

## Descripción
API CRUD completa para manejar transmisiones en vivo del canal de televisión. Permite crear, leer, actualizar y eliminar transmisiones, así como gestionar su estado en vivo.

## Endpoints Disponibles

### 1. Obtener todas las transmisiones
```http
GET /api/transmisiones
```

**Parámetros de consulta:**
- `category`: Filtrar por categoría
- `isLive`: Filtrar por estado en vivo (true/false)
- `isActive`: Filtrar por estado activo (true/false)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

**Ejemplo:**
```bash
curl -X GET "http://localhost:5000/api/transmisiones?category=Noticias&isLive=true&page=1&limit=5"
```

### 2. Obtener transmisiones activas
```http
GET /api/transmisiones/active
```

**Ejemplo:**
```bash
curl -X GET "http://localhost:5000/api/transmisiones/active"
```

### 3. Obtener transmisiones en vivo
```http
GET /api/transmisiones/live
```

**Ejemplo:**
```bash
curl -X GET "http://localhost:5000/api/transmisiones/live"
```

### 4. Obtener transmisiones por categoría
```http
GET /api/transmisiones/category/:category
```

**Ejemplo:**
```bash
curl -X GET "http://localhost:5000/api/transmisiones/category/Noticias"
```

### 5. Obtener una transmisión específica
```http
GET /api/transmisiones/:id
```

**Ejemplo:**
```bash
curl -X GET "http://localhost:5000/api/transmisiones/64a1b2c3d4e5f6789012345"
```

### 6. Crear nueva transmisión
```http
POST /api/transmisiones
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Transmisión en Vivo - Zoom TV Canal 10",
  "description": "Transmisión principal del canal en vivo las 24 horas",
  "streamUrl": "https://ejemplo.com/stream.m3u8",
  "streamType": "HLS",
  "isActive": true,
  "isLive": true,
  "category": "Noticias",
  "quality": "HD",
  "tags": ["en-vivo", "24-horas", "noticias"],
  "playerConfig": {
    "autoplay": false,
    "muted": true,
    "controls": true,
    "loop": false,
    "volume": 0.5
  },
  "schedule": {
    "isScheduled": false
  }
}
```

**Ejemplo:**
```bash
curl -X POST "http://localhost:5000/api/transmisiones" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Transmisión en Vivo - Zoom TV Canal 10",
    "description": "Transmisión principal del canal",
    "streamUrl": "https://ejemplo.com/stream.m3u8",
    "streamType": "HLS",
    "isActive": true,
    "isLive": true,
    "category": "Noticias"
  }'
```

### 7. Actualizar transmisión
```http
PUT /api/transmisiones/:id
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** (mismos campos que POST)

**Ejemplo:**
```bash
curl -X PUT "http://localhost:5000/api/transmisiones/64a1b2c3d4e5f6789012345" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Transmisión Actualizada",
    "isLive": false
  }'
```

### 8. Actualizar estado en vivo
```http
PATCH /api/transmisiones/:id/live-status
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "isLive": true
}
```

**Ejemplo:**
```bash
curl -X PATCH "http://localhost:5000/api/transmisiones/64a1b2c3d4e5f6789012345/live-status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"isLive": true}'
```

### 9. Incrementar vistas
```http
PATCH /api/transmisiones/:id/view
```

**Ejemplo:**
```bash
curl -X PATCH "http://localhost:5000/api/transmisiones/64a1b2c3d4e5f6789012345/view"
```

### 10. Eliminar transmisión
```http
DELETE /api/transmisiones/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Ejemplo:**
```bash
curl -X DELETE "http://localhost:5000/api/transmisiones/64a1b2c3d4e5f6789012345" \
  -H "Authorization: Bearer <token>"
```

## Estructura del Modelo

### Campos Principales
- `title`: Título de la transmisión (requerido)
- `description`: Descripción de la transmisión
- `streamUrl`: URL del stream (requerido)
- `streamType`: Tipo de stream (HLS, RTMP, WebRTC, DASH, MP4, Otros)
- `isActive`: Estado activo de la transmisión
- `isLive`: Estado en vivo de la transmisión
- `category`: Categoría (Noticias, Deportes, Entretenimiento, etc.)
- `quality`: Calidad (SD, HD, FHD, 4K)
- `tags`: Array de etiquetas

### Configuración del Reproductor
- `playerConfig.autoplay`: Reproducción automática
- `playerConfig.muted`: Silenciado por defecto
- `playerConfig.controls`: Mostrar controles
- `playerConfig.loop`: Reproducción en bucle
- `playerConfig.volume`: Volumen (0-1)

### Estadísticas
- `stats.views`: Número de vistas
- `stats.maxConcurrentViewers`: Máximo de espectadores simultáneos
- `stats.lastViewed`: Última vez que se vio

### Programación
- `schedule.startDate`: Fecha de inicio programada
- `schedule.endDate`: Fecha de fin programada
- `schedule.isScheduled`: Si está programada

## Respuestas de la API

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "title": "Transmisión en Vivo",
    "streamUrl": "https://ejemplo.com/stream.m3u8",
    "isLive": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Mensaje de error",
  "error": "Detalles del error"
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Datos de entrada inválidos
- `401`: No autorizado
- `403`: Prohibido (sin permisos de admin)
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Autenticación

Los endpoints de creación, actualización y eliminación requieren autenticación con token JWT y permisos de administrador.

## Ejemplos de Uso en Frontend

### JavaScript/React
```javascript
// Obtener transmisiones en vivo
const getLiveTransmissions = async () => {
  try {
    const response = await fetch('/api/transmisiones/live');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Crear nueva transmisión
const createTransmission = async (transmissionData) => {
  try {
    const response = await fetch('/api/transmisiones', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transmissionData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

// Actualizar estado en vivo
const updateLiveStatus = async (id, isLive) => {
  try {
    const response = await fetch(`/api/transmisiones/${id}/live-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isLive })
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Notas Importantes

1. **URLs de Stream**: Deben ser URLs válidas (http/https)
2. **Autenticación**: Los endpoints de modificación requieren token JWT válido
3. **Permisos**: Solo usuarios con rol 'admin' pueden crear/modificar/eliminar
4. **Validación**: Todos los campos requeridos son validados automáticamente
5. **Paginación**: Los endpoints de listado soportan paginación
6. **Estadísticas**: Las vistas se incrementan automáticamente al usar el endpoint correspondiente
