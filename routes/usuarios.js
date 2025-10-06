import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtener todos los usuarios
// @route   GET /api/usuarios
// @access  Public
router.get('/', [
  query('role').optional().isIn(['admin', 'editor', 'author']).withMessage('Rol inválido'),
  query('active').optional().isBoolean().withMessage('Active debe ser booleano')
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
    
    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.active !== undefined) {
      query.active = req.query.active === 'true';
    }

    // Execute query - SIN LÍMITES
    const usuarios = await Usuario.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: usuarios,
      count: usuarios.length
    });
  } catch (error) {
    console.error('Get usuarios error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Obtener usuario por ID
// @route   GET /api/usuarios/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Get usuario error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Actualizar usuario
// @route   PUT /api/usuarios/:id
// @access  Public
router.put('/:id', [
  body('username').optional().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('role').optional().isIn(['admin', 'editor', 'author']).withMessage('Rol inválido'),
  body('permissions').optional().isArray().withMessage('Permissions debe ser un array'),
  body('active').optional().isBoolean().withMessage('Active debe ser booleano'),
  body('profile.firstName').optional().trim(),
  body('profile.lastName').optional().trim(),
  body('profile.bio').optional().trim(),
  body('profile.phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Check if username is being changed and if it conflicts
    if (req.body.username && req.body.username !== usuario.username) {
      const existingUsuario = await Usuario.findOne({ username: req.body.username });
      if (existingUsuario) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese nombre de usuario'
        });
      }
    }

    // Check if email is being changed and if it conflicts
    if (req.body.email && req.body.email !== usuario.email) {
      const existingUsuario = await Usuario.findOne({ email: req.body.email });
      if (existingUsuario) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese email'
        });
      }
    }

    // Update usuario
    Object.keys(req.body).forEach(key => {
      if (key === 'profile') {
        usuario.profile = { ...usuario.profile, ...req.body.profile };
      } else {
        usuario[key] = req.body[key];
      }
    });

    await usuario.save();

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        id: usuario._id,
        username: usuario.username,
        email: usuario.email,
        role: usuario.role,
        permissions: usuario.permissions,
        profile: usuario.profile,
        fullName: usuario.fullName,
        active: usuario.active
      }
    });
  } catch (error) {
    console.error('Update usuario error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Eliminar usuario
// @route   DELETE /api/usuarios/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Prevent admin from deleting themselves
    if (usuario._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    await usuario.deleteOne();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Delete usuario error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// @desc    Activar/Desactivar usuario
// @route   PUT /api/usuarios/:id/toggle-status
// @access  Public
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Prevent admin from deactivating themselves
    if (usuario._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta'
      });
    }

    usuario.active = !usuario.active;
    await usuario.save();

    res.json({
      success: true,
      message: `Usuario ${usuario.active ? 'activado' : 'desactivado'} exitosamente`,
      data: {
        id: usuario._id,
        username: usuario.username,
        email: usuario.email,
        role: usuario.role,
        active: usuario.active
      }
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

export default router;

