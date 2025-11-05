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
    // Используем рекурсивный метод для получения ВСЕХ категорий (включая подкатегории)
    const [renovatioCategories, renovatioServices] = await Promise.all([
      renovatioService.getAllServiceCategoriesRecursive(),
      renovatioService.getServices()
    ]);

    console.log(`Received ${renovatioCategories.length} categories and ${renovatioServices.length} services from Renovatio`);

    // Синхронизируем категории
    const categoryResults = await ServiceCategory.syncFromRenovatio(renovatioCategories);
    console.log('Categories sync results:', categoryResults);

    // Синхронизируем услуги
    const serviceResults = await Service.syncFromRenovatio(renovatioServices);
    console.log('Services sync results:', serviceResults);

    const response = {
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
    };

    // Логируем первые несколько ошибок для отладки
    if (response.errors.length > 0) {
      console.log('Sample errors (first 5):', response.errors.slice(0, 5));
    }

    res.json(response);
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
    const { clinic_id, user_id, service_id, time_start, time_end, step } = req.query;
    
    console.log('Schedule request params:', { clinic_id, user_id, service_id, time_start, time_end, step });
    console.log('Using step:', step || 30, 'minutes');
    
    if (!clinic_id || !user_id) {
      console.log('Missing required parameters: clinic_id or user_id');
      return res.status(400).json({ 
        error: 'clinic_id and user_id are required',
        received: { clinic_id, user_id, service_id, time_start, time_end }
      });
    }

    // Преобразуем даты в правильный формат для Renovatio API: dd.mm.yyyy hh:mm
    // Определяем часы работы в зависимости от дня недели:
    // Пн-Пт (1-5): 9:00 - 20:00
    // Сб-Вс (0, 6): 10:00 - 15:00
    const getWorkHours = (date) => {
      const dayOfWeek = date.getDay(); // 0 = воскресенье, 6 = суббота
      // 1-5 = Пн-Пт, 0 и 6 = Вс и Сб
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        return { start: { hour: 9, minute: 0 }, end: { hour: 20, minute: 0 } };
      } else {
        return { start: { hour: 10, minute: 0 }, end: { hour: 15, minute: 0 } };
      }
    };

    const formatDateForRenovatio = (dateStr, isStart = true) => {
      if (!dateStr) return null;
      
      try {
        // Парсим дату в любой формате
        const date = new Date(dateStr);
        
        // Определяем часы работы для этого дня
        const workHours = getWorkHours(date);
        const timeToUse = isStart ? workHours.start : workHours.end;
        
        // Форматируем в dd.mm.yyyy hh:mm
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(timeToUse.hour).padStart(2, '0');
        const minutes = String(timeToUse.minute).padStart(2, '0');
        
        return `${day}.${month}.${year} ${hours}:${minutes}`;
      } catch (error) {
        console.error('Error parsing date:', dateStr, error);
        const now = new Date();
        const workHours = getWorkHours(now);
        const timeToUse = isStart ? workHours.start : workHours.end;
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}.${month}.${year} ${String(timeToUse.hour).padStart(2, '0')}:${String(timeToUse.minute).padStart(2, '0')}`;
      }
    };

    const scheduleParams = {
      clinic_id: parseInt(clinic_id),
      user_id: parseInt(user_id),
      service_id: service_id ? parseInt(service_id) : undefined,
      time_start: formatDateForRenovatio(time_start, true) || formatDateForRenovatio(new Date().toISOString(), true),
      time_end: formatDateForRenovatio(time_end, false) || formatDateForRenovatio(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), false),
      step: 15, // Фиксированное значение 15 минут
      show_busy: 1, // Показывать и занятые слоты (чтобы видеть is_busy)
      show_past: 0
    };

    console.log('Calling Renovatio API with params:', scheduleParams);
    console.log('Step will be used for scheduling intervals:', scheduleParams.step, 'minutes');
    
    const schedule = await renovatioService.getSchedule(scheduleParams);
    console.log('Renovatio API response:', schedule);
    
    // Логируем первые слоты для отладки
    if (schedule && typeof schedule === 'object' && Object.keys(schedule).length > 0) {
      const firstUserKey = Object.keys(schedule)[0];
      const firstSlots = schedule[firstUserKey];
      console.log('First user slots sample:', firstSlots?.slice(0, 3));
      if (firstSlots?.[0]) {
        console.log('Sample slot data:', {
          time: firstSlots[0].time,
          time_start_short: firstSlots[0].time_start_short,
          is_busy: firstSlots[0].is_busy,
          available: !firstSlots[0].is_busy
        });
      }
    }
    
    // Преобразуем ответ Renovatio (объект с user_id ключами) в плоский массив слотов
    let slots = [];
    if (schedule && typeof schedule === 'object') {
      // Если это объект с ключами-идентификаторами пользователей, извлекаем все слоты
      Object.values(schedule).forEach(userSlots => {
        if (Array.isArray(userSlots)) {
          slots = slots.concat(userSlots);
        }
      });
    } else if (Array.isArray(schedule)) {
      slots = schedule;
    }
    
    // Трансформируем поля для фронтенда
    // Renovatio возвращает is_busy (true/false), мы конвертируем в available
    // Также используем time_start_short для времени начала слота
    slots = slots.map(slot => ({
      ...slot,
      available: slot.is_busy === false || slot.is_busy === 0 || !slot.is_busy,
      time: slot.time_start_short || slot.time || slot.time_start?.split(' ')[1]?.substring(0, 5) || '--:--'
    }));
    
    console.log('Transformed schedule slots count:', slots.length);
    const busySlots = slots.filter(s => s.is_busy);
    const availableSlots = slots.filter(s => !s.is_busy);
    console.log(`Slots breakdown: ${availableSlots.length} available, ${busySlots.length} busy out of ${slots.length} total`);
    
    // Логируем примеры занятых слотов
    if (busySlots.length > 0) {
      console.log('Sample busy slots:', busySlots.slice(0, 3).map(s => ({ time: s.time, is_busy: s.is_busy, available: s.available })));
    }
    
    res.json(slots);
  } catch (error) {
    console.error('Get schedule error:', error);
    
    // Более детальная обработка ошибок
    if (error.message.includes('RENOVATIO_API_KEY')) {
      res.status(503).json({ 
        error: 'Renovatio API not configured',
        message: 'API key is missing or invalid'
      });
    } else if (error.response?.status === 401) {
      res.status(401).json({ 
        error: 'Renovatio API authentication failed',
        message: 'Invalid API key'
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      res.status(503).json({ 
        error: 'Renovatio API unavailable',
        message: 'Cannot connect to Renovatio service'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to get schedule',
        message: error.message,
        type: error.constructor.name
      });
    }
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

module.exports = router;