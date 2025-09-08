import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const insertDataDirectly = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar transmisiones existentes
    await mongoose.connection.db.collection('transmisions').deleteMany({});
    console.log('🧹 Transmisiones existentes eliminadas');

    // Datos de ejemplo
    const transmisionesEjemplo = [
      {
        nombre: 'Noticias 24/7',
        url: 'https://example.com/streams/noticias.m3u8',
        isActive: true,
        isLive: false,
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Deportes en Vivo',
        url: 'https://example.com/streams/deportes.m3u8',
        isActive: true,
        isLive: false,
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Entretenimiento',
        url: 'https://example.com/streams/entretenimiento.m3u8',
        isActive: true,
        isLive: false,
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Música Clásica',
        url: 'https://example.com/streams/musica.m3u8',
        isActive: true,
        isLive: false,
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Documentales',
        url: 'https://example.com/streams/documentales.m3u8',
        isActive: false,
        isLive: false,
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insertar transmisiones directamente en la colección
    const result = await mongoose.connection.db.collection('transmisions').insertMany(transmisionesEjemplo);
    console.log(`✅ ${result.insertedCount} transmisiones insertadas`);

    // Verificar inserción
    const count = await mongoose.connection.db.collection('transmisions').countDocuments();
    console.log('📊 Total transmisiones en la base de datos:', count);

    // Mostrar las transmisiones insertadas
    const transmisiones = await mongoose.connection.db.collection('transmisions').find({}).toArray();
    console.log('\n📺 Transmisiones insertadas:');
    transmisiones.forEach((transmision, index) => {
      console.log(`${index + 1}. ${transmision.nombre}`);
      console.log(`   URL: ${transmision.url}`);
      console.log(`   Activa: ${transmision.isActive ? '✅' : '❌'}`);
      console.log(`   En Vivo: ${transmision.isLive ? '🔴' : '⚫'}`);
      console.log('');
    });

    console.log('🎉 Datos insertados exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

insertDataDirectly();
