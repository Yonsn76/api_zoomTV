import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Noticia from '../models/Noticia.js';
import { protect, authorize, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todas las noticias (público)
// @route   GET /api/noticias
// @access  Public
router.get('/', [
  query('category').optional().isIn(['actualidad', 'deportes', 'musica', 'nacionales', 'regionales']).withMessage('Categoría inválida'),
  query('status').optional().isIn(['published', 'draft', 'archived']).withMessage('Estado inválido'),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }


    // Build query
    const query = {};
    
    // Solo mostrar noticias publicadas para usuarios no autenticados
    if (!req.headers.authorization) {
      query.status = 'published';
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Execute query - SIN LÍMITES
    const noticias = await Noticia.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: noticias,
      count: noticias.length
    });
  } catch (error) {
    console.error('Get noticias error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener noticia por ID (público)
// @route   GET /api/noticias/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ],
      status: 'published'
    });

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Incrementar vistas
    await noticia.incrementViews();

    res.json({
      success: true,
      data: noticia
    });
  } catch (error) {
    console.error('Get noticia error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener noticias destacadas (público)
// @route   GET /api/noticias/featured/featured
// @access  Public
router.get('/featured/featured', async (req, res) => {
  try {
    const noticias = await Noticia.getFeatured();

    res.json({
      success: true,
      data: noticias
    });
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener noticias por categoría (público)
// @route   GET /api/noticias/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { category } = req.params;
    const noticias = await Noticia.getByCategory(category);

    res.json({
      success: true,
      data: noticias
    });
  } catch (error) {
    console.error('Get by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Buscar noticias (público)
// @route   GET /api/noticias/search/search
// @access  Public
router.get('/search/search', [
  query('q').notEmpty().withMessage('Query de búsqueda requerida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { q } = req.query;
    const noticias = await Noticia.search(q);

    res.json({
      success: true,
      data: noticias
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Crear noticia
// @route   POST /api/noticias
// @access  Private
router.post('/', protect, checkPermission('create'), [
  body('id').notEmpty().withMessage('ID es requerido'),
  body('title').notEmpty().withMessage('Título es requerido'),
  body('author').notEmpty().withMessage('Autor es requerido'),
  body('date').notEmpty().withMessage('Fecha es requerida'),
  body('summary').notEmpty().withMessage('Resumen es requerido'),
  body('content').notEmpty().withMessage('Contenido es requerido'),
  body('category').isIn(['actualidad', 'deportes', 'musica', 'nacionales', 'regionales']).withMessage('Categoría inválida'),
  body('status').optional().isIn(['published', 'draft', 'archived']).withMessage('Estado inválido'),
  body('featured').optional().isBoolean().withMessage('Featured debe ser booleano'),
  body('tags').optional().isArray().withMessage('Tags debe ser un array'),
  body('seoTitle').optional().trim(),
  body('seoDescription').optional().trim(),
  body('seoKeywords').optional().isArray().withMessage('SEO keywords debe ser un array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if noticia with same ID exists
    const existingNoticia = await Noticia.findOne({ id: req.body.id });
    if (existingNoticia) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una noticia con ese ID'
      });
    }

    const noticiaData = {
      ...req.body,
      author: req.user.fullName || req.user.username
    };

    // Set publishedAt if status is published
    if (req.body.status === 'published') {
      noticiaData.publishedAt = new Date();
    }

    const noticia = await Noticia.create(noticiaData);

    res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente',
      data: noticia
    });
  } catch (error) {
    console.error('Create noticia error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Actualizar noticia
// @route   PUT /api/noticias/:id
// @access  Private
router.put('/:id', protect, checkPermission('update'), [
  body('title').optional().notEmpty().withMessage('Título no puede estar vacío'),
  body('summary').optional().notEmpty().withMessage('Resumen no puede estar vacío'),
  body('content').optional().notEmpty().withMessage('Contenido no puede estar vacío'),
  body('category').optional().isIn(['actualidad', 'deportes', 'musica', 'nacionales', 'regionales']).withMessage('Categoría inválida'),
  body('status').optional().isIn(['published', 'draft', 'archived']).withMessage('Estado inválido'),
  body('featured').optional().isBoolean().withMessage('Featured debe ser booleano'),
  body('tags').optional().isArray().withMessage('Tags debe ser un array'),
  body('seoTitle').optional().trim(),
  body('seoDescription').optional().trim(),
  body('seoKeywords').optional().isArray().withMessage('SEO keywords debe ser un array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const noticia = await Noticia.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Update noticia
    Object.keys(req.body).forEach(key => {
      noticia[key] = req.body[key];
    });

    // Set publishedAt if status is being changed to published
    if (req.body.status === 'published' && noticia.status !== 'published') {
      noticia.publishedAt = new Date();
    }

    await noticia.save();

    res.json({
      success: true,
      message: 'Noticia actualizada exitosamente',
      data: noticia
    });
  } catch (error) {
    console.error('Update noticia error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Eliminar noticia
// @route   DELETE /api/noticias/:id
// @access  Private
router.delete('/:id', protect, checkPermission('delete'), async (req, res) => {
  try {
    const noticia = await Noticia.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    await noticia.deleteOne();

    res.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Delete noticia error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Publicar noticia
// @route   PUT /api/noticias/:id/publish
// @access  Private
router.put('/:id/publish', protect, checkPermission('publish'), async (req, res) => {
  try {
    const noticia = await Noticia.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    await noticia.publish();

    res.json({
      success: true,
      message: 'Noticia publicada exitosamente',
      data: noticia
    });
  } catch (error) {
    console.error('Publish noticia error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Archivar noticia
// @route   PUT /api/noticias/:id/archive
// @access  Private
router.put('/:id/archive', protect, checkPermission('update'), async (req, res) => {
  try {
    const noticia = await Noticia.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    await noticia.archive();

    res.json({
      success: true,
      message: 'Noticia archivada exitosamente',
      data: noticia
    });
  } catch (error) {
    console.error('Archive noticia error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

export default router;

