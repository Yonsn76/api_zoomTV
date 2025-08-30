import express from 'express';
import { body, validationResult } from 'express-validator';
import Categoria from '../models/Categoria.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todas las categorías (público)
// @route   GET /api/categorias
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.getActive();

    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    console.error('Get categorias error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener categoría por ID (público)
// @route   GET /api/categorias/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ 
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      active: true
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    console.error('Get categoria error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Crear categoría
// @route   POST /api/categorias
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('name').notEmpty().withMessage('Nombre es requerido'),
  body('description').optional().trim(),
  body('color').optional().trim(),
  body('icon').optional().trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Orden debe ser un número mayor o igual a 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, color, icon, order } = req.body;

    // Check if categoria with same name exists
    const existingCategoria = await Categoria.findOne({ name });
    if (existingCategoria) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const categoria = await Categoria.create({
      name,
      description,
      color,
      icon,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: categoria
    });
  } catch (error) {
    console.error('Create categoria error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Actualizar categoría
// @route   PUT /api/categorias/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), [
  body('name').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('description').optional().trim(),
  body('color').optional().trim(),
  body('icon').optional().trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Orden debe ser un número mayor o igual a 0'),
  body('active').optional().isBoolean().withMessage('Active debe ser booleano')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const categoria = await Categoria.findOne({ 
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Check if name is being changed and if it conflicts
    if (req.body.name && req.body.name !== categoria.name) {
      const existingCategoria = await Categoria.findOne({ name: req.body.name });
      if (existingCategoria) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    // Update categoria
    Object.keys(req.body).forEach(key => {
      categoria[key] = req.body[key];
    });

    await categoria.save();

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    console.error('Update categoria error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Eliminar categoría
// @route   DELETE /api/categorias/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ 
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    await categoria.deleteOne();

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Delete categoria error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

export default router;
