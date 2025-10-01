const express = require('express');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
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

module.exports = router;
