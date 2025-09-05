import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompanyInfo from '../models/CompanyInfo.js';
import TeamMember from '../models/TeamMember.js';
import CompanyHistory from '../models/CompanyHistory.js';
import CompanyValues from '../models/CompanyValues.js';
import config from '../config/default.js';

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Datos de ejemplo para la información de la empresa
const companyInfoData = {
  name: "Zoom TV Canal 10",
  logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  slogan: "Información veraz, entretenimiento de calidad",
  description: "Somos un canal de televisión local comprometido con llevar información veraz y entretenimiento de calidad a nuestros televidentes. Desde nuestros humildes comienzos en 2005, hemos crecido para convertirnos en uno de los canales más importantes de la región.",
  foundedYear: 2005,
  headquarters: "Calle Principal 123, Ciudad Central",
  contactInfo: {
    email: "contacto@zoomtvcanal10.com",
    phone: "+1 234 567 890",
    website: "https://zoomtvcanal10.com",
    address: "Calle Principal 123, Ciudad Central, CP 12345"
  },
  socialMedia: {
    facebook: "https://facebook.com/zoomtvcanal10",
    instagram: "https://instagram.com/zoomtvcanal10",
    twitter: "https://twitter.com/zoomtvcanal10",
    youtube: "https://youtube.com/zoomtvcanal10",
    linkedin: "https://linkedin.com/company/zoomtvcanal10"
  },
  isActive: true
};

// Datos de ejemplo para el equipo (4 personas)
const teamMembersData = [
  {
    name: "María González",
    position: "Directora General",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    bio: "Con más de 20 años de experiencia en medios de comunicación, María lidera nuestro equipo con visión estratégica y pasión por la excelencia periodística.",
    department: "Dirección",
    email: "maria.gonzalez@zoomtvcanal10.com",
    phone: "+1 234 567 891",
    socialMedia: {
      linkedin: "https://linkedin.com/in/maria-gonzalez",
      twitter: "https://twitter.com/maria_gonzalez"
    },
    order: 1,
    isActive: true,
    startDate: new Date('2010-03-15'),
    skills: ["Liderazgo", "Estrategia", "Periodismo", "Gestión de equipos"]
  },
  {
    name: "Carlos Mendoza",
    position: "Jefe de Producción",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    bio: "Especialista en producción televisiva y contenidos digitales, Carlos supervisa toda la producción de nuestros programas con creatividad y profesionalismo.",
    department: "Producción",
    email: "carlos.mendoza@zoomtvcanal10.com",
    phone: "+1 234 567 892",
    socialMedia: {
      linkedin: "https://linkedin.com/in/carlos-mendoza",
      instagram: "https://instagram.com/carlos_mendoza_prod"
    },
    order: 2,
    isActive: true,
    startDate: new Date('2012-06-01'),
    skills: ["Producción TV", "Dirección", "Edición", "Tecnología audiovisual"]
  },
  {
    name: "Laura Jiménez",
    position: "Editora en Jefe",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    bio: "Periodista con amplia trayectoria en medios nacionales, Laura asegura que cada noticia cumpla con los más altos estándares de calidad y veracidad.",
    department: "Redacción",
    email: "laura.jimenez@zoomtvcanal10.com",
    phone: "+1 234 567 893",
    socialMedia: {
      linkedin: "https://linkedin.com/in/laura-jimenez",
      twitter: "https://twitter.com/laura_jimenez_ed"
    },
    order: 3,
    isActive: true,
    startDate: new Date('2015-09-10'),
    skills: ["Periodismo", "Edición", "Redacción", "Fact-checking"]
  },
  {
    name: "Roberto Sánchez",
    position: "Director Técnico",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    bio: "Experto en tecnología audiovisual y transmisiones en vivo, Roberto mantiene nuestra infraestructura técnica funcionando perfectamente las 24 horas.",
    department: "Técnica",
    email: "roberto.sanchez@zoomtvcanal10.com",
    phone: "+1 234 567 894",
    socialMedia: {
      linkedin: "https://linkedin.com/in/roberto-sanchez-tech",
      twitter: "https://twitter.com/roberto_tech"
    },
    order: 4,
    isActive: true,
    startDate: new Date('2008-01-20'),
    skills: ["Ingeniería", "Tecnología audiovisual", "Transmisiones", "Mantenimiento"]
  }
];

