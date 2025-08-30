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

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await Usuario.findOne({ email: 'admin@zoomtv.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@zoomtv.com');
      console.log('🔑 Password: admin123');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = await Usuario.create({
      username: 'admin',
      email: 'admin@zoomtv.com',
      password: hashedPassword,
      role: 'admin',
      permissions: ['create', 'read', 'update', 'delete', 'publish'],
      profile: {
        firstName: 'Admin',
        lastName: 'Zoom TV',
        bio: 'Administrador del sistema'
      },
      active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@zoomtv.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🔐 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createDefaultAdmin();
  process.exit(0);
};

main().catch(console.error);
