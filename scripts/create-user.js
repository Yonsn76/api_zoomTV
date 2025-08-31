import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config({ path: './config.env' });

// Import Usuario model
import Usuario from '../models/Usuario.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Create user function
const createUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await Usuario.findOne({ 
      $or: [{ email: userData.email }, { username: userData.username }] 
    });
    
    if (existingUser) {
      console.log(`❌ User already exists with email: ${userData.email} or username: ${userData.username}`);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const newUser = await Usuario.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      permissions: userData.permissions || [],
      profile: userData.profile || {},
      active: userData.active !== undefined ? userData.active : true
    });

    console.log('✅ User created successfully!');
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔑 Password: ${userData.password}`);
    console.log(`👤 Username: ${newUser.username}`);
    console.log(`🔐 Role: ${newUser.role}`);
    console.log(`📋 Permissions: ${newUser.permissions.join(', ')}`);
    console.log(`🆔 User ID: ${newUser._id}`);

    return newUser;

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    throw error;
  }
};

// Predefined users
const predefinedUsers = [
  {
    username: 'admin',
    email: 'admin@zoomtv.com',
    password: 'admin123',
    role: 'admin',
    permissions: ['create', 'read', 'update', 'delete', 'publish', 'manage_users', 'manage_categories'],
    profile: {
      firstName: 'Admin',
      lastName: 'Zoom TV',
      bio: 'Administrador principal del sistema'
    },
    active: true
  },
  {
    username: 'editor',
    email: 'editor@zoomtv.com',
    password: 'editor123',
    role: 'editor',
    permissions: ['create', 'read', 'update', 'publish'],
    profile: {
      firstName: 'Editor',
      lastName: 'Zoom TV',
      bio: 'Editor de contenido'
    },
    active: true
  },
  {
    username: 'author',
    email: 'author@zoomtv.com',
    password: 'author123',
    role: 'author',
    permissions: ['create', 'read', 'update'],
    profile: {
      firstName: 'Author',
      lastName: 'Zoom TV',
      bio: 'Autor de contenido'
    },
    active: true
  },
  {
    username: 'testuser',
    email: 'test@zoomtv.com',
    password: 'test123',
    role: 'author',
    permissions: ['create', 'read'],
    profile: {
      firstName: 'Test',
      lastName: 'User',
      bio: 'Usuario de prueba'
    },
    active: true
  }
];

// Main function
const main = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting user creation...\n');
    
    // Create all predefined users
    for (const userData of predefinedUsers) {
      console.log(`📝 Creating user: ${userData.username} (${userData.email})`);
      await createUser(userData);
      console.log(''); // Empty line for better readability
    }
    
    console.log('✅ All users processed!');
    console.log('\n📋 Summary of created users:');
    console.log('1. admin@zoomtv.com (admin) - admin123');
    console.log('2. editor@zoomtv.com (editor) - editor123');
    console.log('3. author@zoomtv.com (author) - author123');
    console.log('4. test@zoomtv.com (testuser) - test123');
    
  } catch (error) {
    console.error('❌ Error in main function:', error.message);
  } finally {
    process.exit(0);
  }
};

// Run the script
main().catch(console.error);
