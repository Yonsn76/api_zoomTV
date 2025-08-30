import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { GridFSBucket } from 'mongodb';
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

const migrateToGridFS = async () => {
  try {
    console.log('🚀 Iniciando migración a GridFS...');
    
    // Esperar a que la conexión esté lista
    await mongoose.connection.asPromise();
    
    const uploadPath = config.upload.uploadPath;
    
    // Verificar si existe el directorio de uploads
    if (!fs.existsSync(uploadPath)) {
      console.log('📁 No existe el directorio de uploads, nada que migrar');
      return;
    }

    // Leer archivos del directorio
    const files = fs.readdirSync(uploadPath);
    console.log(`📊 Encontrados ${files.length} archivos para migrar`);

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'media'
    });

    let migratedCount = 0;
    let errorCount = 0;

    for (const filename of files) {
      try {
        const filePath = path.join(uploadPath, filename);
        const stats = fs.statSync(filePath);
        
        // Saltar directorios
        if (stats.isDirectory()) continue;

        // Verificar si ya existe en la base de datos
        const existingMedia = await Media.findOne({ filename });
        if (existingMedia) {
          console.log(`⏭️  Archivo ${filename} ya existe en la base de datos, saltando...`);
          continue;
        }

        // Leer archivo
        const fileBuffer = fs.readFileSync(filePath);
        
        // Obtener información del archivo
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'application/octet-stream';
        
        if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
        else if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.webp') mimeType = 'image/webp';
        else if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.doc') mimeType = 'application/msword';
        else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (ext === '.txt') mimeType = 'text/plain';

        // Crear stream de escritura para GridFS
        const uploadStream = bucket.openUploadStream(filename, {
          metadata: {
            originalName: filename,
            mimeType: mimeType,
            migrated: true,
            migrationDate: new Date()
          }
        });

        // Escribir archivo a GridFS
        uploadStream.end(fileBuffer);

        // Esperar a que termine la escritura
        await new Promise((resolve, reject) => {
          uploadStream.on('finish', resolve);
          uploadStream.on('error', reject);
        });

        // Crear documento en la base de datos
        const media = new Media({
          filename,
          originalName: filename,
          url: `/api/media/file/${filename}`,
          size: stats.size,
          mimeType: mimeType,
          alt: '',
          caption: '',
          uploadedBy: '000000000000000000000000', // ID por defecto para archivos migrados
          gridFSId: uploadStream.id,
          isActive: true
        });

        await media.save();

        // Eliminar archivo original
        fs.unlinkSync(filePath);

        console.log(`✅ Migrado: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error migrando ${filename}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`✅ Archivos migrados: ${migratedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📁 Archivos restantes: ${fs.readdirSync(uploadPath).length}`);

    if (migratedCount > 0) {
      console.log('\n🎉 ¡Migración completada exitosamente!');
    }

  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar migración
migrateToGridFS();