// Datos de ejemplo para la historia de la empresa
const companyHistoryData = {
  title: "Nuestra Historia",
  content: "Zoom TV Canal 10 nació en 2005 con la misión de llevar información veraz y entretenimiento de calidad a nuestros televidentes. Desde nuestros humildes comienzos en un pequeño estudio local, hemos crecido para convertirnos en uno de los canales más importantes de la región.\n\nNuestro primer programa salió al aire el 15 de marzo de 2005 con un equipo de solo 5 personas. Hoy contamos con más de 50 profesionales dedicados a la producción de contenido de calidad.\n\nA lo largo de los años, hemos enfrentado desafíos y celebrado triunfos, siempre manteniendo nuestro compromiso con la comunidad y la excelencia en la comunicación.",
  image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  milestones: [
    {
      year: 2007,
      title: "Primer premio regional",
      description: "Primer premio regional a la mejor producción periodística",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      year: 2012,
      title: "Expansión digital",
      description: "Expansión a transmisión digital y mejoras tecnológicas",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      year: 2018,
      title: "Plataforma streaming",
      description: "Lanzamiento de nuestra plataforma de streaming online",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      year: 2022,
      title: "Reconocimiento nacional",
      description: "Reconocimiento nacional por cobertura de eventos comunitarios",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ],
  isActive: true
};

// Datos de ejemplo para los valores de la empresa
const companyValuesData = {
  mission: {
    title: "Nuestra Misión",
    content: "Informar, educar y entretener a nuestra audiencia con contenido de alta calidad, manteniendo siempre los más altos estándares periodísticos y éticos.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    commitments: [
      "Proveer información precisa y oportuna",
      "Fomentar el pensamiento crítico en nuestra audiencia",
      "Promover los valores culturales de nuestra región",
      "Ser un medio accesible para toda la comunidad",
      "Mantener independencia editorial y periodística",
      "Innovar constantemente en nuestros formatos y contenidos"
    ]
  },
  vision: {
    title: "Nuestra Visión",
    content: "Ser reconocidos como el canal líder en innovación periodística y producción de contenido multimedia en la región para el año 2025.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    aspirations: [
      "Expandir nuestra cobertura a nivel nacional",
      "Implementar las últimas tecnologías en producción televisiva",
      "Convertirnos en referente de periodismo independiente",
      "Formar alianzas estratégicas con medios internacionales",
      "Desarrollar programas educativos para la comunidad",
      "Ser pioneros en la transición a tecnologías de transmisión 4K"
    ]
  },
  values: [
    {
      name: "Integridad",
      description: "Actuamos con honestidad y transparencia en todo momento, manteniendo la confianza de nuestra audiencia",
      icon: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      order: 1
    },
    {
      name: "Innovación",
      description: "Buscamos constantemente nuevas formas de comunicar y mejorar nuestros contenidos",
      icon: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      order: 2
    },
    {
      name: "Compromiso",
      description: "Con nuestra audiencia y con la verdad, siempre poniendo el interés público primero",
      icon: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      order: 3
    },
    {
      name: "Excelencia",
      description: "Nos esforzamos por la más alta calidad en todo lo que hacemos, desde la producción hasta la transmisión",
      icon: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      order: 4
    }
  ],
  isActive: true
};

// Función para insertar datos
const insertData = async () => {
  try {
    console.log('Iniciando inserción de datos de ejemplo...');

    // Limpiar datos existentes
    await CompanyInfo.deleteMany({});
    await TeamMember.deleteMany({});
    await CompanyHistory.deleteMany({});
    await CompanyValues.deleteMany({});

    console.log('Datos existentes eliminados');

    // Insertar información de la empresa
    const companyInfo = new CompanyInfo(companyInfoData);
    await companyInfo.save();
    console.log('✅ Información de la empresa insertada');

    // Insertar miembros del equipo
    for (const memberData of teamMembersData) {
      const teamMember = new TeamMember(memberData);
      await teamMember.save();
    }
    console.log('✅ 4 miembros del equipo insertados');

    // Insertar historia de la empresa
    const companyHistory = new CompanyHistory(companyHistoryData);
    await companyHistory.save();
    console.log('✅ Historia de la empresa insertada');

    // Insertar valores de la empresa
    const companyValues = new CompanyValues(companyValuesData);
    await companyValues.save();
    console.log('✅ Valores de la empresa insertados');

    console.log('\n🎉 ¡Todos los datos de ejemplo han sido insertados exitosamente!');
    console.log('\nDatos insertados:');
    console.log('- Información de la empresa: Zoom TV Canal 10');
    console.log('- Miembros del equipo: 4 personas');
    console.log('- Historia con 4 hitos importantes');
    console.log('- Misión, visión y 4 valores corporativos');

  } catch (error) {
    console.error('Error insertando datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar script
const runScript = async () => {
  await connectDB();
  await insertData();
};

runScript().catch(console.error);
