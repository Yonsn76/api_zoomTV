import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transmision from '../models/Transmision.js';
import Usuario from '../models/Usuario.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

// Datos de ejemplo para transmisiones
const transmisionesEjemplo = [
  {
    title: "Noticias 24/7 - Canal Principal",
    description: "Transmisión continua de noticias nacionales e internacionales las 24 horas del día",
    streamUrl: "https://example.com/streams/noticias-24.m3u8",
    streamType: "HLS",
    isActive: true,
    isLive: true,
    category: "Noticias",
    quality: "HD",
    tags: ["noticias", "24-horas", "nacional", "internacional"],
    playerConfig: {
      autoplay: false,
      muted: true,
      controls: true,
      loop: false,
      volume: 0.5
    },
    stats: {
      views: 15420,
      maxConcurrentViewers: 1250,
      lastViewed: new Date().toISOString()
    },
    createdBy: null // Se asignará dinámicamente
  },
  {
    title: "Deportes en Vivo - Fútbol",
    description: "Transmisión de partidos de fútbol nacional e internacional",
    streamUrl: "https://example.com/streams/deportes-futbol.m3u8",
    streamType: "HLS",
    isActive: true,
    isLive: false,
    category: "Deportes",
    quality: "FHD",
    tags: ["deportes", "futbol", "en-vivo", "partidos"],
    playerConfig: {
      autoplay: false,
      muted: false,
      controls: true,
      loop: false,
      volume: 0.7
    },
    stats: {
      views: 8930,
      maxConcurrentViewers: 2100,
      lastViewed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
    },
    createdBy: new mongoose.Types.ObjectId()
  },
  {
    title: "Música Clásica - Radio Zoom",
    description: "Transmisión de música clásica y instrumental las 24 horas",
    streamUrl: "https://example.com/streams/musica-clasica.m3u8",
    streamType: "HLS",
    isActive: true,
    isLive: true,
    category: "Música",
    quality: "SD",
    tags: ["musica", "clasica", "instrumental", "relajante"],
    playerConfig: {
      autoplay: true,
      muted: false,
      controls: true,
      loop: true,
      volume: 0.6
    },
    stats: {
      views: 5670,
      maxConcurrentViewers: 450,
      lastViewed: new Date().toISOString()
    },
    createdBy: new mongoose.Types.ObjectId()
  },
  {
    title: "Entretenimiento - Shows y Programas",
    description: "Transmisión de programas de entretenimiento, talk shows y eventos especiales",
    streamUrl: "https://example.com/streams/entretenimiento.m3u8",
    streamType: "HLS",
    isActive: true,
    isLive: false,
    category: "Entretenimiento",
    quality: "HD",
    tags: ["entretenimiento", "shows", "talk-shows", "eventos"],
    playerConfig: {
      autoplay: false,
      muted: true,
      controls: true,
      loop: false,
      volume: 0.5
    },
    stats: {
      views: 12340,
      maxConcurrentViewers: 890,
      lastViewed: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 horas atrás
    },
    createdBy: new mongoose.Types.ObjectId()
  },
  {
    title: "Documentales - Canal Educativo",
    description: "Transmisión de documentales educativos y programas culturales",
    streamUrl: "https://example.com/streams/documentales.m3u8",
    streamType: "HLS",
    isActive: false,
    isLive: false,
    category: "Documentales",
    quality: "HD",
    tags: ["documentales", "educativo", "cultural", "aprendizaje"],
    playerConfig: {
      autoplay: false,
      muted: true,
      controls: true,
      loop: false,
      volume: 0.5
    },
    stats: {
      views: 3450,
      maxConcurrentViewers: 180,
      lastViewed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 día atrás
    },
    createdBy: new mongoose.Types.ObjectId()
  }
];

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zoomtv';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función para obtener o crear un usuario válido
const getOrCreateUser = async () => {
  try {
    // Buscar un usuario existente
    let user = await Usuario.findOne({ role: 'admin' });
    
    if (!user) {
      // Si no hay usuario admin, buscar cualquier usuario
      user = await Usuario.findOne();
    }
    
    if (!user) {
      // Crear un usuario temporal para las transmisiones
      user = new Usuario({
        username: 'admin_transmisiones',
        email: 'admin@zoomtv.com',
        password: 'password123', // Se hasheará automáticamente
        fullName: 'Administrador Transmisiones',
        role: 'admin',
        permissions: ['read', 'write', 'delete']
      });
      
      await user.save();
      console.log('👤 Usuario temporal creado para las transmisiones');
    }
    
    return user._id;
  } catch (error) {
    console.error('❌ Error obteniendo/creando usuario:', error.message);
    throw error;
  }
};

// Función para insertar datos de ejemplo
const insertTransmisionesEjemplo = async () => {
  try {
    console.log('🔄 Iniciando inserción de transmisiones de ejemplo...');
    
    // Obtener usuario válido
    const userId = await getOrCreateUser();
    console.log('👤 Usuario obtenido:', userId);
    
    // Actualizar los datos de ejemplo con el usuario válido
    const transmisionesConUsuario = transmisionesEjemplo.map(transmision => ({
      ...transmision,
      createdBy: userId
    }));
    
    // Limpiar transmisiones existentes (opcional)
    const existingCount = await Transmision.countDocuments();
    if (existingCount > 0) {
      console.log(`📊 Se encontraron ${existingCount} transmisiones existentes`);
      const shouldClear = process.argv.includes('--clear');
      if (shouldClear) {
        await Transmision.deleteMany({});
        console.log('🗑️ Transmisiones existentes eliminadas');
      } else {
        console.log('ℹ️ Usa --clear para eliminar transmisiones existentes');
      }
    }
    
    // Insertar transmisiones de ejemplo
    const transmisionesInsertadas = await Transmision.insertMany(transmisionesConUsuario);
    
    console.log('✅ Transmisiones de ejemplo insertadas exitosamente:');
    console.log(`📺 Total insertadas: ${transmisionesInsertadas.length}`);
    
    // Mostrar resumen de las transmisiones insertadas
    transmisionesInsertadas.forEach((transmision, index) => {
      console.log(`\n${index + 1}. ${transmision.title}`);
      console.log(`   📡 Categoría: ${transmision.category}`);
      console.log(`   🔴 En Vivo: ${transmision.isLive ? 'Sí' : 'No'}`);
      console.log(`   ✅ Activo: ${transmision.isActive ? 'Sí' : 'No'}`);
      console.log(`   👀 Vistas: ${transmision.stats.views.toLocaleString()}`);
      console.log(`   🎯 Calidad: ${transmision.quality}`);
    });
    
    // Mostrar estadísticas generales
    const totalViews = transmisionesInsertadas.reduce((sum, t) => sum + t.stats.views, 0);
    const transmisionesActivas = transmisionesInsertadas.filter(t => t.isActive).length;
    const transmisionesEnVivo = transmisionesInsertadas.filter(t => t.isLive).length;
    
    console.log('\n📊 Estadísticas Generales:');
    console.log(`   📺 Total transmisiones: ${transmisionesInsertadas.length}`);
    console.log(`   ✅ Transmisiones activas: ${transmisionesActivas}`);
    console.log(`   🔴 Transmisiones en vivo: ${transmisionesEnVivo}`);
    console.log(`   👀 Total de vistas: ${totalViews.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error insertando transmisiones de ejemplo:', error.message);
    throw error;
  }
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    await insertTransmisionesEjemplo();
    console.log('\n🎉 Proceso completado exitosamente!');
  } catch (error) {
    console.error('💥 Error en el proceso:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el script
main();
