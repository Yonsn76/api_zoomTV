import express from 'express';
import { body, validationResult } from 'express-validator';
import Programacion from '../models/Programacion.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validaciones para crear/actualizar programación
const programacionValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('El título es obligatorio y no puede exceder 200 caracteres'),
  
  body('day')
    .isIn(['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'])
    .withMessage('El día debe ser uno de los días de la semana válidos'),
  
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora de inicio debe tener el formato HH:MM'),
  
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora de fin debe tener el formato HH:MM'),
  
  body('category')
    .optional()
    .isIn(['Noticias', 'Música', 'Cine', 'Series', 'Anime', 'Entretenimiento', 'Deportes', 'Documentales', 'Otros'])
    .withMessage('Categoría inválida'),
  
  body('type')
    .optional()
    .isIn(['Programa en vivo', 'Película', 'Serie', 'Música', 'Anime', 'Documental', 'Otros'])
    .withMessage('Tipo inválido'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas no pueden exceder 1000 caracteres'),
  
  body('priority')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La prioridad debe ser un número entero mayor o igual a 0'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano')
];

// GET /api/programacion - Obtener toda la programación
router.get('/', async (req, res) => {
  try {
    const { day, category, isActive } = req.query;
    let filter = {};
    
    if (day) {
      filter.day = day.toUpperCase();
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    const programacion = await Programacion.find(filter)
      .sort({ day: 1, startTime: 1, priority: -1 })
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: programacion,
      message: 'Programación obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener programación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/programacion/weekly - Obtener programación semanal organizada por días
router.get('/weekly', async (req, res) => {
  try {
    const programacion = await Programacion.find({ isActive: true })
      .sort({ day: 1, startTime: 1, priority: -1 })
      .populate('createdBy', 'name email');
    
    // Organizar por días
    const weeklySchedule = {
      'LUNES': [],
      'MARTES': [],
      'MIÉRCOLES': [],
      'JUEVES': [],
      'VIERNES': [],
      'SÁBADO': [],
      'DOMINGO': []
    };
    
    programacion.forEach(program => {
      weeklySchedule[program.day].push(program);
    });
    
    res.json({
      success: true,
      data: weeklySchedule,
      message: 'Programación semanal obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener programación semanal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/programacion/:id - Obtener programa específico
router.get('/:id', async (req, res) => {
  try {
    const programacion = await Programacion.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!programacion) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: programacion,
      message: 'Programa obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/programacion - Crear nuevo programa
router.post('/', auth, programacionValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }
    
    // Verificar que no haya conflicto de horarios para el mismo día
    const { day, startTime, endTime } = req.body;
    const conflictingProgram = await Programacion.findOne({
      day: day.toUpperCase(),
      isActive: true,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });
    
    if (conflictingProgram) {
      return res.status(400).json({
        success: false,
        message: 'Existe un conflicto de horarios con otro programa'
      });
    }
    
    const programacion = new Programacion({
      ...req.body,
      createdBy: req.user.id
    });
    
    await programacion.save();
    
    res.status(201).json({
      success: true,
      data: programacion,
      message: 'Programa creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/programacion/:id - Actualizar programa
router.put('/:id', auth, programacionValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }
    
    const programacion = await Programacion.findById(req.params.id);
    
    if (!programacion) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }
    
    // Verificar que no haya conflicto de horarios (excluyendo el programa actual)
    const { day, startTime, endTime } = req.body;
    const conflictingProgram = await Programacion.findOne({
      _id: { $ne: req.params.id },
      day: day.toUpperCase(),
      isActive: true,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });
    
    if (conflictingProgram) {
      return res.status(400).json({
        success: false,
        message: 'Existe un conflicto de horarios con otro programa'
      });
    }
    
    Object.assign(programacion, req.body);
    await programacion.save();
    
    res.json({
      success: true,
      data: programacion,
      message: 'Programa actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/programacion/:id - Eliminar programa
router.delete('/:id', auth, async (req, res) => {
  try {
    const programacion = await Programacion.findById(req.params.id);
    
    if (!programacion) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }
    
    await Programacion.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Programa eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PATCH /api/programacion/:id/toggle - Activar/desactivar programa
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const programacion = await Programacion.findById(req.params.id);
    
    if (!programacion) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }
    
    programacion.isActive = !programacion.isActive;
    await programacion.save();
    
    res.json({
      success: true,
      data: programacion,
      message: `Programa ${programacion.isActive ? 'activado' : 'desactivado'} exitosamente`
    });
  } catch (error) {
    console.error('Error al cambiar estado del programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/programacion/day/:day - Obtener programas por día específico
router.get('/day/:day', async (req, res) => {
  try {
    const day = req.params.day.toUpperCase();
    
    if (!['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'].includes(day)) {
      return res.status(400).json({
        success: false,
        message: 'Día inválido'
      });
    }
    
    const programacion = await Programacion.find({ 
      day: day, 
      isActive: true 
    })
    .sort({ startTime: 1, priority: -1 })
    .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: programacion,
      message: `Programación del ${day} obtenida exitosamente`
    });
  } catch (error) {
    console.error('Error al obtener programación por día:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

export default router;
