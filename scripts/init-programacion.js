import mongoose from 'mongoose';
import Programacion from '../models/Programacion.js';
import Usuario from '../models/Usuario.js';
import config from '../config/default.js';

// Datos de programación expandidos con variedad aleatoria
const programacionData = [
  // LUNES
  {
    title: 'PUNTUALIZA LA NOTICIA',
    description: 'JÉSSICA LAVADO',
    day: 'LUNES',
    startTime: '06:00',
    endTime: '06:55',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'DESPERTAR DEPORTIVO',
    description: 'Carlos Mendoza',
    day: 'LUNES',
    startTime: '07:00',
    endTime: '08:00',
    category: 'Deportes',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'MÚSICA CLÁSICA MATUTINA',
    description: 'Sinfonías y conciertos',
    day: 'LUNES',
    startTime: '08:00',
    endTime: '09:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'DOCUMENTAL: NATURALEZA SALVAJE',
    description: 'Episodio 3: La selva amazónica',
    day: 'LUNES',
    startTime: '09:00',
    endTime: '10:30',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'TELENOVELA: AMORES CRUZADOS',
    description: 'Capítulo 45',
    day: 'LUNES',
    startTime: '10:30',
    endTime: '11:30',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'NOTICIAS DEL MEDIODÍA',
    description: 'Resumen de la mañana',
    day: 'LUNES',
    startTime: '12:00',
    endTime: '12:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'CINE ZOOM TV',
    description: 'LUNES CLÁSICOS 32',
    day: 'LUNES',
    startTime: '13:00',
    endTime: '14:55',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'TALK SHOW: ENTREVISTAS',
    description: 'Invitado: Dr. María González',
    day: 'LUNES',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'MÚSICA ROCK INTERNACIONAL',
    description: 'Los mejores hits del rock',
    day: 'LUNES',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'SERIE ANIME: NARUTO',
    description: 'Episodio 156: La batalla final',
    day: 'LUNES',
    startTime: '17:00',
    endTime: '17:30',
    category: 'Anime',
    type: 'Anime',
    color: '#8B5CF6'
  },
  {
    title: 'NOTICIAS DE LA TARDE',
    description: 'Actualización vespertina',
    day: 'LUNES',
    startTime: '18:00',
    endTime: '18:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'MÚSICA LATINOAMERICANA',
    description: '',
    day: 'LUNES',
    startTime: '18:30',
    endTime: '19:30',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'HCO. 60 MIN',
    description: 'Mariluz Alegría',
    day: 'LUNES',
    startTime: '19:30',
    endTime: '20:30',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'PARÉNTESIS',
    description: 'José Aguirre',
    day: 'LUNES',
    startTime: '20:30',
    endTime: '21:30',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'THE BOYS T2 - 4',
    description: '',
    day: 'LUNES',
    startTime: '21:30',
    endTime: '22:30',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'PELÍCULA NOCTURNA',
    description: 'Thriller: El último suspiro',
    day: 'LUNES',
    startTime: '22:30',
    endTime: '00:30',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },

  // MARTES
  {
    title: 'DESPERTAR CON MÚSICA',
    description: 'Los mejores hits del momento',
    day: 'MARTES',
    startTime: '06:00',
    endTime: '07:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'NOTICIAS MATUTINAS',
    description: 'Resumen de la noche',
    day: 'MARTES',
    startTime: '07:00',
    endTime: '07:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA INFANTIL',
    description: 'Dibujos animados educativos',
    day: 'MARTES',
    startTime: '08:00',
    endTime: '09:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'DOCUMENTAL: HISTORIA UNIVERSAL',
    description: 'La Segunda Guerra Mundial',
    day: 'MARTES',
    startTime: '09:00',
    endTime: '10:30',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'SERIE DRAMÁTICA',
    description: 'Breaking Bad - Temporada 3',
    day: 'MARTES',
    startTime: '10:30',
    endTime: '11:30',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'CINE ZOOM TV',
    description: 'MARTES CIENCIA FX 24 / ACCIÓN 23',
    day: 'MARTES',
    startTime: '13:00',
    endTime: '14:55',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE COCINA',
    description: 'Recetas fáciles y rápidas',
    day: 'MARTES',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'MÚSICA JAZZ',
    description: 'Los clásicos del jazz',
    day: 'MARTES',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'ANIME: DRAGON BALL Z',
    description: 'Episodio 89: La transformación',
    day: 'MARTES',
    startTime: '17:00',
    endTime: '17:30',
    category: 'Anime',
    type: 'Anime',
    color: '#8B5CF6'
  },
  {
    title: 'NOTICIAS DE DEPORTES',
    description: 'Resumen deportivo',
    day: 'MARTES',
    startTime: '18:00',
    endTime: '18:30',
    category: 'Deportes',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'TALK SHOW NOCTURNO',
    description: 'Conversaciones profundas',
    day: 'MARTES',
    startTime: '20:00',
    endTime: '21:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'PELÍCULA DE ACCIÓN',
    description: 'Misión Imposible: Fallout',
    day: 'MARTES',
    startTime: '21:00',
    endTime: '23:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },

  // MIÉRCOLES
  {
    title: 'MÚSICA CLÁSICA',
    description: 'Sinfonías de Beethoven',
    day: 'MIÉRCOLES',
    startTime: '06:00',
    endTime: '07:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'NOTICIAS INTERNACIONALES',
    description: 'Resumen mundial',
    day: 'MIÉRCOLES',
    startTime: '07:00',
    endTime: '07:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA DE SALUD',
    description: 'Consejos médicos',
    day: 'MIÉRCOLES',
    startTime: '08:00',
    endTime: '09:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'DOCUMENTAL: TECNOLOGÍA',
    description: 'El futuro de la IA',
    day: 'MIÉRCOLES',
    startTime: '09:00',
    endTime: '10:30',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'SERIE COMEDIA',
    description: 'Friends - Temporada 5',
    day: 'MIÉRCOLES',
    startTime: '10:30',
    endTime: '11:30',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'CINE ZOOM TV',
    description: 'MIÉRCOLES ANIMADO 54',
    day: 'MIÉRCOLES',
    startTime: '13:00',
    endTime: '14:55',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE VIAJES',
    description: 'Destinos exóticos',
    day: 'MIÉRCOLES',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'MÚSICA POP',
    description: 'Los éxitos del momento',
    day: 'MIÉRCOLES',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'ANIME: ONE PIECE',
    description: 'Episodio 234: La batalla naval',
    day: 'MIÉRCOLES',
    startTime: '17:00',
    endTime: '17:30',
    category: 'Anime',
    type: 'Anime',
    color: '#8B5CF6'
  },
  {
    title: 'NOTICIAS LOCALES',
    description: 'Información regional',
    day: 'MIÉRCOLES',
    startTime: '18:00',
    endTime: '18:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA DE MISTERIOS',
    description: 'Casos sin resolver',
    day: 'MIÉRCOLES',
    startTime: '20:00',
    endTime: '21:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'PELÍCULA DE TERROR',
    description: 'El exorcista',
    day: 'MIÉRCOLES',
    startTime: '21:00',
    endTime: '23:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },

  // JUEVES
  {
    title: 'MÚSICA COUNTRY',
    description: 'Los mejores del country',
    day: 'JUEVES',
    startTime: '06:00',
    endTime: '07:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'NOTICIAS ECONÓMICAS',
    description: 'Mercados y finanzas',
    day: 'JUEVES',
    startTime: '07:00',
    endTime: '07:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA DE TECNOLOGÍA',
    description: 'Últimas innovaciones',
    day: 'JUEVES',
    startTime: '08:00',
    endTime: '09:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'DOCUMENTAL: ARTE',
    description: 'Los grandes maestros',
    day: 'JUEVES',
    startTime: '09:00',
    endTime: '10:30',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'SERIE POLICIAL',
    description: 'CSI: Miami',
    day: 'JUEVES',
    startTime: '10:30',
    endTime: '11:30',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'CINE ZOOM TV',
    description: 'JUEVES DE DRAMA 42',
    day: 'JUEVES',
    startTime: '13:00',
    endTime: '14:55',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE MODA',
    description: 'Tendencias actuales',
    day: 'JUEVES',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'MÚSICA ELECTRÓNICA',
    description: 'Los mejores DJs',
    day: 'JUEVES',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'ANIME: ATTACK ON TITAN',
    description: 'Episodio 67: La verdad',
    day: 'JUEVES',
    startTime: '17:00',
    endTime: '17:30',
    category: 'Anime',
    type: 'Anime',
    color: '#8B5CF6'
  },
  {
    title: 'NOTICIAS CULTURALES',
    description: 'Arte y espectáculos',
    day: 'JUEVES',
    startTime: '18:00',
    endTime: '18:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA DE CINE',
    description: 'Críticas y estrenos',
    day: 'JUEVES',
    startTime: '20:00',
    endTime: '21:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'PELÍCULA DRAMÁTICA',
    description: 'El Padrino',
    day: 'JUEVES',
    startTime: '21:00',
    endTime: '23:30',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },

  // VIERNES
  {
    title: 'MÚSICA REGGAETON',
    description: 'Los hits del reggaeton',
    day: 'VIERNES',
    startTime: '06:00',
    endTime: '07:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'NOTICIAS POLÍTICAS',
    description: 'Análisis político',
    day: 'VIERNES',
    startTime: '07:00',
    endTime: '07:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA DE HUMOR',
    description: 'Stand up comedy',
    day: 'VIERNES',
    startTime: '08:00',
    endTime: '09:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'DOCUMENTAL: CIENCIA',
    description: 'El universo en expansión',
    day: 'VIERNES',
    startTime: '09:00',
    endTime: '10:30',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'SERIE DE ACCIÓN',
    description: '24 Horas',
    day: 'VIERNES',
    startTime: '10:30',
    endTime: '11:30',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'CINE ZOOM TV',
    description: 'VIERNES TERROR 40',
    day: 'VIERNES',
    startTime: '13:00',
    endTime: '14:55',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE DEPORTES',
    description: 'Resumen deportivo',
    day: 'VIERNES',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Deportes',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'MÚSICA BLUES',
    description: 'Los clásicos del blues',
    day: 'VIERNES',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'ANIME: DEATH NOTE',
    description: 'Episodio 23: La estrategia',
    day: 'VIERNES',
    startTime: '17:00',
    endTime: '17:30',
    category: 'Anime',
    type: 'Anime',
    color: '#8B5CF6'
  },
  {
    title: 'NOTICIAS DE ESPECTÁCULOS',
    description: 'Famosos y celebridades',
    day: 'VIERNES',
    startTime: '18:00',
    endTime: '18:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'PROGRAMA DE MÚSICA',
    description: 'Entrevistas a artistas',
    day: 'VIERNES',
    startTime: '20:00',
    endTime: '21:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'PELÍCULA DE TERROR',
    description: 'El silencio de los corderos',
    day: 'VIERNES',
    startTime: '21:00',
    endTime: '23:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA NOCTURNO',
    description: 'Conversaciones profundas',
    day: 'VIERNES',
    startTime: '23:00',
    endTime: '00:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },

  // SÁBADO
  {
    title: 'MÚSICA LATINOAMERICANA',
    description: '',
    day: 'SÁBADO',
    startTime: '06:00',
    endTime: '07:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'PROGRAMA INFANTIL MATUTINO',
    description: 'Dibujos animados',
    day: 'SÁBADO',
    startTime: '07:00',
    endTime: '08:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'EXPANSE T5 5 - 6',
    description: '',
    day: 'SÁBADO',
    startTime: '08:00',
    endTime: '09:00',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'EL MANDALORIANO T3: 7 - 8',
    description: '',
    day: 'SÁBADO',
    startTime: '09:30',
    endTime: '10:00',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE COCINA',
    description: 'Recetas gourmet',
    day: 'SÁBADO',
    startTime: '10:00',
    endTime: '11:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'NOTICIAS DEL FIN DE SEMANA',
    description: 'Resumen semanal',
    day: 'SÁBADO',
    startTime: '11:00',
    endTime: '11:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'MARATON DEMON SLAYER T1: 1 - 6',
    description: '',
    day: 'SÁBADO',
    startTime: '13:00',
    endTime: '16:00',
    category: 'Anime',
    type: 'Anime',
    color: '#8B5CF6'
  },
  {
    title: 'PROGRAMA DE VIAJES',
    description: 'Destinos paradisíacos',
    day: 'SÁBADO',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'MÚSICA ROCK CLÁSICO',
    description: 'Los grandes del rock',
    day: 'SÁBADO',
    startTime: '17:00',
    endTime: '18:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'PELÍCULA FAMILIAR',
    description: 'Toy Story 4',
    day: 'SÁBADO',
    startTime: '18:00',
    endTime: '20:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'BAILABLES',
    description: '',
    day: 'SÁBADO',
    startTime: '20:00',
    endTime: '22:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'PROGRAMA DE MISTERIOS',
    description: 'Casos paranormales',
    day: 'SÁBADO',
    startTime: '22:00',
    endTime: '23:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'PELÍCULA NOCTURNA',
    description: 'Thriller psicológico',
    day: 'SÁBADO',
    startTime: '23:00',
    endTime: '01:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },

  // DOMINGO
  {
    title: 'ROCK',
    description: '',
    day: 'DOMINGO',
    startTime: '06:00',
    endTime: '07:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'PROGRAMA RELIGIOSO',
    description: 'Misa dominical',
    day: 'DOMINGO',
    startTime: '07:00',
    endTime: '08:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  },
  {
    title: 'EL PLANETA DE LOS SIMIOS 2 - 3',
    description: '',
    day: 'DOMINGO',
    startTime: '08:00',
    endTime: '10:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'DOMINGO ROCK',
    description: '',
    day: 'DOMINGO',
    startTime: '10:00',
    endTime: '11:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'PROGRAMA DE NATURALEZA',
    description: 'Vida salvaje',
    day: 'DOMINGO',
    startTime: '11:00',
    endTime: '12:00',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'NOTICIAS DOMINICALES',
    description: 'Resumen de la semana',
    day: 'DOMINGO',
    startTime: '12:00',
    endTime: '12:30',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  },
  {
    title: 'EL PLANETA DE LOS SIMIOS 2 - 3',
    description: '',
    day: 'DOMINGO',
    startTime: '13:00',
    endTime: '15:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE HISTORIA',
    description: 'Civilizaciones antiguas',
    day: 'DOMINGO',
    startTime: '15:00',
    endTime: '16:00',
    category: 'Documentales',
    type: 'Documental',
    color: '#059669'
  },
  {
    title: 'DOMINGO ROCK',
    description: '',
    day: 'DOMINGO',
    startTime: '16:00',
    endTime: '17:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'SERIE DRAMÁTICA',
    description: 'Game of Thrones',
    day: 'DOMINGO',
    startTime: '17:00',
    endTime: '18:00',
    category: 'Series',
    type: 'Serie',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE COCINA',
    description: 'Recetas tradicionales',
    day: 'DOMINGO',
    startTime: '18:00',
    endTime: '19:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#EF4444'
  },
  {
    title: 'EL PLANETA DE LOS SIMIOS 2 - 3',
    description: '',
    day: 'DOMINGO',
    startTime: '20:00',
    endTime: '22:00',
    category: 'Cine',
    type: 'Película',
    color: '#F59E0B'
  },
  {
    title: 'PROGRAMA DE MÚSICA CLÁSICA',
    description: 'Conciertos en vivo',
    day: 'DOMINGO',
    startTime: '22:00',
    endTime: '23:00',
    category: 'Música',
    type: 'Música',
    color: '#10B981'
  },
  {
    title: 'PROGRAMA DE REFLEXIÓN',
    description: 'Momentos de paz',
    day: 'DOMINGO',
    startTime: '23:00',
    endTime: '00:00',
    category: 'Entretenimiento',
    type: 'Programa en vivo',
    color: '#8B5CF6'
  }
];

async function initProgramacion() {
  try {
    console.log('🚀 Iniciando script de programación...');
    
    // Conectar a MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Programacion.deleteMany({});
    console.log('🗑️ Datos de programación existentes eliminados');

    // Obtener un usuario admin para asignar como creador
    const adminUser = await Usuario.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ No se encontró un usuario admin');
      process.exit(1);
    }

    // Crear los programas con el usuario admin como creador
    const programas = programacionData.map(program => ({
      ...program,
      createdBy: adminUser._id,
      isActive: true,
      priority: 0
    }));

    await Programacion.insertMany(programas);
    console.log(`✅ ${programas.length} programas creados exitosamente`);

    // Mostrar estadísticas
    const stats = await Programacion.aggregate([
      {
        $group: {
          _id: '$day',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log('\n📊 Estadísticas por día:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} programas`);
    });

    // Mostrar estadísticas por categoría
    const categoryStats = await Programacion.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n📊 Estadísticas por categoría:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} programas`);
    });

    console.log('\n🎉 Inicialización de programación completada');
    console.log(`📺 Total de programas: ${programas.length}`);
    console.log('🎬 Variedad de contenido: Noticias, Música, Cine, Series, Anime, Documentales, Deportes, Entretenimiento');
    
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

// Ejecutar el script
initProgramacion();
