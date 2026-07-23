const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow client interactions across ports

// Database Hook
const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_asst';
mongoose.connect(dbUri)
  .then(async () => {
    console.log('Database connection live.');

    // Auto-seed default Administrator if not exists
    try {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('AdminPass2026!', salt);
        await User.create({
          regNumber: 'ADMIN/2026/001',
          fullName: 'System Administrator',
          email: 'admin@student-asst.com',
          password: hashedPassword,
          level: '400',
          role: 'admin'
        });
        console.log('Default administrator account (ADMIN/2026/001) created successfully.');
      }
    } catch (seedErr) {
      console.error('Error seeding default administrator:', seedErr);
    }
  })
  .catch(err => console.error('Database configuration missing:', err));

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Admin user control panel routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend portal operating on port ${PORT}`));