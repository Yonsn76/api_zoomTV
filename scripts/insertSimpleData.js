import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

// Importar modelos
import Transmision from '../models/Transmision.js';

const insertSimpleData = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar transmisiones existentes
    await Transmision.deleteMany({});
    console.log('🧹 Transmisiones existentes eliminadas');

    // Crear un ObjectId válido para createdBy
    const userId = new mongoose.Types.ObjectId();

    // Datos de ejemplo simplificados
    const transmisionesEjemplo = [
      {
        nombre: 'Noticias 24/7',
        url: 'https://example.com/streams/noticias.m3u8',
        isActive: true,
        isLive: false,
        createdBy: userId
      },
      {
        nombre: 'Deportes en Vivo',
        url: 'https://example.com/streams/deportes.m3u8',
        isActive: true,
        isLive: false,
        createdBy: userId
      },
      {
        nombre: 'Entretenimiento',
        url: 'https://example.com/streams/entretenimiento.m3u8',
        isActive: true,
        isLive: false,
        createdBy: userId
      },
      {
        nombre: 'Música Clásica',
        url: 'https://example.com/streams/musica.m3u8',
        isActive: true,
        isLive: false,
        createdBy: userId
      },
      {
        nombre: 'Documentales',
        url: 'https://example.com/streams/documentales.m3u8',
        isActive: false,
        isLive: false,
        createdBy: userId
      }
    ];

    // Insertar transmisiones
    const transmisionesCreadas = await Transmision.insertMany(transmisionesEjemplo);
    console.log(`✅ ${transmisionesCreadas.length} transmisiones creadas`);

    // Mostrar resumen
    console.log('\n📊 Resumen de transmisiones creadas:');
    transmisionesCreadas.forEach((transmision, index) => {
      console.log(`${index + 1}. ${transmision.nombre}`);
      console.log(`   URL: ${transmision.url}`);
      console.log(`   Activa: ${transmision.isActive ? '✅' : '❌'}`);
      console.log(`   En Vivo: ${transmision.isLive ? '🔴' : '⚫'}`);
      console.log('');
    });

    console.log('🎉 Datos de ejemplo insertados exitosamente');
    console.log('\n💡 Para lanzar una transmisión en vivo, usa el dashboard CMS');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  insertSimpleData();
}

export default insertSimpleData;
