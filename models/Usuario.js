import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede tener más de 30 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'author'],
    default: 'author'
  },
  permissions: [{
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'publish', 'manage_users', 'manage_categories']
  }],
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: [500, 'La biografía no puede tener más de 500 caracteres']
    },
    avatar: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
usuarioSchema.index({ email: 1 }, { unique: true });
usuarioSchema.index({ username: 1 }, { unique: true });
usuarioSchema.index({ role: 1 });
usuarioSchema.index({ active: 1 });

// Middleware para hashear contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para actualizar updatedAt
usuarioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar último login
usuarioSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Método para obtener nombre completo
usuarioSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Método estático para obtener usuarios activos
usuarioSchema.statics.getActive = function() {
  return this.find({ active: true }).select('-password');
};

// Método estático para obtener usuarios por rol
usuarioSchema.statics.getByRole = function(role) {
  return this.find({ role, active: true }).select('-password');
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;

