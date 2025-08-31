import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'El slug es requerido'],
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  color: {
    type: String,
    default: '#007bff',
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
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
  timestamps: true
});

// Índices
categoriaSchema.index({ slug: 1 }, { unique: true });
categoriaSchema.index({ active: 1, order: 1 });

// Middleware para actualizar updatedAt
categoriaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método estático para obtener categorías activas ordenadas
categoriaSchema.statics.getActive = function() {
  return this.find({ active: true }).sort({ order: 1 });
};

// Método para generar slug automáticamente
categoriaSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;

