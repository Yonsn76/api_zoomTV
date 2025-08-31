# Zoom TV API - CMS Backend

API REST para el sistema de gestión de contenido (CMS) de Zoom TV.

## 🚀 Características

- **Autenticación JWT** con roles y permisos
- **CRUD completo** para noticias, categorías y usuarios
- **Gestión de archivos** con subida de imágenes
- **Búsqueda y filtros** avanzados
- **Paginación** en todas las consultas
- **Validación de datos** con express-validator
- **Manejo de errores** centralizado
- **Rate limiting** para protección
- **CORS** configurado para frontend

## 📋 Requisitos

- Node.js 18+ 
- MongoDB 5+
- npm o yarn

## 🛠️ Instalación

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
# Copiar el archivo de configuración
cp config.env.example config.env

# Editar las variables según tu configuración
```

4. **Inicializar la base de datos**
```bash
npm run init-db
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔧 Configuración

### Variables de Entorno

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/zoom_tv_cms

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=24h

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Login de usuario | Público |
| POST | `/api/auth/register` | Registrar usuario | Privado (Admin) |
| GET | `/api/auth/me` | Obtener usuario actual | Privado |
| PUT | `/api/auth/profile` | Actualizar perfil | Privado |
| PUT | `/api/auth/change-password` | Cambiar contraseña | Privado |

### Noticias

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/noticias` | Obtener todas las noticias | Público |
| GET | `/api/noticias/:id` | Obtener noticia por ID | Público |
| GET | `/api/noticias/featured/featured` | Noticias destacadas | Público |
| GET | `/api/noticias/category/:category` | Noticias por categoría | Público |
| GET | `/api/noticias/search/search` | Buscar noticias | Público |
| POST | `/api/noticias` | Crear noticia | Privado |
| PUT | `/api/noticias/:id` | Actualizar noticia | Privado |
| DELETE | `/api/noticias/:id` | Eliminar noticia | Privado |
| PUT | `/api/noticias/:id/publish` | Publicar noticia | Privado |
| PUT | `/api/noticias/:id/archive` | Archivar noticia | Privado |

### Categorías

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/categorias` | Obtener todas las categorías | Público |
| GET | `/api/categorias/:id` | Obtener categoría por ID | Público |
| POST | `/api/categorias` | Crear categoría | Privado (Admin) |
| PUT | `/api/categorias/:id` | Actualizar categoría | Privado (Admin) |
| DELETE | `/api/categorias/:id` | Eliminar categoría | Privado (Admin) |

### Usuarios

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/usuarios` | Obtener todos los usuarios | Privado (Admin) |
| GET | `/api/usuarios/:id` | Obtener usuario por ID | Privado (Admin) |
| PUT | `/api/usuarios/:id` | Actualizar usuario | Privado (Admin) |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | Privado (Admin) |
| PUT | `/api/usuarios/:id/toggle-status` | Activar/Desactivar usuario | Privado (Admin) |

### Autores

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/autores` | Obtener todos los autores | Público |
| GET | `/api/autores/:id` | Obtener autor por ID | Público |

### Media

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/media/upload` | Subir archivo | Privado |
| POST | `/api/media/upload-multiple` | Subir múltiples archivos | Privado |
| DELETE | `/api/media/:filename` | Eliminar archivo | Privado |
| GET | `/api/media/:filename` | Obtener info del archivo | Público |

## 🔐 Autenticación

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@zoomtv.com",
  "password": "admin123"
}
```

### Respuesta

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "admin",
    "email": "admin@zoomtv.com",
    "role": "admin",
    "permissions": ["create", "read", "update", "delete", "publish"],
    "profile": {
      "firstName": "Administrador",
      "lastName": "Zoom TV"
    },
    "fullName": "Administrador Zoom TV"
  }
}
```

### Uso del Token

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Ejemplos de Uso

### Crear una Noticia

```bash
POST /api/noticias
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "nueva-noticia-2024",
  "title": "Nueva noticia importante",
  "author": "Redacción Zoom TV",
  "date": "15 de Enero, 2024",
  "summary": "Resumen de la noticia importante",
  "content": "Contenido completo de la noticia...",
  "category": "actualidad",
  "status": "draft",
  "featured": false,
  "tags": ["importante", "actualidad", "huánuco"],
  "seoTitle": "Nueva noticia importante - Zoom TV",
  "seoDescription": "Descripción SEO de la noticia",
  "seoKeywords": ["noticia", "importante", "actualidad"]
}
```

### Obtener Noticias con Filtros

```bash
GET /api/noticias?category=actualidad&page=1&limit=10&search=gobierno
```

### Subir Imagen

```bash
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [archivo de imagen]
alt: "Descripción de la imagen"
caption: "Pie de foto"
```

## 🏗️ Estructura del Proyecto

```
backend/
├── models/           # Modelos de MongoDB
│   ├── Noticia.js
│   ├── Categoria.js
│   └── Usuario.js
├── routes/           # Rutas de la API
│   ├── auth.js
│   ├── noticias.js
│   ├── categorias.js
│   ├── usuarios.js
│   ├── autores.js
│   └── media.js
├── middleware/       # Middleware personalizado
│   ├── auth.js
│   └── errorHandler.js
├── scripts/          # Scripts de utilidad
│   └── initDb.js
├── uploads/          # Archivos subidos
├── server.js         # Archivo principal
├── package.json
├── config.env        # Variables de entorno
└── README.md
```

## 🔒 Roles y Permisos

### Roles
- **admin**: Acceso completo al sistema
- **editor**: Puede crear, editar y publicar contenido
- **author**: Puede crear y editar su propio contenido

### Permisos
- `create`: Crear contenido
- `read`: Leer contenido
- `update`: Actualizar contenido
- `delete`: Eliminar contenido
- `publish`: Publicar contenido
- `manage_users`: Gestionar usuarios
- `manage_categories`: Gestionar categorías

## 🚨 Manejo de Errores

La API devuelve errores en formato JSON:

```json
{
  "success": false,
  "error": "Mensaje de error",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 📊 Paginación

Las consultas que devuelven múltiples resultados incluyen información de paginación:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## 🔧 Scripts Disponibles

```bash
# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start

# Inicializar base de datos
npm run init-db
```

## 👥 Usuario por Defecto

Al ejecutar `npm run init-db` se crea un usuario administrador:

- **Email**: admin@zoomtv.com
- **Password**: admin123
- **Rol**: admin

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico, contacta a:
- Email: soporte@zoomtv.com
- Teléfono: +51 999 999 999

