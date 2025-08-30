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

const cleanupOldMedia = async () => {
  try {
    console.log('🧹 Limpiando archivos antiguos sin GridFS...');
    
    // Esperar a que la conexión esté lista
    await mongoose.connection.asPromise();
    
    // Buscar archivos sin gridFSId
    const oldMedia = await Media.find({ gridFSId: { $exists: false } });
    
    console.log(`📊 Encontrados ${oldMedia.length} archivos sin GridFS`);
    
    if (oldMedia.length === 0) {
      console.log('✅ No hay archivos antiguos para limpiar');
      return;
    }
    
    // Mostrar archivos que se van a eliminar
    console.log('\n🗑️ Archivos que se eliminarán:');
    oldMedia.forEach(media => {
      console.log(`  - ${media.filename} (${media.originalName})`);
    });
    
    // Eliminar archivos antiguos
    const result = await Media.deleteMany({ gridFSId: { $exists: false } });
    
    console.log(`\n✅ Eliminados ${result.deletedCount} archivos antiguos`);
    
    // Verificar estado final
    const remainingMedia = await Media.find({});
    const withGridFS = remainingMedia.filter(media => media.gridFSId);
    
    console.log(`\n📊 Estado final:`);
    console.log(`  - Total archivos: ${remainingMedia.length}`);
    console.log(`  - Con GridFS: ${withGridFS.length}`);
    console.log(`  - Sin GridFS: ${remainingMedia.length - withGridFS.length}`);
    
  } catch (error) {
    console.error('❌ Error limpiando archivos:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar limpieza
cleanupOldMedia();
