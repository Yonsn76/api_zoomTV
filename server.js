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

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(helmet());
app.use(compression());

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

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    const conn = await mongoose.connect(config.mongodb.uri);
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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.server.env}`);
  });
};

startServer().catch(console.error);
