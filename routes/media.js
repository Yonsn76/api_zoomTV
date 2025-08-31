import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import Media from '../models/Media.js';
import { GridFSBucket } from 'mongodb';
import config from '../config/default.js';

const router = express.Router();

// Configure multer for file uploads (memory storage for GridFS)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and documents
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen y documentos'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize // 16MB default (GridFS limit)
  },
  fileFilter: fileFilter
});

// @desc    Listar todos los archivos
// @route   GET /api/media
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filters = { isActive: true };
    
    if (search) {
      filters.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      if (type === 'image') {
        filters.mimeType = { $regex: '^image/' };
      } else if (type === 'document') {
        filters.mimeType = { $regex: '^(application|text)/' };
      }
    }

    // Obtener archivos de la base de datos
    const files = await Media.find(filters)
      .populate('uploadedBy', 'username email fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-fileData'); // No incluir los datos del archivo

    // Contar total de archivos
    const total = await Media.countDocuments(filters);

    // Calcular estadísticas
    const stats = await Media.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$size' },
          totalFiles: { $sum: 1 },
          imageCount: {
            $sum: { $cond: [{ $regexMatch: { input: '$mimeType', regex: '^image/' } }, 1, 0] }
          },
          documentCount: {
            $sum: { $cond: [{ $regexMatch: { input: '$mimeType', regex: '^(application|text)/' } }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalSize: 0,
        totalFiles: 0,
        imageCount: 0,
        documentCount: 0
      }
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Subir archivo
// @route   POST /api/media/upload
// @access  Private
router.post('/upload', protect, upload.single('file'), [
  body('alt').optional().trim(),
  body('caption').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo'
      });
    }

    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `file-${uniqueSuffix}${ext}`;

    // Crear stream de escritura para GridFS
    const bucket = Media.getGridFSBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        uploadedBy: req.user.id,
        alt: req.body.alt || '',
        caption: req.body.caption || ''
      }
    });

    // Escribir el archivo a GridFS
    uploadStream.end(req.file.buffer);

    // Esperar a que termine la escritura
    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    // Crear documento en la base de datos
    const media = new Media({
      filename,
      originalName: req.file.originalname,
      url: `/api/media/file/${filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype,
      alt: req.body.alt || '',
      caption: req.body.caption || '',
      uploadedBy: req.user.id,
      gridFSId: uploadStream.id
    });

    await media.save();

    // Retornar información del archivo (sin gridFSId)
    const fileData = media.getPublicInfo();

    res.status(201).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: fileData
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Subir múltiples archivos
// @route   POST /api/media/upload-multiple
// @access  Private
router.post('/upload-multiple', protect, upload.array('files', 10), [
  body('alt').optional().trim(),
  body('caption').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se han subido archivos'
      });
    }

    const filesData = [];

    for (const file of req.files) {
      // Generar nombre único para el archivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `file-${uniqueSuffix}${ext}`;

      // Crear stream de escritura para GridFS
      const bucket = Media.getGridFSBucket();
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          uploadedBy: req.user.id,
          alt: req.body.alt || '',
          caption: req.body.caption || ''
        }
      });

      // Escribir el archivo a GridFS
      uploadStream.end(file.buffer);

      // Esperar a que termine la escritura
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });

      // Crear documento en la base de datos
      const media = new Media({
        filename,
        originalName: file.originalname,
        url: `/api/media/file/${filename}`,
        size: file.size,
        mimeType: file.mimetype,
        alt: req.body.alt || '',
        caption: req.body.caption || '',
        uploadedBy: req.user.id,
        gridFSId: uploadStream.id
      });

      await media.save();
      filesData.push(media.getPublicInfo());
    }

    res.status(201).json({
      success: true,
      message: 'Archivos subidos exitosamente',
      data: filesData
    });
  } catch (error) {
    console.error('Upload multiple files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Eliminar archivo
// @route   DELETE /api/media/:filename
// @access  Private
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;

    // Buscar el archivo en la base de datos
    const media = await Media.findOne({ filename, isActive: true });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar permisos (solo el propietario o admin puede eliminar)
    if (media.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este archivo'
      });
    }

    // Eliminar archivo de GridFS si existe
    if (media.gridFSId) {
      try {
        await Media.deleteFromGridFS(media.gridFSId);
      } catch (gridFSError) {
        console.error('Error eliminando de GridFS:', gridFSError);
        // Continuar con la eliminación del documento aunque falle GridFS
      }
    }

    // Eliminar documento de la base de datos
    await Media.findByIdAndDelete(media._id);

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Servir archivo desde GridFS
// @route   GET /api/media/file/:filename
// @access  Public
router.get('/file/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Buscar el archivo en la base de datos
    const media = await Media.findOne({ filename, isActive: true });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar si tiene gridFSId
    if (!media.gridFSId) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en GridFS'
      });
    }

    // Obtener stream de lectura desde GridFS
    const bucket = Media.getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(media.gridFSId);

    // Configurar headers para el archivo
    res.set({
      'Content-Type': media.mimeType,
      'Content-Length': media.size,
      'Content-Disposition': `inline; filename="${media.originalName}"`,
      'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
      'ETag': media.gridFSId ? media.gridFSId.toString() : media._id.toString() // ETag para cache
    });

    // Pipe el stream directamente a la respuesta
    downloadStream.pipe(res);

    // Manejar errores del stream
    downloadStream.on('error', (error) => {
      console.error('GridFS stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error al servir el archivo'
        });
      }
    });
  } catch (error) {
    console.error('Serve file error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error en el servidor'
      });
    }
  }
});

// @desc    Obtener información detallada del archivo desde GridFS
// @route   GET /api/media/info/:filename
// @access  Public
router.get('/info/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Buscar el archivo en la base de datos
    const media = await Media.findOne({ filename, isActive: true })
      .populate('uploadedBy', 'username email fullName');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Obtener información adicional de GridFS
    const bucket = Media.getGridFSBucket();
    const files = bucket.find({ _id: media.gridFSId }).toArray();
    const gridFSInfo = files.length > 0 ? files[0] : null;

    // Combinar información de la base de datos con GridFS
    const fileData = {
      ...media.getPublicInfo(),
      gridFS: gridFSInfo ? {
        chunkSize: gridFSInfo.chunkSize,
        uploadDate: gridFSInfo.uploadDate,
        metadata: gridFSInfo.metadata
      } : null
    };

    res.json({
      success: true,
      data: fileData
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener información del archivo
// @route   GET /api/media/:filename
// @access  Public
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Buscar el archivo en la base de datos
    const media = await Media.findOne({ filename, isActive: true })
      .populate('uploadedBy', 'username email fullName');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Retornar información del archivo (sin los datos binarios)
    const fileData = media.getPublicInfo();

    res.json({
      success: true,
      data: fileData
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

export default router;




