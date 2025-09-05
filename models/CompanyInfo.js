import mongoose from 'mongoose';

const companyInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la empresa es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  
  logo: {
    type: String,
    required: [true, 'El logo es requerido'],
    trim: true
  },
  
  slogan: {
    type: String,
    trim: true,
    maxlength: [200, 'El slogan no puede tener más de 200 caracteres']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres']
  },
  
  foundedYear: {
    type: Number,
    min: [1900, 'El año de fundación debe ser mayor a 1900'],
    max: [new Date().getFullYear(), 'El año de fundación no puede ser mayor al año actual']
  },
  
  headquarters: {
    type: String,
    trim: true,
    maxlength: [200, 'La dirección no puede tener más de 200 caracteres']
  },
  
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
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
    },
    youtube: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice único para asegurar que solo haya una configuración activa
companyInfoSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.model('CompanyInfo', companyInfoSchema);
