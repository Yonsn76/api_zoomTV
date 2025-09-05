import mongoose from 'mongoose';

const anuncianteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  
  imageUrl: {
    type: String,
    required: [true, 'La imagen es requerida'],
    trim: true
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  
  isFlyer: {
    type: Boolean,
    default: false
  },
  
  enableZoom: {
    type: Boolean,
    default: true
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'La categoría no puede tener más de 50 caracteres']
  },
  
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
anuncianteSchema.index({ status: 1, priority: 1 });
anuncianteSchema.index({ category: 1 });

export default mongoose.model('Anunciante', anuncianteSchema);


