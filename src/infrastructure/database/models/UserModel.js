// src/infrastructure/database/models/UserModel.js

const {mongoose, model, Types} = require('mongoose');
const bcrypt    = require('bcrypt');

const UserSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash de la contraseña antes de guardar el usuario
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar la contraseña ingresada con la hash almacenada
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model('User', UserSchema);

module.exports = UserModel;
