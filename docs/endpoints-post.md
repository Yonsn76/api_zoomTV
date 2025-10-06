# 📤 ENDPOINTS POST - API ZOOM TV

## 🔗 Base URL: `https://apizoomtv-production.up.railway.app/api`

---

## 📰 NOTICIAS

### Crear Noticia
```bash
POST /api/noticias
```

**Body:**
```json
{
  "id": "noticia-001",
  "title": "Título de la noticia",
  "author": "Nombre del autor",
  "date": "2024-01-15",
  "summary": "Resumen de la noticia",
  "content": "Contenido completo de la noticia...",
  "category": "actualidad",
  "status": "published",
  "featured": true,
  "imageUrl": "https://example.com/imagen.jpg",
  "tags": ["tag1", "tag2"]
}
```

**Categorías válidas:** `actualidad`, `deportes`, `musica`, `nacionales`, `regionales`
**Estados válidos:** `published`, `draft`, `archived`

---

## 👥 USUARIOS

### Crear Usuario
```bash
POST /api/usuarios
```

**Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "author",
  "active": true,
  "profile": {
    "firstName": "Nombre",
    "lastName": "Apellido",
    "bio": "Biografía del usuario",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Roles válidos:** `admin`, `editor`, `author`

---

## 📁 MEDIA

### Subir Archivo
```bash
POST /api/media/upload
```

**Form Data:**
- `file`: Archivo a subir (imagen, documento, etc.)
- `alt`: Texto alternativo (opcional)
- `caption`: Descripción del archivo (opcional)

### Subir Múltiples Archivos
```bash
POST /api/media/upload-multiple
```

**Form Data:**
- `files`: Array de archivos (máximo 100)
- `alt`: Texto alternativo (opcional)
- `caption`: Descripción del archivo (opcional)

---

## 📺 PROGRAMACIÓN

### Crear Programa
```bash
POST /api/programacion
```

**Body:**
```json
{
  "title": "Nombre del programa",
  "description": "Descripción del programa",
  "day": "LUNES",
  "startTime": "08:00",
  "endTime": "09:00",
  "category": "Noticias",
  "type": "Programa en vivo",
  "priority": 1,
  "isActive": true,
  "notes": "Notas adicionales"
}
```

**Días válidos:** `LUNES`, `MARTES`, `MIÉRCOLES`, `JUEVES`, `VIERNES`, `SÁBADO`, `DOMINGO`
**Categorías válidas:** `Noticias`, `Música`, `Cine`, `Series`, `Anime`, `Entretenimiento`, `Deportes`, `Documentales`, `Otros`
**Tipos válidos:** `Programa en vivo`, `Película`, `Serie`, `Música`, `Anime`, `Documental`, `Otros`

---

## 📢 ANUNCIANTES

### Crear Anunciante
```bash
POST /api/anunciantes
```

**Body:**
```json
{
  "name": "Nombre del anunciante",
  "imageUrl": "https://example.com/anunciante.jpg",
  "description": "Descripción del anunciante",
  "isFlyer": false,
  "enableZoom": true,
  "status": "active",
  "category": "Comercio",
  "priority": 1,
  "website": "https://anunciante.com",
  "phone": "+1234567890"
}
```

**Estados válidos:** `active`, `inactive`, `pending`

---

## 📡 TRANSMISIONES

### Crear Transmisión
```bash
POST /api/transmisiones
```

**Body:**
```json
{
  "nombre": "Nombre de la transmisión",
  "url": "https://stream.ejemplo.com/live",
  "isLive": true,
  "isActive": true,
  "description": "Descripción de la transmisión",
  "category": "Noticias"
}
```

---

## 📂 CATEGORÍAS

### Crear Categoría
```bash
POST /api/categorias
```

**Body:**
```json
{
  "name": "Nombre de la categoría",
  "slug": "slug-categoria",
  "description": "Descripción de la categoría",
  "color": "#FF6B6B",
  "icon": "icono",
  "order": 1,
  "active": true
}
```

---

## 🏢 INFORMACIÓN DE EMPRESA

### Actualizar Información de Empresa
```bash
PUT /api/company/info
```

**Body:**
```json
{
  "name": "Zoom TV",
  "slogan": "Tu canal de confianza",
  "description": "Descripción de la empresa",
  "logo": "https://example.com/logo.png",
  "address": "Dirección de la empresa",
  "phone": "+1234567890",
  "email": "info@zoomtv.com",
  "website": "https://zoomtv.com",
  "socialMedia": {
    "facebook": "https://facebook.com/zoomtv",
    "twitter": "https://twitter.com/zoomtv",
    "instagram": "https://instagram.com/zoomtv",
    "youtube": "https://youtube.com/zoomtv"
  }
}
```

### Crear Miembro del Equipo
```bash
POST /api/company/team
```

**Body:**
```json
{
  "name": "Nombre del miembro",
  "position": "Cargo",
  "bio": "Biografía del miembro",
  "image": "https://example.com/miembro.jpg",
  "socialMedia": {
    "linkedin": "https://linkedin.com/in/miembro"
  },
  "order": 1,
  "isActive": true
}
```

### Actualizar Historia de Empresa
```bash
PUT /api/company/history
```

**Body:**
```json
{
  "title": "Nuestra Historia",
  "content": "Contenido de la historia...",
  "milestones": [
    {
      "year": "2020",
      "title": "Fundación",
      "description": "Descripción del hito"
    }
  ]
}
```

### Actualizar Valores de Empresa
```bash
PUT /api/company/values
```

**Body:**
```json
{
  "title": "Nuestros Valores",
  "vision": {
    "title": "Nuestra Visión",
    "content": "Contenido de la visión"
  },
  "mission": {
    "title": "Nuestra Misión",
    "content": "Contenido de la misión"
  },
  "values": [
    {
      "name": "Integridad",
      "description": "Descripción del valor",
      "icon": "integrity"
    }
  ]
}
```

---

## 🔐 AUTENTICACIÓN

### Login (Opcional)
```bash
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@zoom.tv",
  "password": "123456"
}
```

### Actualizar Perfil
```bash
PUT /api/auth/profile
```

**Body:**
```json
{
  "profile": {
    "firstName": "Nuevo Nombre",
    "lastName": "Nuevo Apellido",
    "bio": "Nueva biografía"
  }
}
```

### Cambiar Contraseña
```bash
PUT /api/auth/change-password
```

**Body:**
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

---

## 📋 NOTAS IMPORTANTES

1. **TODOS los endpoints son públicos** - No se requiere autenticación
2. **No necesitas tokens JWT** para ningún endpoint
3. **Puedes hacer POST, PUT, DELETE** sin restricciones
4. **Los campos marcados como opcionales** pueden omitirse
5. **Los valores de enums** deben coincidir exactamente con los valores válidos
6. **Las URLs de imágenes** deben ser válidas y accesibles
7. **Los emails** deben tener formato válido
8. **Las fechas** deben estar en formato ISO (YYYY-MM-DD)
9. **Las horas** deben estar en formato HH:MM (24 horas)

---

## 🚀 EJEMPLOS DE USO

### Crear una noticia completa:
```bash
curl -X POST https://apizoomtv-production.up.railway.app/api/noticias \
  -H "Content-Type: application/json" \
  -d '{
    "id": "noticia-001",
    "title": "Zoom TV inaugura nueva temporada",
    "author": "Redacción Zoom TV",
    "date": "2024-01-15",
    "summary": "La cadena presenta su nueva programación",
    "content": "Zoom TV ha anunciado oficialmente...",
    "category": "actualidad",
    "status": "published",
    "featured": true,
    "imageUrl": "https://example.com/noticia.jpg",
    "tags": ["programación", "televisión"]
  }'
```

### Crear un programa de programación:
```bash
curl -X POST https://apizoomtv-production.up.railway.app/api/programacion \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Noticias Matutinas",
    "description": "Resumen de noticias del día",
    "day": "LUNES",
    "startTime": "08:00",
    "endTime": "09:00",
    "category": "Noticias",
    "type": "Programa en vivo",
    "priority": 1,
    "isActive": true,
    "notes": "Programa en vivo con noticias locales"
  }'
```

### Crear un anunciante:
```bash
curl -X POST https://apizoomtv-production.up.railway.app/api/anunciantes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Supermercado Central",
    "imageUrl": "https://example.com/supermercado.jpg",
    "description": "Los mejores precios",
    "isFlyer": false,
    "enableZoom": true,
    "status": "active",
    "category": "Comercio",
    "priority": 1,
    "website": "https://supermercadocentral.com",
    "phone": "+1234567890"
  }'
```

---

## 📊 TOTAL DE ENDPOINTS POST

- **Noticias:** 1 endpoint
- **Usuarios:** 1 endpoint  
- **Media:** 2 endpoints
- **Programación:** 1 endpoint
- **Anunciantes:** 1 endpoint
- **Transmisiones:** 1 endpoint
- **Categorías:** 1 endpoint
- **Empresa:** 4 endpoints
- **Autenticación:** 3 endpoints

**Total: 15 endpoints POST/PUT disponibles**
