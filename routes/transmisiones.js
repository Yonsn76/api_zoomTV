import express from 'express';
import Transmision from '../models/Transmision.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todas las transmisiones
// @route   GET /api/transmisiones
// @access  Público
router.get('/', async (req, res) => {
  try {
    const { category, isLive, isActive, page = 1, limit = 10 } = req.query;
    
    // Construir filtros
    const filters = {};
    if (category) filters.category = category;
    if (isLive !== undefined) filters.isLive = isLive === 'true';
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const transmisiones = await Transmision.find(filters)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ isLive: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Transmision.countDocuments(filters);
    
    res.json({
      success: true,
      data: transmisiones,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo transmisiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Obtener transmisiones activas
// @route   GET /api/transmisiones/active
// @access  Público
router.get('/active', async (req, res) => {
  try {
    const transmisiones = await Transmision.getActiveTransmissions()
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: transmisiones
    });
  } catch (error) {
    console.error('Error obteniendo transmisiones activas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Obtener transmisiones en vivo
// @route   GET /api/transmisiones/live
// @access  Público
router.get('/live', async (req, res) => {
  try {
    const transmisiones = await Transmision.getLiveTransmissions()
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: transmisiones
    });
  } catch (error) {
    console.error('Error obteniendo transmisiones en vivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Obtener transmisiones por categoría
// @route   GET /api/transmisiones/category/:category
// @access  Público
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const transmisiones = await Transmision.getByCategory(category)
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: transmisiones
    });
  } catch (error) {
    console.error('Error obteniendo transmisiones por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Obtener una transmisión por ID
// @route   GET /api/transmisiones/:id
// @access  Público
router.get('/:id', async (req, res) => {
  try {
    const transmision = await Transmision.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: transmision
    });
  } catch (error) {
    console.error('Error obteniendo transmisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Crear nueva transmisión
// @route   POST /api/transmisiones
// @access  Privado (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const transmisionData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const transmision = await Transmision.create(transmisionData);
    
    await transmision.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Transmisión creada exitosamente',
      data: transmision
    });
  } catch (error) {
    console.error('Error creando transmisión:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de validación incorrectos',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Actualizar transmisión
// @route   PUT /api/transmisiones/:id
// @access  Privado (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const transmisionData = {
      ...req.body,
      lastModifiedBy: req.user.id
    };
    
    const transmision = await Transmision.findByIdAndUpdate(
      req.params.id,
      transmisionData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('lastModifiedBy', 'name email');
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Transmisión actualizada exitosamente',
      data: transmision
    });
  } catch (error) {
    console.error('Error actualizando transmisión:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de validación incorrectos',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Actualizar estado de transmisión en vivo
// @route   PATCH /api/transmisiones/:id/live-status
// @access  Privado (Admin)
router.patch('/:id/live-status', protect, authorize('admin'), async (req, res) => {
  try {
    const { isLive } = req.body;
    
    const transmision = await Transmision.findByIdAndUpdate(
      req.params.id,
      { 
        isLive,
        lastModifiedBy: req.user.id,
        'stats.lastViewed': isLive ? new Date() : undefined
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('lastModifiedBy', 'name email');
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: `Transmisión ${isLive ? 'activada' : 'desactivada'} exitosamente`,
      data: transmision
    });
  } catch (error) {
    console.error('Error actualizando estado de transmisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Incrementar vistas de transmisión
// @route   PATCH /api/transmisiones/:id/view
// @access  Público
router.patch('/:id/view', async (req, res) => {
  try {
    const transmision = await Transmision.findById(req.params.id);
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }
    
    await transmision.incrementViews();
    
    res.json({
      success: true,
      message: 'Vista registrada exitosamente',
      data: { views: transmision.stats.views }
    });
  } catch (error) {
    console.error('Error incrementando vistas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Eliminar transmisión
// @route   DELETE /api/transmisiones/:id
// @access  Privado (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const transmision = await Transmision.findByIdAndDelete(req.params.id);
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Transmisión eliminada exitosamente',
      data: transmision
    });
  } catch (error) {
    console.error('Error eliminando transmisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

export default router;
