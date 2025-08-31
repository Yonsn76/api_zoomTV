import mongoose from 'mongoose';

const programacionSchema = new mongoose.Schema({
  // Campos básicos del programa
  title: {
    type: String,
    required: [true, 'El título del programa es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  
  day: {
    type: String,
    required: [true, 'El día es obligatorio'],
    enum: ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'],
    uppercase: true
  },
  
  startTime: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  
  endTime: {
    type: String,
    required: [true, 'La hora de fin es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  
  // Campos adicionales
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Noticias', 'Música', 'Cine', 'Series', 'Anime', 'Entretenimiento', 'Deportes', 'Documentales', 'Otros'],
    default: 'Otros'
  },
  
  type: {
    type: String,
    enum: ['Programa en vivo', 'Película', 'Serie', 'Música', 'Anime', 'Documental', 'Otros'],
    default: 'Otros'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  imageUrl: {
    type: String,
    trim: true
  },
  
  color: {
    type: String,
    default: '#3B82F6' // Azul por defecto
  },
  
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Metadatos
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden tener más de 1000 caracteres']
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento de las consultas
programacionSchema.index({ day: 1, startTime: 1 });
programacionSchema.index({ category: 1 });
programacionSchema.index({ isActive: 1 });

// Método virtual para calcular la duración
programacionSchema.virtual('duration').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  
  const start = new Date(`2000-01-01 ${this.startTime}`);
  const end = new Date(`2000-01-01 ${this.endTime}`);
  
  // Si el programa termina al día siguiente (después de medianoche)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  return Math.round((end - start) / (1000 * 60)); // Duración en minutos
});

// Método para obtener el formato de tiempo completo
programacionSchema.virtual('timeSlot').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Método para validar que la hora de fin sea después de la hora de inicio
programacionSchema.methods.validateTimeOrder = function() {
  const start = new Date(`2000-01-01 ${this.startTime}`);
  const end = new Date(`2000-01-01 ${this.endTime}`);
  
  // Permitir programas que cruzan la medianoche
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  return end > start;
};

// Middleware pre-save para validar el orden de las horas
programacionSchema.pre('save', function(next) {
  if (!this.validateTimeOrder()) {
    return next(new Error('La hora de fin debe ser después de la hora de inicio'));
  }
  next();
});

// Método estático para obtener programas por día
programacionSchema.statics.getByDay = function(day) {
  return this.find({ day: day.toUpperCase(), isActive: true })
    .sort({ startTime: 1, priority: -1 });
};

// Método estático para obtener toda la programación semanal
programacionSchema.statics.getWeeklySchedule = function() {
  return this.find({ isActive: true })
    .sort({ day: 1, startTime: 1, priority: -1 });
};

const Programacion = mongoose.model('Programacion', programacionSchema);

export default Programacion;
