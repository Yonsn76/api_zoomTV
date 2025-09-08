import mongoose from 'mongoose';

const transmisionSchema = new mongoose.Schema({
  // Información básica de la transmisión
  title: {
    type: String,
    required: [true, 'El título de la transmisión es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  
  // URL de la transmisión en vivo
  streamUrl: {
    type: String,
    required: [true, 'La URL del stream es obligatoria'],
    trim: true,
    validate: {
      validator: function(v) {
        // Validar que sea una URL válida
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida (http o https)'
    }
  },
  
  // Tipo de stream
  streamType: {
    type: String,
    enum: ['HLS', 'RTMP', 'WebRTC', 'DASH', 'MP4', 'Otros'],
    default: 'HLS'
  },
  
  // Estado de la transmisión
  isActive: {
    type: Boolean,
    default: true
  },
  
  isLive: {
    type: Boolean,
    default: false
  },
  
  // Configuración del reproductor
  playerConfig: {
    autoplay: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: true
    },
    controls: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: false
    },
    volume: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  },
  
  // Metadatos de la transmisión
  quality: {
    type: String,
    enum: ['SD', 'HD', 'FHD', '4K'],
    default: 'HD'
  },
  
  bitrate: {
    type: Number,
    min: 0
  },
  
  resolution: {
    width: {
      type: Number,
      min: 0
    },
    height: {
      type: Number,
      min: 0
    }
  },
  
  // Información adicional
  category: {
    type: String,
    enum: ['Noticias', 'Deportes', 'Entretenimiento', 'Música', 'Documentales', 'Eventos Especiales', 'Otros'],
    default: 'Noticias'
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  // Imagen de preview o thumbnail
  thumbnailUrl: {
    type: String,
    trim: true
  },
  
  // Configuración de horarios (opcional)
  schedule: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isScheduled: {
      type: Boolean,
      default: false
    }
  },
  
  // Estadísticas
  stats: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    maxConcurrentViewers: {
      type: Number,
      default: 0,
      min: 0
    },
    lastViewed: {
      type: Date
    }
  },
  
  // Configuración de notificaciones
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    platforms: [{
      type: String,
      enum: ['email', 'sms', 'push', 'social']
    }]
  },
  
  // Metadatos del sistema
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden tener más de 1000 caracteres']
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento de las consultas
transmisionSchema.index({ isActive: 1, isLive: 1 });
transmisionSchema.index({ category: 1 });
transmisionSchema.index({ streamType: 1 });
transmisionSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });

// Método virtual para verificar si la transmisión está en vivo
transmisionSchema.virtual('isCurrentlyLive').get(function() {
  if (!this.isActive || !this.isLive) return false;
  
  if (this.schedule.isScheduled) {
    const now = new Date();
    return now >= this.schedule.startDate && now <= this.schedule.endDate;
  }
  
  return this.isLive;
});

// Método virtual para obtener la duración de la transmisión programada
transmisionSchema.virtual('scheduledDuration').get(function() {
  if (!this.schedule.isScheduled || !this.schedule.startDate || !this.schedule.endDate) {
    return null;
  }
  
  return Math.round((this.schedule.endDate - this.schedule.startDate) / (1000 * 60)); // Duración en minutos
});

// Método para validar que la fecha de fin sea después de la fecha de inicio
transmisionSchema.methods.validateSchedule = function() {
  if (!this.schedule.isScheduled) return true;
  
  if (!this.schedule.startDate || !this.schedule.endDate) {
    return false;
  }
  
  return this.schedule.endDate > this.schedule.startDate;
};

// Middleware pre-save para validar el horario
transmisionSchema.pre('save', function(next) {
  if (!this.validateSchedule()) {
    return next(new Error('La fecha de fin debe ser después de la fecha de inicio'));
  }
  next();
});

// Método estático para obtener transmisiones activas
transmisionSchema.statics.getActiveTransmissions = function() {
  return this.find({ isActive: true })
    .sort({ isLive: -1, createdAt: -1 });
};

// Método estático para obtener transmisiones en vivo
transmisionSchema.statics.getLiveTransmissions = function() {
  return this.find({ isActive: true, isLive: true })
    .sort({ createdAt: -1 });
};

// Método estático para obtener transmisiones por categoría
transmisionSchema.statics.getByCategory = function(category) {
  return this.find({ category: category, isActive: true })
    .sort({ isLive: -1, createdAt: -1 });
};

// Método para incrementar las vistas
transmisionSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  this.stats.lastViewed = new Date();
  return this.save();
};

// Método para actualizar el estado de transmisión en vivo
transmisionSchema.methods.updateLiveStatus = function(isLive) {
  this.isLive = isLive;
  if (isLive) {
    this.stats.lastViewed = new Date();
  }
  return this.save();
};

const Transmision = mongoose.model('Transmision', transmisionSchema);

export default Transmision;
