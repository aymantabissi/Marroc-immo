// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: { type: String },
  country: { type: String },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  
  // Champs pour la réinitialisation du mot de passe
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);