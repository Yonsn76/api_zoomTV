import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/default.js';

// Import routes
import noticiasRoutes from './routes/noticias.js';
import categoriasRoutes from './routes/categorias.js';
import autoresRoutes from './routes/autores.js';
import usuariosRoutes from './routes/usuarios.js';
import mediaRoutes from './routes/media.js';
import authRoutes from './routes/auth.js';
import programacionRoutes from './routes/programacion.js';
import anunciantesRoutes from './routes/anunciantes.js';
import companyRoutes from './routes/company.js';
import transmisionesRoutes from './routes/transmisiones.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware - Configurado para permitir muchas peticiones
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitar CSP para evitar bloqueos
  crossOriginEmbedderPolicy: false, // Deshabilitar COEP
  crossOriginOpenerPolicy: false, // Deshabilitar COOP
}));
app.use(compression({
  level: 1, // Compresión mínima para mejor rendimiento
  threshold: 1024, // Solo comprimir archivos > 1KB
}));

// CORS configuration - Allow all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rate limiting - DESHABILITADO para evitar errores con muchas peticiones
// const limiter = rateLimit({
//   windowMs: config.rateLimit.windowMs,
//   max: config.rateLimit.maxRequests,
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/noticias', noticiasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/programacion', programacionRoutes);
app.use('/api/anunciantes', anunciantesRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/transmisiones', transmisionesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Zoom TV API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: 50, // Mantener hasta 50 conexiones en el pool
      serverSelectionTimeoutMS: 5000, // Mantener intentando por 5 segundos
      socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
      bufferMaxEntries: 0, // Deshabilitar buffering
      bufferCommands: false, // Deshabilitar buffering de comandos
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = config.server.port;
const startServer = async () => {
  await connectDB();
  
  // Configuraciones adicionales para manejar muchas peticiones
  app.set('trust proxy', 1); // Para manejar proxies correctamente
  app.disable('x-powered-by'); // Ocultar información del servidor
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.server.env}`);
  });
  
  // Configuraciones del servidor para manejar muchas conexiones
  server.keepAliveTimeout = 65000; // Mantener conexiones vivas por 65 segundos
  server.headersTimeout = 66000; // Timeout para headers por 66 segundos
  server.maxConnections = 1000; // Máximo 1000 conexiones simultáneas
};

startServer().catch(console.error);
