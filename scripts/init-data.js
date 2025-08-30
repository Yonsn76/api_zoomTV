const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Función para hacer login
async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@zoomtv.com',
      password: 'admin123'
    });
    
    if (response.data.success) {
      return response.data.data.token;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    return null;
  }
}

// Función para crear categorías
async function createCategories(token) {
  const categories = [
    {
      name: 'Actualidad',
      description: 'Noticias de actualidad y eventos importantes',
      color: '#3B82F6',
      icon: 'newspaper',
      order: 1
    },
    {
      name: 'Deportes',
      description: 'Noticias deportivas y eventos atléticos',
      color: '#10B981',
      icon: 'sports',
      order: 2
    },
    {
      name: 'Música',
      description: 'Noticias de música y entretenimiento',
      color: '#8B5CF6',
      icon: 'music',
      order: 3
    },
    {
      name: 'Nacionales',
      description: 'Noticias nacionales e información del país',
      color: '#EF4444',
      icon: 'flag',
      order: 4
    },
    {
      name: 'Regionales',
      description: 'Noticias regionales y locales',
      color: '#F59E0B',
      icon: 'map-pin',
      order: 5
    }
  ];

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  for (const category of categories) {
    try {
      const response = await axios.post(`${API_BASE_URL}/categorias`, category, { headers });
      console.log(`✅ Categoría creada: ${category.name}`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Ya existe')) {
        console.log(`⚠️  Categoría ya existe: ${category.name}`);
      } else {
        console.error(`❌ Error creando categoría ${category.name}:`, error.response?.data?.message || error.message);
      }
    }
  }
}

// Función para crear autores
async function createAuthors(token) {
  const authors = [
    {
      name: 'María González',
      email: 'maria@zoomtv.com',
      bio: 'Periodista especializada en tecnología y actualidad',
      avatar: '',
      active: true
    },
    {
      name: 'Carlos Rodríguez',
      email: 'carlos@zoomtv.com',
      bio: 'Reportero deportivo con más de 10 años de experiencia',
      avatar: '',
      active: true
    },
    {
      name: 'Ana Martínez',
      email: 'ana@zoomtv.com',
      bio: 'Especialista en música y entretenimiento',
      avatar: '',
      active: true
    },
    {
      name: 'Luis Pérez',
      email: 'luis@zoomtv.com',
      bio: 'Corresponsal de noticias nacionales',
      avatar: '',
      active: true
    },
    {
      name: 'Carmen López',
      email: 'carmen@zoomtv.com',
      bio: 'Reportera de noticias regionales',
      avatar: '',
      active: true
    }
  ];

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  for (const author of authors) {
    try {
      const response = await axios.post(`${API_BASE_URL}/autores`, author, { headers });
      console.log(`✅ Autor creado: ${author.name}`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Ya existe')) {
        console.log(`⚠️  Autor ya existe: ${author.name}`);
      } else {
        console.error(`❌ Error creando autor ${author.name}:`, error.response?.data?.message || error.message);
      }
    }
  }
}

