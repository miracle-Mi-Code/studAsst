const mongoose = require('mongoose'); 

const UserSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  level: { type: String, enum: ['100', '200', '300', '400'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);