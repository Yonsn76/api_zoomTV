import mongoose from 'mongoose';
import Noticia from '../models/Noticia.js';
import config from '../config/default.js';

await mongoose.connect(config.mongodb.uri);
console.log('✅ Conectado a MongoDB');

function generateId() {
  return 'news-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function getRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

const noticias = [
  // ACTUALIDAD
  {
    id: generateId(),
    title: "Nueva tecnología revoluciona la industria automotriz",
    author: "María González",
    date: getRandomDate(),
    summary: "Una innovadora tecnología de baterías promete cambiar el futuro de los vehículos eléctricos",
    content: "La industria automotriz está experimentando una revolución sin precedentes con la introducción de nuevas tecnologías de baterías que prometen autonomías de hasta 800 kilómetros con una sola carga.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    category: "actualidad",
    status: "published",
    featured: true,
    tags: ["tecnología", "automóviles", "sostenibilidad"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Acuerdo histórico entre países para combatir el cambio climático",
    author: "Carlos Rodríguez",
    date: getRandomDate(),
    summary: "Líderes mundiales firman acuerdo sin precedentes para reducir emisiones de carbono",
    content: "En una cumbre histórica celebrada en París, líderes de más de 150 países han firmado un acuerdo sin precedentes para combatir el cambio climático.",
    imageUrl: "https://images.unsplash.com/photo-1569163136541-4a17e53a48ef?w=800",
    category: "actualidad",
    status: "published",
    featured: false,
    tags: ["cambio climático", "medio ambiente", "política internacional"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Avance médico promete cura para enfermedades neurodegenerativas",
    author: "Dra. Ana Martínez",
    date: getRandomDate(),
    summary: "Investigadores descubren nuevo tratamiento que podría revertir el Alzheimer",
    content: "Un equipo internacional de investigadores ha logrado un avance significativo en el tratamiento de enfermedades neurodegenerativas como el Alzheimer.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    category: "actualidad",
    status: "published",
    featured: true,
    tags: ["medicina", "investigación", "Alzheimer", "neurociencia"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Revolución en la educación: IA personaliza el aprendizaje",
    author: "Prof. Luis Fernández",
    date: getRandomDate(),
    summary: "Sistemas de inteligencia artificial transforman la forma de enseñar y aprender",
    content: "La inteligencia artificial está revolucionando el sector educativo con sistemas que personalizan el aprendizaje para cada estudiante.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    category: "actualidad",
    status: "published",
    featured: false,
    tags: ["educación", "inteligencia artificial", "tecnología", "aprendizaje"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Crisis energética global: países buscan alternativas renovables",
    author: "Ing. Patricia López",
    date: getRandomDate(),
    summary: "Escasez de combustibles fósiles impulsa inversión masiva en energías limpias",
    content: "La crisis energética global ha acelerado la transición hacia energías renovables como nunca antes.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    category: "actualidad",
    status: "published",
    featured: true,
    tags: ["energía", "renovables", "crisis energética", "sostenibilidad"],
    views: Math.floor(Math.random() * 1000)
  },

  // DEPORTES
  {
    id: generateId(),
    title: "Equipo local gana campeonato nacional de fútbol",
    author: "Roberto Silva",
    date: getRandomDate(),
    summary: "Victoria histórica en final épica que duró hasta los penales",
    content: "En una final épica que se decidió en los penales, el equipo local ha logrado su primer campeonato nacional de fútbol en 25 años.",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    category: "deportes",
    status: "published",
    featured: true,
    tags: ["fútbol", "campeonato", "victoria", "local"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Nuevo récord mundial en maratón",
    author: "Carmen Vega",
    date: getRandomDate(),
    summary: "Atleta keniano rompe récord mundial en maratón de Berlín",
    content: "El atleta keniano ha establecido un nuevo récord mundial en el maratón de Berlín, completando la distancia de 42.195 kilómetros en 2 horas, 1 minuto y 39 segundos.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    category: "deportes",
    status: "published",
    featured: false,
    tags: ["maratón", "récord mundial", "atletismo", "Kenya"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Tenis: Nueva estrella emerge en torneo internacional",
    author: "Diego Morales",
    date: getRandomDate(),
    summary: "Joven tenista de 19 años sorprende al mundo del tenis",
    content: "Una joven tenista de 19 años ha sorprendido al mundo del tenis al llegar a la final de un torneo internacional de primer nivel.",
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    category: "deportes",
    status: "published",
    featured: true,
    tags: ["tenis", "joven talento", "torneo", "sorpresa"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Baloncesto: Equipo universitario hace historia",
    author: "Laura Jiménez",
    date: getRandomDate(),
    summary: "Universidad local gana campeonato nacional de baloncesto",
    content: "El equipo de baloncesto de la universidad local ha hecho historia al ganar su primer campeonato nacional universitario.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    category: "deportes",
    status: "published",
    featured: false,
    tags: ["baloncesto", "universidad", "campeonato", "historia"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Natación: Récord nacional en estilo libre",
    author: "Miguel Ángel Torres",
    date: getRandomDate(),
    summary: "Nadadora local rompe récord nacional en 100 metros libre",
    content: "Una nadadora local ha roto el récord nacional en los 100 metros estilo libre durante el campeonato nacional de natación.",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
    category: "deportes",
    status: "published",
    featured: true,
    tags: ["natación", "récord nacional", "estilo libre", "logro"],
    views: Math.floor(Math.random() * 1000)
  },

  // MÚSICA
  {
    id: generateId(),
    title: "Nuevo álbum de artista local rompe récords de ventas",
    author: "Sofía Mendoza",
    date: getRandomDate(),
    summary: "Disco debut supera expectativas y se posiciona en top mundial",
    content: "El álbum debut de un artista local ha superado todas las expectativas al vender más de 2 millones de copias en su primera semana de lanzamiento.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    category: "musica",
    status: "published",
    featured: true,
    tags: ["música", "álbum", "récords", "artista local"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Festival de música atrae a 100,000 personas",
    author: "Ricardo Castro",
    date: getRandomDate(),
    summary: "Evento musical más grande del año celebra diversidad cultural",
    content: "El festival de música más grande del año ha atraído a más de 100,000 personas durante tres días de celebración musical.",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    category: "musica",
    status: "published",
    featured: false,
    tags: ["festival", "música", "cultura", "evento"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Banda legendaria anuncia gira de despedida",
    author: "Elena Ruiz",
    date: getRandomDate(),
    summary: "Grupo musical anuncia última gira mundial después de 30 años",
    content: "Una de las bandas más legendarias de la historia de la música ha anunciado su gira de despedida después de 30 años de carrera.",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    category: "musica",
    status: "published",
    featured: true,
    tags: ["banda", "gira", "despedida", "legendaria"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Nuevo género musical emerge en escena local",
    author: "Daniel Herrera",
    date: getRandomDate(),
    summary: "Fusión de ritmos tradicionales y electrónicos crea nuevo sonido",
    content: "Un nuevo género musical ha emergido en la escena local, combinando ritmos tradicionales con elementos electrónicos modernos.",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
    category: "musica",
    status: "published",
    featured: false,
    tags: ["género musical", "nuevo", "fusión", "experimental"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Orquesta sinfónica interpreta música clásica moderna",
    author: "Ana Patricia López",
    date: getRandomDate(),
    summary: "Concierto innovador combina clásicos con composiciones contemporáneas",
    content: "La orquesta sinfónica local ha presentado un concierto innovador que combina obras clásicas con composiciones contemporáneas.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    category: "musica",
    status: "published",
    featured: true,
    tags: ["orquesta", "música clásica", "concierto", "moderno"],
    views: Math.floor(Math.random() * 1000)
  },

  // NACIONALES
  {
    id: generateId(),
    title: "Gobierno anuncia plan de desarrollo económico nacional",
    author: "Dr. Manuel Vargas",
    date: getRandomDate(),
    summary: "Nueva estrategia económica promete crear 500,000 empleos",
    content: "El gobierno nacional ha anunciado un ambicioso plan de desarrollo económico que promete crear más de 500,000 empleos en los próximos tres años.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    category: "nacionales",
    status: "published",
    featured: true,
    tags: ["gobierno", "economía", "empleo", "desarrollo"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Nueva ley de educación transforma sistema nacional",
    author: "Prof. Isabel Morales",
    date: getRandomDate(),
    summary: "Reforma educativa incluye tecnología y habilidades del siglo XXI",
    content: "Una nueva ley de educación ha sido aprobada por el congreso nacional, transformando completamente el sistema educativo del país.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800",
    category: "nacionales",
    status: "published",
    featured: false,
    tags: ["educación", "ley", "reforma", "tecnología"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Campaña nacional de vacunación alcanza meta histórica",
    author: "Dra. Carmen Elena",
    date: getRandomDate(),
    summary: "95% de la población objetivo ha sido vacunada",
    content: "La campaña nacional de vacunación ha alcanzado una meta histórica al vacunar al 95% de la población objetivo.",
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800",
    category: "nacionales",
    status: "published",
    featured: true,
    tags: ["vacunación", "salud", "campaña", "récord"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Inversión extranjera alcanza niveles récord",
    author: "Econ. Roberto Silva",
    date: getRandomDate(),
    summary: "País atrae más de 15 mil millones en inversión extranjera",
    content: "El país ha logrado atraer más de 15 mil millones de dólares en inversión extranjera directa durante el último año.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    category: "nacionales",
    status: "published",
    featured: false,
    tags: ["inversión", "economía", "extranjera", "récord"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Nuevo sistema de transporte público revoluciona movilidad",
    author: "Ing. Carlos Mendoza",
    date: getRandomDate(),
    summary: "Metro eléctrico reduce tiempo de viaje en 60%",
    content: "Un nuevo sistema de transporte público eléctrico ha revolucionado la movilidad en la capital nacional.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    category: "nacionales",
    status: "published",
    featured: true,
    tags: ["transporte", "metro", "eléctrico", "movilidad"],
    views: Math.floor(Math.random() * 1000)
  },

  // REGIONALES
  {
    id: generateId(),
    title: "Festival cultural regional atrae turistas internacionales",
    author: "María Elena Torres",
    date: getRandomDate(),
    summary: "Evento celebra tradiciones locales y genera impacto económico",
    content: "El festival cultural regional más importante del año ha atraído a más de 50,000 turistas internacionales.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    category: "regionales",
    status: "published",
    featured: true,
    tags: ["festival", "cultura", "turismo", "regional"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Nueva universidad regional impulsa desarrollo local",
    author: "Dr. Luis Alberto",
    date: getRandomDate(),
    summary: "Institución educativa crea oportunidades para jóvenes locales",
    content: "Una nueva universidad regional ha comenzado operaciones, ofreciendo oportunidades educativas de calidad para miles de jóvenes de la región.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800",
    category: "regionales",
    status: "published",
    featured: false,
    tags: ["universidad", "educación", "regional", "desarrollo"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Proyecto agrícola regional aumenta producción 40%",
    author: "Ing. Ana Patricia",
    date: getRandomDate(),
    summary: "Iniciativa tecnológica transforma agricultura regional",
    content: "Un proyecto agrícola regional que utiliza tecnología de punta ha logrado aumentar la producción agrícola en un 40% durante el último año.",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    category: "regionales",
    status: "published",
    featured: true,
    tags: ["agricultura", "tecnología", "producción", "regional"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Centro comercial regional genera 2,000 empleos",
    author: "Econ. Roberto Carlos",
    date: getRandomDate(),
    summary: "Nuevo centro comercial impulsa economía local",
    content: "Un nuevo centro comercial regional ha generado más de 2,000 empleos directos e indirectos, impulsando significativamente la economía local.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    category: "regionales",
    status: "published",
    featured: false,
    tags: ["centro comercial", "empleo", "economía", "regional"],
    views: Math.floor(Math.random() * 1000)
  },
  {
    id: generateId(),
    title: "Hospital regional recibe equipamiento de última generación",
    author: "Dr. Carmen Elena",
    date: getRandomDate(),
    summary: "Instalación médica mejora atención a pacientes regionales",
    content: "El hospital regional principal ha recibido equipamiento médico de última generación, mejorando significativamente la atención médica.",
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800",
    category: "regionales",
    status: "published",
    featured: true,
    tags: ["hospital", "equipamiento", "medicina", "regional"],
    views: Math.floor(Math.random() * 1000)
  }
];

// Insertar noticias
let totalInsertadas = 0;

for (const noticia of noticias) {
  try {
    // Verificar si la noticia ya existe
    const noticiaExistente = await Noticia.findOne({ id: noticia.id });
    if (noticiaExistente) {
      console.log(`⚠️  Noticia con ID ${noticia.id} ya existe, saltando...`);
      continue;
    }

    // Crear nueva noticia
    const nuevaNoticia = new Noticia(noticia);
    await nuevaNoticia.save();
    
    console.log(`✅ Insertada: "${noticia.title}" (${noticia.category})`);
    totalInsertadas++;
    
  } catch (error) {
    console.error(`❌ Error al insertar "${noticia.title}":`, error.message);
  }
}

console.log(`\n🎉 Proceso completado!`);
console.log(`📊 Total de noticias insertadas: ${totalInsertadas}`);

// Mostrar estadísticas por categoría
const categorias = ['actualidad', 'deportes', 'musica', 'nacionales', 'regionales'];
for (const categoria of categorias) {
  const count = await Noticia.countDocuments({ category: categoria });
  console.log(`   • ${categoria}: ${count} noticias`);
}

await mongoose.connection.close();
console.log('\n🔌 Conexión a MongoDB cerrada');