// Función para crear noticias de ejemplo
async function createSampleNews(token) {
  const news = [
    {
      id: 'noticia-tecnologia-2024',
      title: 'Nueva tecnología revoluciona la industria del entretenimiento',
      author: 'María González',
      date: '2024-01-15',
      summary: 'Una innovadora tecnología está transformando la forma en que consumimos contenido multimedia, ofreciendo experiencias más inmersivas y personalizadas.',
      content: 'La industria del entretenimiento está experimentando una revolución tecnológica sin precedentes. Las nuevas plataformas de streaming están implementando tecnologías de inteligencia artificial y realidad virtual que están cambiando fundamentalmente la forma en que interactuamos con el contenido multimedia.\n\nEsta transformación no solo afecta a los consumidores, sino también a los creadores de contenido, quienes ahora tienen acceso a herramientas más avanzadas para producir material de mayor calidad y más atractivo para las audiencias.\n\nLos expertos predicen que esta tendencia continuará evolucionando, con nuevas tecnologías emergentes que prometen hacer el entretenimiento aún más inmersivo y personalizado.',
      imageUrl: 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Tecnología+Entretenimiento',
      category: 'actualidad',
      status: 'published',
      featured: true,
      tags: ['tecnología', 'entretenimiento', 'innovación'],
      seoTitle: 'Tecnología Revoluciona Entretenimiento 2024',
      seoDescription: 'Descubre cómo las nuevas tecnologías están transformando la industria del entretenimiento y qué cambios podemos esperar en el futuro.',
      seoKeywords: ['tecnología', 'entretenimiento', 'innovación', 'streaming', 'IA']
    },
    {
      id: 'deportes-campeonato-2024',
      title: 'Equipo local gana campeonato regional en emocionante final',
      author: 'Carlos Rodríguez',
      date: '2024-01-14',
      summary: 'El equipo local logra una victoria histórica en el campeonato regional, superando todas las expectativas en una final que mantuvo a los espectadores al borde de sus asientos.',
      content: 'En una noche que quedará grabada en la memoria de todos los aficionados, el equipo local logró una victoria épica en el campeonato regional. El partido, que se extendió hasta el tiempo extra, fue un verdadero espectáculo de habilidad, determinación y espíritu deportivo.\n\nLos jugadores demostraron un nivel de compromiso excepcional, superando las adversidades y manteniendo la calma en los momentos más críticos. El entrenador destacó la importancia del trabajo en equipo y la preparación mental que llevó a esta victoria histórica.\n\nEsta victoria no solo representa un logro deportivo, sino también un momento de unión para toda la comunidad, que se reunió para celebrar este triunfo que ha sido años en la construcción.',
      imageUrl: 'https://via.placeholder.com/800x400/10B981/FFFFFF?text=Campeonato+Deportivo',
      category: 'deportes',
      status: 'published',
      featured: false,
      tags: ['deportes', 'campeonato', 'victoria', 'equipo'],
      seoTitle: 'Equipo Local Gana Campeonato Regional 2024',
      seoDescription: 'El equipo local logra una victoria histórica en el campeonato regional, superando todas las expectativas en una final emocionante.',
      seoKeywords: ['deportes', 'campeonato', 'victoria', 'equipo local', 'regional']
    },
    {
      id: 'musica-album-exitoso-2024',
      title: 'Nuevo álbum de artista local rompe récords de ventas',
      author: 'Ana Martínez',
      date: '2024-01-13',
      summary: 'El nuevo álbum del artista local supera todas las expectativas de ventas, estableciendo nuevos récords en la industria musical regional.',
      content: 'La música local está de celebración tras el lanzamiento del nuevo álbum que ha superado todas las expectativas comerciales. El artista, que comenzó su carrera en pequeños escenarios locales, ha logrado un éxito sin precedentes que ha llamado la atención de la industria musical nacional.\n\nEl álbum, que combina elementos tradicionales con sonidos contemporáneos, ha resonado profundamente con audiencias de todas las edades. Los críticos han elogiado la originalidad de las composiciones y la calidad de la producción musical.\n\nEste éxito no solo beneficia al artista, sino que también pone en el mapa musical a toda la región, demostrando que el talento local puede competir a nivel nacional e internacional.',
      imageUrl: 'https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Álbum+Musical',
      category: 'musica',
      status: 'published',
      featured: true,
      tags: ['música', 'álbum', 'artista local', 'éxito'],
      seoTitle: 'Artista Local Rompe Récords con Nuevo Álbum',
      seoDescription: 'El nuevo álbum del artista local supera todas las expectativas de ventas, estableciendo nuevos récords en la industria musical.',
      seoKeywords: ['música', 'álbum', 'artista local', 'éxito', 'ventas', 'récords']
    }
  ];

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  for (const newsItem of news) {
    try {
      const response = await axios.post(`${API_BASE_URL}/noticias`, newsItem, { headers });
      console.log(`✅ Noticia creada: ${newsItem.title}`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Ya existe')) {
        console.log(`⚠️  Noticia ya existe: ${newsItem.title}`);
      } else {
        console.error(`❌ Error creando noticia ${newsItem.title}:`, error.response?.data?.message || error.message);
      }
    }
  }
}

// Función principal
async function initializeData() {
  console.log('🚀 Iniciando población de datos para Zoom TV CMS...\n');

  // Hacer login
  console.log('🔐 Iniciando sesión...');
  const token = await login();
  
  if (!token) {
    console.error('❌ No se pudo obtener el token de autenticación');
    return;
  }
  
  console.log('✅ Login exitoso\n');

  // Crear categorías
  console.log('📂 Creando categorías...');
  await createCategories(token);
  console.log('');

  // Crear autores
  console.log('👥 Creando autores...');
  await createAuthors(token);
  console.log('');

  // Crear noticias de ejemplo
  console.log('📰 Creando noticias de ejemplo...');
  await createSampleNews(token);
  console.log('');

  console.log('🎉 ¡Población de datos completada!');
  console.log('📊 Ahora puedes acceder al CMS en: http://localhost:5174/');
  console.log('🔑 Credenciales: admin@zoomtv.com / admin123');
}

// Ejecutar el script
initializeData().catch(console.error);
