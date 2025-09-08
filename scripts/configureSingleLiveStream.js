const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

// Importar modelos
const Transmision = require('../models/Transmision');

const configureSingleLiveStream = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener todas las transmisiones
    const transmisiones = await Transmision.find({});
    console.log(`📺 Transmisiones encontradas: ${transmisiones.length}`);

    if (transmisiones.length === 0) {
      console.log('❌ No hay transmisiones en la base de datos');
      return;
    }

    // Desactivar todas las transmisiones en vivo
    await Transmision.updateMany({}, { isLive: false });
    console.log('🔴 Todas las transmisiones marcadas como offline');

    // Activar solo la primera transmisión como en vivo
    const primeraTransmision = transmisiones[0];
    await Transmision.findByIdAndUpdate(primeraTransmision._id, { 
      isLive: true,
      isActive: true 
    });
    
    console.log(`✅ Transmisión activada como en vivo: "${primeraTransmision.title}"`);
    console.log(`📡 URL: ${primeraTransmision.streamUrl}`);
    console.log(`📺 Categoría: ${primeraTransmision.category}`);
    console.log(`🎯 Calidad: ${primeraTransmision.quality}`);

    // Mostrar estado final
    const transmisionActiva = await Transmision.findById(primeraTransmision._id);
    console.log('\n📊 Estado final:');
    console.log(`- Título: ${transmisionActiva.title}`);
    console.log(`- Activa: ${transmisionActiva.isActive ? '✅ Sí' : '❌ No'}`);
    console.log(`- En Vivo: ${transmisionActiva.isLive ? '🔴 Sí' : '⚫ No'}`);
    console.log(`- URL: ${transmisionActiva.streamUrl}`);

    console.log('\n🎉 Configuración completada. Solo una transmisión está en vivo.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  configureSingleLiveStream();
}

module.exports = configureSingleLiveStream;
