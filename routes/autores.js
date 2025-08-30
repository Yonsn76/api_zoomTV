import express from 'express';
import { body, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todos los autores (público)
// @route   GET /api/autores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const autores = await Usuario.find({ 
      active: true,
      role: { $in: ['author', 'editor'] }
    })
    .select('username profile fullName')
    .sort({ 'profile.firstName': 1 });

    res.json({
      success: true,
      data: autores
    });
  } catch (error) {
    console.error('Get autores error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener autor por ID (público)
// @route   GET /api/autores/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const autor = await Usuario.findOne({ 
      _id: req.params.id,
      active: true,
      role: { $in: ['author', 'editor'] }
    }).select('username profile fullName createdAt');

    if (!autor) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado'
      });
    }

    res.json({
      success: true,
      data: autor
    });
  } catch (error) {
    console.error('Get autor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

export default router;
