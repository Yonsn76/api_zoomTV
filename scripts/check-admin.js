import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import config from '../config/default.js';

// Load environment variables
dotenv.config({ path: './config.env' });

// Import Usuario model
import Usuario from '../models/Usuario.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Check and create admin user
const checkAndCreateAdmin = async () => {
  try {
    // Check if admin user exists
    const existingAdmin = await Usuario.findOne({ email: 'admin@zoomtv.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user found:');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`🔐 Role: ${existingAdmin.role}`);
      console.log(`✅ Active: ${existingAdmin.active}`);
      
      // Test password
      const isPasswordValid = await existingAdmin.comparePassword('admin123');
      console.log(`🔑 Password test: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (!isPasswordValid) {
        console.log('🔄 Updating password...');
        existingAdmin.password = 'admin123';
        await existingAdmin.save();
        console.log('✅ Password updated successfully');
      }
      
      return;
    }

    console.log('❌ Admin user not found. Creating new admin user...');

    // Create admin user
    const adminUser = await Usuario.create({
      username: 'admin',
      email: 'admin@zoomtv.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['create', 'read', 'update', 'delete', 'publish', 'manage_users', 'manage_categories'],
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
    console.error('❌ Error:', error.message);
    
    // If there's a duplicate key error, try to find and update the user
    if (error.code === 11000) {
      console.log('🔄 Duplicate user found, updating...');
      try {
        const user = await Usuario.findOne({ email: 'admin@zoomtv.com' });
        if (user) {
          user.password = 'admin123';
          user.role = 'admin';
          user.permissions = ['create', 'read', 'update', 'delete', 'publish', 'manage_users', 'manage_categories'];
          user.active = true;
          await user.save();
          console.log('✅ User updated successfully');
        }
      } catch (updateError) {
        console.error('❌ Error updating user:', updateError.message);
      }
    }
  }
};

// List all users
const listUsers = async () => {
  try {
    const users = await Usuario.find({}).select('-password');
    console.log('\n📋 All users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username}) - Role: ${user.role} - Active: ${user.active}`);
    });
  } catch (error) {
    console.error('Error listing users:', error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await checkAndCreateAdmin();
  await listUsers();
  process.exit(0);
};

main().catch(console.error);
