import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transmision from '../models/Transmision.js';
import Usuario from '../models/Usuario.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

// Datos de ejemplo para transmisiones
const transmisionesEjemplo = [
  {
    nombre: "Noticias 24/7 - Canal Principal",
    url: "https://example.com/streams/noticias-24.m3u8",
    isActive: true,
    isLive: true,
    createdBy: null // Se asignará dinámicamente
  },
  {
    nombre: "Deportes en Vivo - Fútbol",
    url: "https://example.com/streams/deportes-futbol.m3u8",
    isActive: true,
    isLive: false,
    createdBy: null // Se asignará dinámicamente
  },
  {
    nombre: "Música Clásica - Radio Zoom",
    url: "https://example.com/streams/musica-clasica.m3u8",
    isActive: true,
    isLive: true,
    createdBy: null // Se asignará dinámicamente
  },
  {
    nombre: "Entretenimiento - Shows y Programas",
    url: "https://example.com/streams/entretenimiento.m3u8",
    isActive: true,
    isLive: false,
    createdBy: null // Se asignará dinámicamente
  },
  {
    nombre: "Documentales - Canal Educativo",
    url: "https://example.com/streams/documentales.m3u8",
    isActive: false,
    isLive: false,
    createdBy: null // Se asignará dinámicamente
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
        permissions: ['read', 'create', 'update', 'delete']
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
      console.log(`\n${index + 1}. ${transmision.nombre}`);
      console.log(`   🔗 URL: ${transmision.url}`);
      console.log(`   🔴 En Vivo: ${transmision.isLive ? 'Sí' : 'No'}`);
      console.log(`   ✅ Activo: ${transmision.isActive ? 'Sí' : 'No'}`);
    });
    
    // Mostrar estadísticas generales
    const transmisionesActivas = transmisionesInsertadas.filter(t => t.isActive).length;
    const transmisionesEnVivo = transmisionesInsertadas.filter(t => t.isLive).length;
    
    console.log('\n📊 Estadísticas Generales:');
    console.log(`   📺 Total transmisiones: ${transmisionesInsertadas.length}`);
    console.log(`   ✅ Transmisiones activas: ${transmisionesActivas}`);
    console.log(`   🔴 Transmisiones en vivo: ${transmisionesEnVivo}`);
    
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
