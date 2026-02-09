const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

// Create initial admin
const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin
    const admin = new Admin({
      email: 'admin@gmail.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.log('Error:', error);
    process.exit(1);
  }
};

createAdmin();