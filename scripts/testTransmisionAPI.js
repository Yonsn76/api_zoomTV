// Script de prueba para el endpoint de transmisiones
import mongoose from 'mongoose';
import Transmision from './models/Transmision.js';
import config from './config/default.js';

const testTransmisionAPI = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Crear una transmisión de prueba
    const transmisionTest = {
      title: 'Transmisión en Vivo - Zoom TV Canal 10',
      description: 'Transmisión principal del canal en vivo las 24 horas',
      streamUrl: 'https://sae12.playlist.live-video.net/v1/playlist/CqIGJyM_GIMjlc_nAqzEZuokbV9EZ6USN3gpD1oYFGotbcDdicD6RkzIbXMYsSXvRvCbuU43KDdi-x19E1LHKeIzzB14NHSPySGcFLVeR4uMi_uRGo1xkpq7F3ap3F3OuxG7-L0qMuHRx6_J3Phb59747AOjHsT14ZmBF7hWi1UGmDnV4Ndi_LmNJbv2rycGG72G49CxDZ6bCPEaKy7PGIdbbcvxzQP0l_xKIsRCVnSD-Y5_QUIAMIULT5nzP_xixu0Z6FhC44FTSCb-zlfXfV-nQHyItxH79Iw3LPANDOzhedQe4ftsvRmJZr2jzDU4uIesM2MX5VEeP2wo3STZGThJkTk5cPpg4SBik0xsdOFKv70X6mzUM1d6Fl0tAdxtsrepE3bViNUPjq_BZrHK4H1F0EivFq3hD8YP8AMgth5L2RlgmL3XFMWm88dfcVgqanPmMdJ7uUjG3N6O2CI7-mGtcVO7yCH6eDcyiWKEWNGUWo3FMW9h1v8o4ODJjGfzPkFIQW0YuXCvtvfTqVYzz6Mr7_TwFrFn0ZLGHuTzfV0WbkuN-uM3UL1sa1Jfh_3qR0YSY-wjGcTJibklUFbq44iEVoEsUfOaUNLAkVykqluo-GLZYRjbj1Y8XrGRlYk8vTbv2GWm9G1Avti9lAmelHokMP__ibPHxuIGW_lRn-meNdvNGbTpePkFrO8sWLy1zvFhxgD-qVREP6mwcZGAYjgbR9Eec_MDz_UQnxjzJPFpOXg_p8Amo3SjfG3zbHDqH7gqZoxUXenDcjQKnlQsso8ttYth0aJju7LE7n2Yk4OpVjuRMLVZ3ZbXjhGPnGBnX-ouuZRHEAXSs3tDWdbUJHsHIUqKnet6Ep0ccWEIuxOtPxAgD01ftgttP-9Q7UBd2_tpuOMni_2JbBVXDNI4L36z9cR-9yONRopsx2YTpqA8PLuSJ2kTzcCBg7GqT7dc9uK_oveBynbwrFdwAmICI5-xJuz7WXSAHLNbmi0APf8fojWzaZM3KqLhfqf2okqgn4VuF-MAuSFycIJ3VWwTnhcFF0TcdyD2585g49HN6_b73ViHVxoM3EuL6D2wSmlS2D4rIAEqCXVzLWVhc3QtMjCWDQ.m3u8',
      streamType: 'HLS',
      isActive: true,
      isLive: true,
      category: 'Noticias',
      quality: 'HD',
      tags: ['en-vivo', '24-horas', 'noticias'],
      playerConfig: {
        autoplay: false,
        muted: true,
        controls: true,
        loop: false,
        volume: 0.5
      },
      createdBy: new mongoose.Types.ObjectId() // ID ficticio para la prueba
    };

    // Crear la transmisión
    const transmision = await Transmision.create(transmisionTest);
    console.log('✅ Transmisión creada:', transmision.title);

    // Probar métodos estáticos
    const transmisionesActivas = await Transmision.getActiveTransmissions();
    console.log('✅ Transmisiones activas encontradas:', transmisionesActivas.length);

    const transmisionesEnVivo = await Transmision.getLiveTransmissions();
    console.log('✅ Transmisiones en vivo encontradas:', transmisionesEnVivo.length);

    const transmisionesPorCategoria = await Transmision.getByCategory('Noticias');
    console.log('✅ Transmisiones por categoría encontradas:', transmisionesPorCategoria.length);

    // Probar métodos de instancia
    await transmision.incrementViews();
    console.log('✅ Vistas incrementadas:', transmision.stats.views);

    await transmision.updateLiveStatus(false);
    console.log('✅ Estado de transmisión actualizado:', transmision.isLive);

    // Probar virtuals
    console.log('✅ Es transmisión en vivo actualmente:', transmision.isCurrentlyLive);

    // Limpiar datos de prueba
    await Transmision.findByIdAndDelete(transmision._id);
    console.log('✅ Transmisión de prueba eliminada');

    console.log('\n🎉 ¡Todas las pruebas del modelo Transmision pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada');
  }
};

// Ejecutar las pruebas
testTransmisionAPI();
