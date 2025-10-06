import express from 'express';
import Transmision from '../models/Transmision.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todas las transmisiones
// @route   GET /api/transmisiones
// @access  Público
router.get('/', async (req, res) => {
  try {
    const transmisiones = await Transmision.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: transmisiones
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

// @desc    Obtener transmisión en vivo activa
// @route   GET /api/transmisiones/live
// @access  Público
router.get('/live', async (req, res) => {
  try {
    const transmisionLive = await Transmision.getActiveLive();
    
    if (!transmisionLive) {
      return res.json({
        success: true,
        data: null,
        message: 'No hay transmisión en vivo'
      });
    }
    
    res.json({
      success: true,
      data: transmisionLive
    });
  } catch (error) {
    console.error('Error obteniendo transmisión en vivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Obtener transmisión por ID
// @route   GET /api/transmisiones/:id
// @access  Público
router.get('/:id', async (req, res) => {
  try {
    const transmision = await Transmision.findById(req.params.id)
      .populate('createdBy', 'name email');
    
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
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { nombre, url } = req.body;

    // Validar campos obligatorios
    if (!nombre || !url) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y URL son obligatorios'
      });
    }

    // Crear la transmisión
    const transmision = await Transmision.create({
      nombre,
      url,
      createdBy: req.body.createdBy || null
    });

    res.status(201).json({
      success: true,
      data: transmision,
      message: 'Transmisión creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando transmisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Actualizar transmisión
// @route   PUT /api/transmisiones/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { nombre, url } = req.body;

    const transmision = await Transmision.findById(req.params.id);
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }

    // Actualizar campos
    if (nombre) transmision.nombre = nombre;
    if (url) transmision.url = url;

    await transmision.save();

    res.json({
      success: true,
      data: transmision,
      message: 'Transmisión actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando transmisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Lanzar transmisión en vivo
// @route   PUT /api/transmisiones/:id/live
// @access  Public
router.put('/:id/live', async (req, res) => {
  try {
    const transmision = await Transmision.findById(req.params.id);
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }

    // Activar como transmisión en vivo
    await transmision.activateLive();

    res.json({
      success: true,
      data: transmision,
      message: 'Transmisión lanzada en vivo exitosamente'
    });
  } catch (error) {
    console.error('Error lanzando transmisión en vivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Detener transmisión en vivo
// @route   PUT /api/transmisiones/:id/stop
// @access  Public
router.put('/:id/stop', async (req, res) => {
  try {
    const transmision = await Transmision.findById(req.params.id);
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }

    // Detener transmisión en vivo
    await transmision.deactivateLive();

    res.json({
      success: true,
      data: transmision,
      message: 'Transmisión detenida exitosamente'
    });
  } catch (error) {
    console.error('Error deteniendo transmisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// @desc    Eliminar transmisión
// @route   DELETE /api/transmisiones/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const transmision = await Transmision.findById(req.params.id);
    
    if (!transmision) {
      return res.status(404).json({
        success: false,
        message: 'Transmisión no encontrada'
      });
    }

    await Transmision.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transmisión eliminada exitosamente'
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