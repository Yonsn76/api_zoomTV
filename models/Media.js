import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  },
  gridFSId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ gridFSId: 1 });

// Virtual para obtener el tamaño en formato legible
mediaSchema.virtual('sizeFormatted').get(function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual para verificar si es imagen
mediaSchema.virtual('isImage').get(function() {
  return this.mimeType.startsWith('image/');
});

// Método para obtener la URL completa
mediaSchema.methods.getFullUrl = function(baseUrl) {
  return `${baseUrl}${this.url}`;
};

// Método para obtener información básica (sin gridFSId)
mediaSchema.methods.getPublicInfo = function() {
  const { gridFSId, ...publicInfo } = this.toObject();
  return publicInfo;
};

// Método estático para obtener GridFS bucket
mediaSchema.statics.getGridFSBucket = function() {
  return new GridFSBucket(mongoose.connection.db, {
    bucketName: 'media'
  });
};

// Método para obtener stream de lectura del archivo
mediaSchema.methods.getReadStream = function() {
  const bucket = this.constructor.getGridFSBucket();
  return bucket.openDownloadStream(this.gridFSId);
};

// Método estático para crear stream de escritura
mediaSchema.statics.createWriteStream = function(filename, metadata = {}) {
  const bucket = this.getGridFSBucket();
  return bucket.openUploadStream(filename, {
    metadata: metadata
  });
};

// Método estático para eliminar archivo de GridFS
mediaSchema.statics.deleteFromGridFS = function(gridFSId) {
  const bucket = this.getGridFSBucket();
  return bucket.delete(gridFSId);
};

const Media = mongoose.model('Media', mediaSchema);

export default Media;
