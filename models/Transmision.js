import mongoose from 'mongoose';

const transmisionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  url: {
    type: String,
    required: [true, 'La URL es obligatoria'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'La URL debe ser válida'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isLive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
transmisionSchema.index({ isActive: 1 });
transmisionSchema.index({ isLive: 1 });
transmisionSchema.index({ createdBy: 1 });

// Middleware para validaciones adicionales
transmisionSchema.pre('save', function(next) {
  // Asegurar que solo una transmisión esté en vivo a la vez
  if (this.isLive && this.isModified('isLive')) {
    this.constructor.updateMany(
      { _id: { $ne: this._id }, isLive: true },
      { isLive: false }
    ).exec();
  }
  next();
});

// Métodos del modelo
transmisionSchema.methods.activateLive = async function() {
  // Desactivar todas las otras transmisiones en vivo
  await this.constructor.updateMany(
    { _id: { $ne: this._id } },
    { isLive: false }
  );
  
  // Activar esta transmisión
  this.isLive = true;
  this.isActive = true;
  return this.save();
};

transmisionSchema.methods.deactivateLive = function() {
  this.isLive = false;
  return this.save();
};

// Métodos estáticos
transmisionSchema.statics.getActiveLive = function() {
  return this.findOne({ isLive: true, isActive: true });
};

transmisionSchema.statics.getAllActive = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Configurar transformación JSON
transmisionSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Transmision = mongoose.model('Transmision', transmisionSchema);

export default Transmision;