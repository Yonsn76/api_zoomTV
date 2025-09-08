import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const testConnection = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Probar inserción simple
    const testDoc = {
      nombre: 'Test Transmisión',
      url: 'https://example.com/test.m3u8',
      isActive: true,
      isLive: false,
      createdBy: new mongoose.Types.ObjectId()
    };

    console.log('📝 Insertando documento de prueba...');
    const result = await mongoose.connection.db.collection('transmisions').insertOne(testDoc);
    console.log('✅ Documento insertado:', result.insertedId);

    // Verificar inserción
    const count = await mongoose.connection.db.collection('transmisions').countDocuments();
    console.log('📊 Total documentos en colección:', count);

    // Limpiar documento de prueba
    await mongoose.connection.db.collection('transmisions').deleteOne({ _id: result.insertedId });
    console.log('🧹 Documento de prueba eliminado');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

testConnection();
