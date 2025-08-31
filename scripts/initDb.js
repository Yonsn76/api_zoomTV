import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';
import Categoria from '../models/Categoria.js';
import Noticia from '../models/Noticia.js';

// Load environment variables
dotenv.config({ path: './config.env' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await Usuario.findOne({ email: 'admin@zoomtv.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin;
    }

    const adminUser = await Usuario.create({
      username: 'admin',
      email: 'admin@zoomtv.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['create', 'read', 'update', 'delete', 'publish', 'manage_users', 'manage_categories'],
      profile: {
        firstName: 'Administrador',
        lastName: 'Zoom TV',
        bio: 'Administrador principal del sistema'
      }
    });

    console.log('Admin user created successfully');
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

const createCategories = async () => {
  try {
    const categories = [
      {
        name: 'Actualidad',
        slug: 'actualidad',
        description: 'Noticias de actualidad general',
        color: '#007bff',
        icon: 'newspaper',
        order: 1
      },
      {
        name: 'Deportes',
        slug: 'deportes',
        description: 'Noticias deportivas',
        color: '#28a745',
        icon: 'football',
        order: 2
      },
      {
        name: 'Música',
        slug: 'musica',
        description: 'Noticias musicales y eventos',
        color: '#dc3545',
        icon: 'music',
        order: 3
      },
      {
        name: 'Nacionales',
        slug: 'nacionales',
        description: 'Noticias nacionales',
        color: '#ffc107',
        icon: 'flag',
        order: 4
      },
      {
        name: 'Regionales',
        slug: 'regionales',
        description: 'Noticias regionales de Huánuco',
        color: '#6f42c1',
        icon: 'map-marker',
        order: 5
      }
    ];

    for (const category of categories) {
      const existingCategory = await Categoria.findOne({ slug: category.slug });
      if (!existingCategory) {
        await Categoria.create(category);
        console.log(`Category ${category.name} created`);
      } else {
        console.log(`Category ${category.name} already exists`);
      }
    }

    console.log('Categories created successfully');
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  }
};

const createSampleNews = async () => {
  try {
    const sampleNews = [
      {
        id: 'reconstruccion-huanuco',
        title: 'Gobierno anuncia plan de reconstrucción para Huánuco',
        author: 'Redacción HuanucoNews',
        date: '10 de Septiembre, 2023',
        summary: 'Inversión de S/ 120 millones para rehabilitar carreteras y puentes.',
        content: 'El Gobierno Central, en coordinación con el Gobierno Regional de Huánuco, anunció un plan de reconstrucción con una inversión de S/ 120 millones para rehabilitar la infraestructura vial afectada por las últimas lluvias intensas. El proyecto incluye la reparación de 50 km de carreteras y 8 puentes en las provincias más afectadas. Se espera que las obras comiencen en enero de 2024 y tengan una duración de 18 meses.',
        imageUrl: '',
        category: 'actualidad',
        status: 'published',
        featured: true,
        tags: ['gobierno', 'infraestructura', 'huánuco', 'reconstrucción'],
        seoTitle: 'Plan de reconstrucción Huánuco - 120 millones de inversión',
        seoDescription: 'Gobierno anuncia plan de reconstrucción para Huánuco con inversión de S/ 120 millones para rehabilitar carreteras y puentes.',
        seoKeywords: ['reconstrucción', 'huánuco', 'gobierno', 'infraestructura', 'carreteras']
      },
      {
        id: 'festividad-ambo',
        title: 'Preparan festividad del Señor de los Milagros en Ambo',
        author: 'Carlos Mendoza',
        date: '5 de Septiembre, 2023',
        summary: 'Celebración religiosa recupera su esplendor tras dos años de restricciones.',
        content: 'La Hermandad del Señor de los Milagros de Ambo anunció que la tradicional procesión de octubre se realizará con aforo completo este año. Después de dos años de limitaciones debido a la pandemia, los devotos podrán participar sin restricciones en las actividades religiosas. Se espera la visita de más de 10,000 fieles durante los días centrales de la festividad.',
        imageUrl: '',
        category: 'regionales',
        status: 'published',
        featured: false,
        tags: ['religión', 'ambo', 'festividad', 'procesión'],
        seoTitle: 'Festividad Señor de los Milagros Ambo 2023',
        seoDescription: 'Preparan festividad del Señor de los Milagros en Ambo con aforo completo tras dos años de restricciones.',
        seoKeywords: ['festividad', 'ambo', 'señor de los milagros', 'procesión', 'religión']
      },
      {
        id: 'exportacion-aguaymanto',
        title: 'Productores de aguaymanto exportarán 20 toneladas',
        author: 'María López',
        date: '8 de Septiembre, 2023',
        summary: 'Acuerdo comercial beneficiará a 120 agricultores de la región.',
        content: 'La Asociación de Productores de Aguaymanto de Huánuco firmó un contrato de exportación de 20 toneladas de este fruto hacia Países Bajos y Alemania. Este acuerdo representa un incremento del 30% en las exportaciones comparado con el año anterior. Los productores destacaron que este crecimiento se debe a la mejora en la calidad del producto y a las certificaciones internacionales obtenidas.',
        imageUrl: '',
        category: 'regionales',
        status: 'published',
        featured: false,
        tags: ['exportación', 'aguaymanto', 'agricultura', 'comercio'],
        seoTitle: 'Exportación aguaymanto Huánuco - 20 toneladas',
        seoDescription: 'Productores de aguaymanto de Huánuco exportarán 20 toneladas hacia Países Bajos y Alemania.',
        seoKeywords: ['aguaymanto', 'exportación', 'huánuco', 'agricultura', 'comercio']
      }
    ];

    for (const news of sampleNews) {
      const existingNews = await Noticia.findOne({ id: news.id });
      if (!existingNews) {
        await Noticia.create(news);
        console.log(`News ${news.title} created`);
      } else {
        console.log(`News ${news.title} already exists`);
      }
    }

    console.log('Sample news created successfully');
  } catch (error) {
    console.error('Error creating sample news:', error);
    throw error;
  }
};

const initDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database initialization...');
    
    await createAdminUser();
    await createCategories();
    await createSampleNews();
    
    console.log('Database initialization completed successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Email: admin@zoomtv.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();

