const express = require('express');
const Appointment = require('../models/Appointment');
const renovatioService = require('../services/renovatioService');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const router = express.Router();

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { service_id, appointment_date, appointment_time, notes } = req.body;
    
    const appointmentData = {
      user_id: req.user.userId,
      service_id,
      appointment_date,
      appointment_time,
      notes
    };

    const appointment = await Appointment.create(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get user appointments
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findByUserId(req.user.userId);
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to get appointment' });
  }
});

// Update appointment status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.updateStatus(req.params.id, status);
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

// Get appointments by date range (admin only)
router.get('/admin/range', auth, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const appointments = await Appointment.getByDateRange(start_date, end_date);
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments by range error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// Create appointment with Renovatio integration (Admin only - use /api/verification/send-code for public)
router.post('/renovatio', adminAuth, async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      third_name, 
      mobile, 
      email,
      birth_date,
      gender,
      doctor_id, 
      clinic_id,
      time_start, 
      time_end,
      service_id,
      comment,
      channel,
      source,
      type,
      is_outside,
      is_telemedicine
    } = req.body;

    // Валидация обязательных полей
    if (!doctor_id || !clinic_id || !time_start || !time_end) {
      return res.status(400).json({ 
        error: 'doctor_id, clinic_id, time_start, and time_end are required' 
      });
    }

    // Проверяем, есть ли данные пациента
    const hasPatientData = (first_name && last_name && mobile) || 
                          (first_name && last_name && third_name && birth_date);

    if (!hasPatientData) {
      return res.status(400).json({ 
        error: 'Patient data is required: either (first_name, last_name, mobile) or (first_name, last_name, third_name, birth_date)' 
      });
    }

    // Создаем запись в Renovatio
    const renovatioAppointmentData = {
      first_name,
      last_name,
      third_name,
      mobile,
      email,
      birth_date,
      gender,
      doctor_id,
      clinic_id,
      time_start,
      time_end,
      comment,
      channel,
      source,
      type,
      is_outside: is_outside ? 1 : 2,
      is_telemedicine: is_telemedicine ? 1 : 2,
      check_intersection: 1
    };

    // Добавляем услуги если указаны
    if (service_id) {
      renovatioAppointmentData.services = JSON.stringify([{
        service_id: service_id,
        count: 1,
        discount: 0
      }]);
    }

    const renovatioAppointmentId = await renovatioService.createAppointment(renovatioAppointmentData);

    // Сохраняем в локальную БД
    const appointmentData = {
      userId: req.user?.userId || null,
      serviceId: service_id || null,
      appointmentDate: new Date(time_start),
      appointmentTime: time_start,
      notes: comment,
      renovatioId: renovatioAppointmentId,
      renovatioStatus: 'upcoming',
      doctorId: doctor_id,
      clinicId: clinic_id
    };

    const appointment = await Appointment.createWithRenovatio(appointmentData);

    res.status(201).json({
      ...appointment,
      renovatioId: renovatioAppointmentId,
      message: 'Appointment created successfully in Renovatio'
    });
  } catch (error) {
    console.error('Create Renovatio appointment error:', error);
    res.status(500).json({ 
      error: 'Failed to create appointment',
      message: error.message 
    });
  }
});

// Check Renovatio appointment status
router.get('/:id/renovatio-status', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || !appointment.renovatioId) {
      return res.status(404).json({ error: 'Appointment not found or not synced with Renovatio' });
    }

    const status = await renovatioService.checkAppointmentStatus(appointment.renovatioId);
    
    // Обновляем статус в локальной БД
    await Appointment.updateRenovatioStatus(req.params.id, status.status);

    res.json({
      appointmentId: req.params.id,
      renovatioId: appointment.renovatioId,
      status: status.status,
      isMoved: status.is_moved,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Check Renovatio appointment status error:', error);
    res.status(500).json({ 
      error: 'Failed to check appointment status',
      message: error.message 
    });
  }
});

// Get appointments with Renovatio integration
router.get('/renovatio/all', async (req, res) => {
  try {
    const appointments = await Appointment.getAllRenovatioAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('Get Renovatio appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

module.exports = router;