import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Anunciante from '../models/Anunciante.js';
import { protect, authorize, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todos los anunciantes (público)
// @route   GET /api/anunciantes
// @access  Public
router.get('/', [
  query('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Estado inválido'),
  query('category').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Límite debe estar entre 1 y 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const limit = parseInt(req.query.limit) || 20;
    
    // Build query
    const query = {};
    
    // Solo mostrar anunciantes activos para usuarios no autenticados
    if (!req.headers.authorization) {
      query.status = 'active';
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    // Execute query
    const anunciantes = await Anunciante.find(query)
      .sort({ priority: 1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: anunciantes,
      count: anunciantes.length
    });
  } catch (error) {
    console.error('Get anunciantes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener anunciante por ID (público)
// @route   GET /api/anunciantes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const anunciante = await Anunciante.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ],
      status: 'active'
    });

    if (!anunciante) {
      return res.status(404).json({
        success: false,
        message: 'Anunciante no encontrado'
      });
    }

    res.json({
      success: true,
      data: anunciante
    });
  } catch (error) {
    console.error('Get anunciante by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Crear nuevo anunciante
// @route   POST /api/anunciantes
// @access  Private
router.post('/', [
  protect,
  authorize('admin', 'editor'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('El nombre es requerido y debe tener entre 1 y 100 caracteres'),
  body('imageUrl').trim().isURL().withMessage('La URL de la imagen es requerida y debe ser válida'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres'),
  body('isFlyer').optional().isBoolean().withMessage('isFlyer debe ser un valor booleano'),
  body('enableZoom').optional().isBoolean().withMessage('enableZoom debe ser un valor booleano'),
  body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Estado inválido'),
  body('priority').optional().isInt({ min: 0 }).withMessage('La prioridad debe ser un número mayor o igual a 0'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('La categoría no puede tener más de 50 caracteres'),
  body('contactInfo.email').optional().isEmail().withMessage('Email inválido'),
  body('contactInfo.phone').optional().trim(),
  body('contactInfo.website').optional().isURL().withMessage('URL del sitio web inválida'),
  body('contactInfo.address').optional().trim(),
  body('socialMedia.facebook').optional().isURL().withMessage('URL de Facebook inválida'),
  body('socialMedia.instagram').optional().isURL().withMessage('URL de Instagram inválida'),
  body('socialMedia.twitter').optional().isURL().withMessage('URL de Twitter inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const anunciante = await Anunciante.create(req.body);

    res.status(201).json({
      success: true,
      data: anunciante
    });
  } catch (error) {
    console.error('Create anunciante error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Actualizar anunciante
// @route   PUT /api/anunciantes/:id
// @access  Private
router.put('/:id', [
  protect,
  authorize('admin', 'editor'),
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  body('imageUrl').optional().trim().isURL().withMessage('La URL de la imagen debe ser válida'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres'),
  body('isFlyer').optional().isBoolean().withMessage('isFlyer debe ser un valor booleano'),
  body('enableZoom').optional().isBoolean().withMessage('enableZoom debe ser un valor booleano'),
  body('status').optional().isIn(['active', 'inactive', 'pending']).withMessage('Estado inválido'),
  body('priority').optional().isInt({ min: 0 }).withMessage('La prioridad debe ser un número mayor o igual a 0'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('La categoría no puede tener más de 50 caracteres'),
  body('contactInfo.email').optional().isEmail().withMessage('Email inválido'),
  body('contactInfo.phone').optional().trim(),
  body('contactInfo.website').optional().isURL().withMessage('URL del sitio web inválida'),
  body('contactInfo.address').optional().trim(),
  body('socialMedia.facebook').optional().isURL().withMessage('URL de Facebook inválida'),
  body('socialMedia.instagram').optional().isURL().withMessage('URL de Instagram inválida'),
  body('socialMedia.twitter').optional().isURL().withMessage('URL de Twitter inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const anunciante = await Anunciante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!anunciante) {
      return res.status(404).json({
        success: false,
        message: 'Anunciante no encontrado'
      });
    }

    res.json({
      success: true,
      data: anunciante
    });
  } catch (error) {
    console.error('Update anunciante error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Eliminar anunciante
// @route   DELETE /api/anunciantes/:id
// @access  Private
router.delete('/:id', [
  protect,
  authorize('admin')
], async (req, res) => {
  try {
    const anunciante = await Anunciante.findByIdAndDelete(req.params.id);

    if (!anunciante) {
      return res.status(404).json({
        success: false,
        message: 'Anunciante no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Anunciante eliminado correctamente'
    });
  } catch (error) {
    console.error('Delete anunciante error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Cambiar estado del anunciante
// @route   PUT /api/anunciantes/:id/status
// @access  Private
router.put('/:id/status', [
  protect,
  authorize('admin', 'editor'),
  body('status').isIn(['active', 'inactive', 'pending']).withMessage('Estado inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const anunciante = await Anunciante.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!anunciante) {
      return res.status(404).json({
        success: false,
        message: 'Anunciante no encontrado'
      });
    }

    res.json({
      success: true,
      data: anunciante
    });
  } catch (error) {
    console.error('Update anunciante status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Reordenar anunciantes
// @route   PUT /api/anunciantes/reorder
// @access  Private
router.put('/reorder', [
  protect,
  authorize('admin', 'editor'),
  body('anunciantes').isArray().withMessage('Debe ser un array de anunciantes'),
  body('anunciantes.*.id').isMongoId().withMessage('ID de anunciante inválido'),
  body('anunciantes.*.priority').isInt({ min: 0 }).withMessage('Prioridad inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { anunciantes } = req.body;

    // Actualizar prioridades en lote
    const updatePromises = anunciantes.map(({ id, priority }) =>
      Anunciante.findByIdAndUpdate(id, { priority }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Anunciantes reordenados correctamente'
    });
  } catch (error) {
    console.error('Reorder anunciantes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

export default router;


