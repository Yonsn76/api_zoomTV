// Script simple para probar las transmisiones insertadas
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transmision from '../models/Transmision.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const testTransmisiones = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Contar transmisiones
    const totalTransmisiones = await Transmision.countDocuments();
    console.log(`📊 Total de transmisiones en la base de datos: ${totalTransmisiones}`);

    // Obtener todas las transmisiones
    const transmisiones = await Transmision.find().populate('createdBy', 'username email');
    
    console.log('\n📺 Transmisiones encontradas:');
    transmisiones.forEach((transmision, index) => {
      console.log(`\n${index + 1}. ${transmision.title}`);
      console.log(`   📡 Categoría: ${transmision.category}`);
      console.log(`   🔴 En Vivo: ${transmision.isLive ? 'Sí' : 'No'}`);
      console.log(`   ✅ Activo: ${transmision.isActive ? 'Sí' : 'No'}`);
      console.log(`   👀 Vistas: ${transmision.stats.views.toLocaleString()}`);
      console.log(`   🎯 Calidad: ${transmision.quality}`);
      console.log(`   👤 Creado por: ${transmision.createdBy?.username || 'N/A'}`);
    });

    // Estadísticas
    const transmisionesActivas = transmisiones.filter(t => t.isActive).length;
    const transmisionesEnVivo = transmisiones.filter(t => t.isLive).length;
    const totalVistas = transmisiones.reduce((sum, t) => sum + t.stats.views, 0);

    console.log('\n📊 Estadísticas:');
    console.log(`   📺 Total: ${totalTransmisiones}`);
    console.log(`   ✅ Activas: ${transmisionesActivas}`);
    console.log(`   🔴 En Vivo: ${transmisionesEnVivo}`);
    console.log(`   👀 Total vistas: ${totalVistas.toLocaleString()}`);

    // Probar filtros
    console.log('\n🔍 Probando filtros:');
    
    const transmisionesActivasFilter = await Transmision.find({ isActive: true });
    console.log(`   Transmisiones activas: ${transmisionesActivasFilter.length}`);

    const transmisionesEnVivoFilter = await Transmision.find({ isLive: true });
    console.log(`   Transmisiones en vivo: ${transmisionesEnVivoFilter.length}`);

    const transmisionesNoticias = await Transmision.find({ category: 'Noticias' });
    console.log(`   Transmisiones de Noticias: ${transmisionesNoticias.length}`);

    console.log('\n✅ Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

testTransmisiones();
