const express = require('express');
const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Banner = require('../models/Banner');
const adminAuth = require('../middleware/admin');
const prisma = require('../lib/prisma');
const router = express.Router();

// Dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [usersCount, servicesCount, appointmentsCount, bannersCount, todayAppointments, recentAppointments] = await Promise.all([
      prisma.user.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.appointment.count(),
      prisma.banner.count({ where: { isActive: true } }),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.appointment.findMany({
        take: 10,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          service: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      stats: {
        totalUsers: usersCount,
        totalServices: servicesCount,
        totalAppointments: appointmentsCount,
        totalBanners: bannersCount,
        todayAppointments: todayAppointments
      },
      recentAppointments: recentAppointments.map(apt => ({
        id: apt.id,
        user_name: apt.user.name,
        user_email: apt.user.email,
        service_name: apt.service.name,
        appointment_date: apt.appointmentDate,
        appointment_time: apt.appointmentTime,
        status: apt.status
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// Users management
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await User.getAll({ page: parseInt(page), limit: parseInt(limit), search });
    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Services management
router.get('/services', adminAuth, async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

router.post('/services', adminAuth, async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    
    if (!name || !price || !duration) {
      return res.status(400).json({ error: 'Name, price and duration are required' });
    }

    const serviceData = { name, description, price, duration, category };
    const service = await Service.create(serviceData);
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, duration, category, is_active } = req.body;
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;
    if (category !== undefined) updateData.category = category;
    if (is_active !== undefined) updateData.is_active = is_active;

    const service = await Service.update(req.params.id, updateData);
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', adminAuth, async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Appointments management
router.get('/appointments', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date_from, date_to } = req.query;
    const result = await Appointment.getAll({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      status, 
      date_from, 
      date_to 
    });
    res.json(result);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

router.patch('/appointments/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointment = await Appointment.updateStatus(req.params.id, status);
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

// Analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { period = 30 } = req.query;
    const stats = await Appointment.getStats(parseInt(period));
    
    // Daily appointments for chart
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const dailyAppointments = await prisma.appointment.groupBy({
      by: ['appointmentDate'],
      where: {
        appointmentDate: { gte: startDate }
      },
      _count: { appointmentDate: true },
      orderBy: { appointmentDate: 'asc' }
    });

    res.json({
      appointmentsByStatus: stats.byStatus,
      appointmentsByService: stats.byService,
      dailyAppointments: dailyAppointments.map(item => ({
        date: item.appointmentDate,
        count: item._count.appointmentDate
      }))
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics data' });
  }
});

module.exports = router;
