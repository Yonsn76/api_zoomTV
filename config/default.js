// Configuración por defecto para la aplicación
export default {
  // MongoDB Connection
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://zoom10:zoom10@zoomtv.km2jqca.mongodb.net/?retryWrites=true&w=majority&appName=zoomtv'
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'https://apizoomtv-production.up.railway.app'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'zoom_tv_super_secret_key_2024',
    expire: process.env.JWT_EXPIRE || '24h'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 16777216, // 16MB
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};
