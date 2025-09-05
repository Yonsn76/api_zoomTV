import mongoose from 'mongoose';

const companyValuesSchema = new mongoose.Schema({
  mission: {
    title: {
      type: String,
      required: [true, 'El título de la misión es requerido'],
      trim: true,
      maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    content: {
      type: String,
      required: [true, 'El contenido de la misión es requerido'],
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    commitments: [{
      type: String,
      trim: true,
      maxlength: [200, 'Cada compromiso no puede tener más de 200 caracteres']
    }]
  },
  
  vision: {
    title: {
      type: String,
      required: [true, 'El título de la visión es requerido'],
      trim: true,
      maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    content: {
      type: String,
      required: [true, 'El contenido de la visión es requerido'],
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    aspirations: [{
      type: String,
      trim: true,
      maxlength: [200, 'Cada aspiración no puede tener más de 200 caracteres']
    }]
  },
  
  values: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'El nombre del valor no puede tener más de 50 caracteres']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, 'La descripción del valor no puede tener más de 300 caracteres']
    },
    icon: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice único para asegurar que solo haya una configuración activa
companyValuesSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

// Método estático para obtener los valores activos
companyValuesSchema.statics.getActive = function() {
  return this.findOne({ isActive: true });
};

export default mongoose.model('CompanyValues', companyValuesSchema);
