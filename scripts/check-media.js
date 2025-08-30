import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../config/default.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

// Conectar a MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Importar modelo Media
import Media from '../models/Media.js';

const checkMedia = async () => {
  try {
    console.log('🔍 Verificando estado de archivos en la base de datos...');
    
    // Obtener todos los archivos
    const allMedia = await Media.find({});
    console.log(`📊 Total archivos en la base de datos: ${allMedia.length}`);
    
    // Verificar archivos con gridFSId
    const withGridFS = allMedia.filter(media => media.gridFSId);
    console.log(`✅ Archivos con GridFS: ${withGridFS.length}`);
    
    // Verificar archivos sin gridFSId
    const withoutGridFS = allMedia.filter(media => !media.gridFSId);
    console.log(`❌ Archivos sin GridFS: ${withoutGridFS.length}`);
    
    if (withoutGridFS.length > 0) {
      console.log('\n📋 Archivos sin GridFS:');
      withoutGridFS.forEach(media => {
        console.log(`  - ${media.filename} (${media.originalName})`);
      });
      
      console.log('\n💡 Estos archivos probablemente fueron subidos antes de implementar GridFS');
      console.log('💡 Puedes usar el script migrate-to-gridfs.js para migrarlos');
    }
    
    // Verificar archivos activos vs inactivos
    const activeMedia = allMedia.filter(media => media.isActive);
    const inactiveMedia = allMedia.filter(media => !media.isActive);
    
    console.log(`\n📈 Archivos activos: ${activeMedia.length}`);
    console.log(`📉 Archivos inactivos: ${inactiveMedia.length}`);
    
    // Mostrar algunos ejemplos
    if (allMedia.length > 0) {
      console.log('\n📄 Ejemplos de archivos:');
      allMedia.slice(0, 5).forEach(media => {
        console.log(`  - ${media.filename}`);
        console.log(`    Original: ${media.originalName}`);
        console.log(`    Tamaño: ${(media.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`    Tipo: ${media.mimeType}`);
        console.log(`    GridFS: ${media.gridFSId ? '✅' : '❌'}`);
        console.log(`    Activo: ${media.isActive ? '✅' : '❌'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error verificando archivos:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar verificación
checkMedia();
