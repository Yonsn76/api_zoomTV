import express from 'express';
import CompanyInfo from '../models/CompanyInfo.js';
import TeamMember from '../models/TeamMember.js';
import CompanyHistory from '../models/CompanyHistory.js';
import CompanyValues from '../models/CompanyValues.js';

const router = express.Router();

// ===== COMPANY INFO ROUTES =====

// Obtener información de la empresa
router.get('/info', async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findOne({ isActive: true });
    
    if (!companyInfo) {
      return res.status(404).json({
        success: false,
        message: 'Información de la empresa no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: companyInfo
    });
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar información de la empresa
router.put('/info', async (req, res) => {
  try {
    const updateData = req.body;
    
    // Buscar la configuración activa
    let companyInfo = await CompanyInfo.findOne({ isActive: true });
    
    if (companyInfo) {
      // Actualizar la configuración existente
      Object.assign(companyInfo, updateData);
      await companyInfo.save();
    } else {
      // Crear nueva configuración
      companyInfo = new CompanyInfo(updateData);
      await companyInfo.save();
    }
    
    res.json({
      success: true,
      message: 'Información de la empresa actualizada exitosamente',
      data: companyInfo
    });
  } catch (error) {
    console.error('Error updating company info:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ===== TEAM MEMBER ROUTES =====

// Obtener todos los miembros del equipo
router.get('/team', async (req, res) => {
  try {
    const teamMembers = await TeamMember.getActiveOrdered();
    
    res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener miembro del equipo por ID
router.get('/team/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del equipo no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Crear nuevo miembro del equipo
router.post('/team', async (req, res) => {
  try {
    const teamMemberData = req.body;
    const teamMember = new TeamMember(teamMemberData);
    await teamMember.save();
    
    res.status(201).json({
      success: true,
      message: 'Miembro del equipo creado exitosamente',
      data: teamMember
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar miembro del equipo
router.put('/team/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del equipo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Miembro del equipo actualizado exitosamente',
      data: teamMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar miembro del equipo
router.delete('/team/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del equipo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Miembro del equipo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ===== COMPANY HISTORY ROUTES =====

// Obtener historia de la empresa
router.get('/history', async (req, res) => {
  try {
    const history = await CompanyHistory.getActive();
    
    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'Historia de la empresa no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching company history:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar historia de la empresa
router.put('/history', async (req, res) => {
  try {
    const updateData = req.body;
    
    // Buscar la configuración activa
    let history = await CompanyHistory.findOne({ isActive: true });
    
    if (history) {
      // Actualizar la configuración existente
      Object.assign(history, updateData);
      await history.save();
    } else {
      // Crear nueva configuración
      history = new CompanyHistory(updateData);
      await history.save();
    }
    
    res.json({
      success: true,
      message: 'Historia de la empresa actualizada exitosamente',
      data: history
    });
  } catch (error) {
    console.error('Error updating company history:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ===== COMPANY VALUES ROUTES =====

// Obtener valores de la empresa
router.get('/values', async (req, res) => {
  try {
    const values = await CompanyValues.getActive();
    
    if (!values) {
      return res.status(404).json({
        success: false,
        message: 'Valores de la empresa no encontrados'
      });
    }
    
    res.json({
      success: true,
      data: values
    });
  } catch (error) {
    console.error('Error fetching company values:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar valores de la empresa
router.put('/values', async (req, res) => {
  try {
    const updateData = req.body;
    
    // Buscar la configuración activa
    let values = await CompanyValues.findOne({ isActive: true });
    
    if (values) {
      // Actualizar la configuración existente
      Object.assign(values, updateData);
      await values.save();
    } else {
      // Crear nueva configuración
      values = new CompanyValues(updateData);
      await values.save();
    }
    
    res.json({
      success: true,
      message: 'Valores de la empresa actualizados exitosamente',
      data: values
    });
  } catch (error) {
    console.error('Error updating company values:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

export default router;
