import mongoose from 'mongoose';

const noticiaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
  },
  author: {
    type: String,
    required: [true, 'El autor es requerido'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'La fecha es requerida'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'El resumen es requerido'],
    trim: true,
    maxlength: [500, 'El resumen no puede tener más de 500 caracteres']
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['actualidad', 'deportes', 'musica', 'nacionales', 'regionales'],
    default: 'actualidad'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'El título SEO no puede tener más de 60 caracteres']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'La descripción SEO no puede tener más de 160 caracteres']
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
noticiaSchema.index({ category: 1, status: 1 });
noticiaSchema.index({ featured: 1, createdAt: -1 });
noticiaSchema.index({ tags: 1 });
noticiaSchema.index({ title: 'text', content: 'text' });
noticiaSchema.index({ id: 1 }, { unique: true });

// Middleware para actualizar updatedAt
noticiaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para incrementar vistas
noticiaSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para publicar noticia
noticiaSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

// Método para archivar noticia
noticiaSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Método estático para obtener noticias destacadas
noticiaSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    status: 'published', 
    featured: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Método estático para obtener noticias por categoría
noticiaSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    status: 'published', 
    category: category 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Método estático para buscar noticias
noticiaSchema.statics.search = function(query, limit = 10) {
  return this.find({
    $text: { $search: query },
    status: 'published'
  })
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit);
};

const Noticia = mongoose.model('Noticia', noticiaSchema);

export default Noticia;
