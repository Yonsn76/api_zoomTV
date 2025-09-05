import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  
  position: {
    type: String,
    required: [true, 'El puesto es requerido'],
    trim: true,
    maxlength: [100, 'El puesto no puede tener más de 100 caracteres']
  },
  
  image: {
    type: String,
    required: [true, 'La imagen es requerida'],
    trim: true
  },
  
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'La biografía no puede tener más de 500 caracteres']
  },
  
  department: {
    type: String,
    trim: true,
    maxlength: [50, 'El departamento no puede tener más de 50 caracteres']
  },
  
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
  
  socialMedia: {
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },
  
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  startDate: {
    type: Date
  },
  
  skills: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
teamMemberSchema.index({ isActive: 1, order: 1 });
teamMemberSchema.index({ department: 1 });

// Método estático para obtener miembros activos ordenados
teamMemberSchema.statics.getActiveOrdered = function() {
  return this.find({ isActive: true }).sort({ order: 1, name: 1 });
};

// Método estático para obtener miembros por departamento
teamMemberSchema.statics.getByDepartment = function(department) {
  return this.find({ department, isActive: true }).sort({ order: 1, name: 1 });
};

export default mongoose.model('TeamMember', teamMemberSchema);
