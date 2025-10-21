const express = require('express');
const router = express.Router();
const renovatioService = require('../services/renovatioService');
const renovatioSyncJob = require('../jobs/renovatioSync');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
const Appointment = require('../models/Appointment');
const adminAuth = require('../middleware/admin');

// 1. Синхронизация услуг и категорий (admin only)
router.post('/sync/services', adminAuth, async (req, res) => {
  try {
    console.log('Starting services synchronization...');
    
    // Получаем данные из Renovatio
    const [renovatioCategories, renovatioServices] = await Promise.all([
      renovatioService.getServiceCategories(),
      renovatioService.getServices()
    ]);

    console.log(`Received ${renovatioCategories.length} categories and ${renovatioServices.length} services from Renovatio`);

    // Синхронизируем категории
    const categoryResults = await ServiceCategory.syncFromRenovatio(renovatioCategories);
    console.log('Categories sync results:', categoryResults);

    // Синхронизируем услуги
    const serviceResults = await Service.syncFromRenovatio(renovatioServices);
    console.log('Services sync results:', serviceResults);

    res.json({
      message: 'Services synchronized successfully',
      categories: {
        total: renovatioCategories.length,
        created: categoryResults.created,
        updated: categoryResults.updated,
        errors: categoryResults.errors.length
      },
      services: {
        total: renovatioServices.length,
        created: serviceResults.created,
        updated: serviceResults.updated,
        errors: serviceResults.errors.length
      },
      errors: [...categoryResults.errors, ...serviceResults.errors]
    });
  } catch (error) {
    console.error('Sync services error:', error);
    res.status(500).json({ 
      error: 'Failed to sync services',
      message: error.message 
    });
  }
});

// Получение статуса синхронизации (admin only)
router.get('/sync/status', adminAuth, async (req, res) => {
  try {
    const [categories, services, appointments] = await Promise.all([
      ServiceCategory.getAllRenovatioCategories(),
      Service.getAllRenovatioServices(),
      Appointment.getAllRenovatioAppointments()
    ]);

    res.json({
      categories: {
        total: categories.length,
        items: categories.map(c => ({ id: c.id, name: c.name, renovatioId: c.renovatioId }))
      },
      services: {
        total: services.length,
        items: services.map(s => ({ id: s.id, name: s.name, renovatioId: s.renovatioId }))
      },
      appointments: {
        total: appointments.length,
        items: appointments.map(a => ({ id: a.id, renovatioId: a.renovatioId, status: a.renovatioStatus }))
      }
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    res.status(500).json({ error: 'Failed to get sync status' });
  }
});

// 4. Получение расписания (public)
router.get('/schedule', async (req, res) => {
  try {
    const { clinic_id, user_id, service_id, time_start, time_end } = req.query;
    
    if (!clinic_id || !user_id) {
      return res.status(400).json({ 
        error: 'clinic_id and user_id are required' 
      });
    }

    const schedule = await renovatioService.getSchedule({
      clinic_id,
      user_id,
      service_id,
      time_start: time_start || new Date().toISOString().split('T')[0],
      time_end: time_end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      step: 30,
      show_busy: 0,
      show_past: 0
    });

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ 
      error: 'Failed to get schedule',
      message: error.message 
    });
  }
});

// Получение врачей (public)
router.get('/doctors', async (req, res) => {
  try {
    const { clinic_id, profession_id, role } = req.query;
    
    const doctors = await renovatioService.getUsers({
      clinic_id,
      profession_id,
      role: role || 'doctor',
      show_all: 1,
      show_deleted: 0
    });

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ 
      error: 'Failed to get doctors',
      message: error.message 
    });
  }
});

// Получение клиник (public)
router.get('/clinics', async (req, res) => {
  try {
    const clinics = await renovatioService.getClinics({
      show_all: 1,
      show_deleted: 0
    });

    res.json(clinics);
  } catch (error) {
    console.error('Get clinics error:', error);
    res.status(500).json({ 
      error: 'Failed to get clinics',
      message: error.message 
    });
  }
});

// Получение профессий врачей (public)
router.get('/professions', async (req, res) => {
  try {
    const professions = await renovatioService.getProfessions({
      show_all: 1,
      show_deleted: 0
    });

    res.json(professions);
  } catch (error) {
    console.error('Get professions error:', error);
    res.status(500).json({ 
      error: 'Failed to get professions',
      message: error.message 
    });
  }
});

// Получение типов визитов (public)
router.get('/appointment-types', async (req, res) => {
  try {
    const types = await renovatioService.getAppointmentTypes({
      show_deleted: 0
    });

    res.json(types);
  } catch (error) {
    console.error('Get appointment types error:', error);
    res.status(500).json({ 
      error: 'Failed to get appointment types',
      message: error.message 
    });
  }
});

// Получение рекламных каналов (public)
router.get('/channels', async (req, res) => {
  try {
    const channels = await renovatioService.getAdvChannels({
      show_deleted: 0
    });

    res.json(channels);
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ 
      error: 'Failed to get channels',
      message: error.message 
    });
  }
});

// Проверка статуса визита (public)
router.get('/appointment/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id);
    if (!appointment || !appointment.renovatioId) {
      return res.status(404).json({ error: 'Appointment not found or not synced with Renovatio' });
    }

    const status = await renovatioService.checkAppointmentStatus(appointment.renovatioId);
    
    // Обновляем статус в локальной БД
    await Appointment.updateRenovatioStatus(id, status.status);

    res.json({
      appointmentId: id,
      renovatioId: appointment.renovatioId,
      status: status.status,
      isMoved: status.is_moved
    });
  } catch (error) {
    console.error('Check appointment status error:', error);
    res.status(500).json({ 
      error: 'Failed to check appointment status',
      message: error.message 
    });
  }
});

// Отмена визита в Renovatio (admin only)
router.post('/appointment/:id/cancel', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    
    const appointment = await Appointment.findById(id);
    if (!appointment || !appointment.renovatioId) {
      return res.status(404).json({ error: 'Appointment not found or not synced with Renovatio' });
    }

    const result = await renovatioService.cancelAppointment(appointment.renovatioId, comment);
    
    // Обновляем статус в локальной БД
    await Appointment.updateRenovatioStatus(id, 'refused');

    res.json({
      success: result,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ 
      error: 'Failed to cancel appointment',
      message: error.message 
    });
  }
});

// Подтверждение визита в Renovatio (admin only)
router.post('/appointment/:id/confirm', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id);
    if (!appointment || !appointment.renovatioId) {
      return res.status(404).json({ error: 'Appointment not found or not synced with Renovatio' });
    }

    const result = await renovatioService.confirmAppointment(appointment.renovatioId);
    
    // Обновляем статус в локальной БД
    await Appointment.updateRenovatioStatus(id, 'confirmed');

    res.json({
      success: result,
      message: 'Appointment confirmed successfully'
    });
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({ 
      error: 'Failed to confirm appointment',
      message: error.message 
    });
  }
});

// Manual sync trigger (admin only)
router.post('/sync/manual', adminAuth, async (req, res) => {
  try {
    const result = await renovatioSyncJob.manualSync();
    res.json(result);
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({ 
      error: 'Failed to run manual sync',
      message: error.message 
    });
  }
});

// Get sync job status (admin only)
router.get('/sync/job-status', adminAuth, async (req, res) => {
  try {
    const status = renovatioSyncJob.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Get sync job status error:', error);
    res.status(500).json({ error: 'Failed to get sync job status' });
  }
});
