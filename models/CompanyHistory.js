import mongoose from 'mongoose';

const companyHistorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true
  },
  
  image: {
    type: String,
    trim: true
  },
  
  milestones: [{
    year: {
      type: Number,
      required: true,
      min: [1900, 'El año debe ser mayor a 1900'],
      max: [new Date().getFullYear(), 'El año no puede ser mayor al año actual']
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'El título del hito no puede tener más de 100 caracteres']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, 'La descripción del hito no puede tener más de 300 caracteres']
    },
    image: {
      type: String,
      trim: true
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice único para asegurar que solo haya una historia activa
companyHistorySchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

// Método estático para obtener la historia activa
companyHistorySchema.statics.getActive = function() {
  return this.findOne({ isActive: true });
};

export default mongoose.model('CompanyHistory', companyHistorySchema);
