const express = require('express');
const router = express.Router();
const verificationService = require('../services/verificationService');
const emailService = require('../services/emailService');
const renovatioService = require('../services/renovatioService');
const VerificationCode = require('../models/VerificationCode');
const AppointmentRequest = require('../models/AppointmentRequest');
const Appointment = require('../models/Appointment');
const emailRateLimit = require('../middleware/emailRateLimit').combinedEmailRateLimit;

// Отправка кода верификации
router.post('/send-code', emailRateLimit, async (req, res) => {
  try {
    const { 
      email,
      phone,
      first_name,
      last_name,
      third_name,
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
    if (!email || !first_name || !last_name || !doctor_id || !clinic_id || !time_start || !time_end) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, first_name, last_name, doctor_id, clinic_id, time_start, and time_end are required'
      });
    }

    // Валидация email
    if (!verificationService.validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    const formattedEmail = verificationService.formatEmail(email);

    // Проверяем, есть ли уже активная заявка для этого email
    const existingRequest = await AppointmentRequest.findByEmail(formattedEmail);
    if (existingRequest) {
      return res.status(400).json({
        error: 'Active request exists',
        message: 'У вас уже есть активная заявка. Проверьте email или дождитесь истечения текущей заявки.'
      });
    }

    // Создаем заявку на запись
    const appointmentData = {
      email: formattedEmail,
      phone: phone || '',
      firstName: first_name,
      lastName: last_name,
      thirdName: third_name,
      birthDate: birth_date,
      gender: gender,
      doctorId: doctor_id,
      clinicId: clinic_id,
      timeStart: time_start,
      timeEnd: time_end,
      serviceId: service_id,
      comment: comment,
      channel: channel || 'website',
      source: source || 'evimed',
      type: type || 'appointment',
      isOutside: is_outside || false,
      isTelemedicine: is_telemedicine || false
    };

    const appointmentRequest = await AppointmentRequest.create(appointmentData);

    // Создаем код верификации
    const verificationResult = await verificationService.createVerification(formattedEmail);

    if (!verificationResult.success) {
      // Удаляем заявку если не удалось отправить код
      await AppointmentRequest.delete(appointmentRequest.id);
      return res.status(500).json({
        error: 'Failed to send verification code',
        message: verificationResult.message
      });
    }

    // Связываем заявку с кодом верификации
    await AppointmentRequest.markAsVerified(appointmentRequest.id);
    
    // Обновляем заявку с verificationId
    const prisma = require('../lib/prisma');
    await prisma.appointmentRequest.update({
      where: { id: appointmentRequest.id },
      data: { verificationId: verificationResult.verificationId }
    });

    res.json({
      success: true,
      message: 'Код подтверждения отправлен на email',
      requestId: appointmentRequest.id,
      verificationId: verificationResult.verificationId,
      expiresAt: verificationResult.expiresAt,
      timeLeft: verificationResult.timeLeft
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send verification code'
    });
  }
});

// Проверка кода верификации и создание записи
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and code are required'
      });
    }

    const formattedEmail = verificationService.formatEmail(email);

    // Проверяем код
    const verificationResult = await verificationService.verifyCode(formattedEmail, code);

    if (!verificationResult.success) {
      return res.status(400).json({
        error: 'Verification failed',
        message: verificationResult.message,
        code: verificationResult.code,
        remainingAttempts: verificationResult.remainingAttempts
      });
    }

    // Находим заявку по email
    const appointmentRequest = await AppointmentRequest.findByEmail(formattedEmail);
    if (!appointmentRequest) {
      return res.status(404).json({
        error: 'Appointment request not found',
        message: 'Заявка не найдена или истекла'
      });
    }

    // Создаем запись в Renovatio
    const renovatioAppointmentData = {
      first_name: appointmentRequest.firstName,
      last_name: appointmentRequest.lastName,
      third_name: appointmentRequest.thirdName,
      mobile: appointmentRequest.phone,
      email: appointmentRequest.email,
      birth_date: appointmentRequest.birthDate,
      gender: appointmentRequest.gender,
      doctor_id: appointmentRequest.doctorId,
      clinic_id: appointmentRequest.clinicId,
      time_start: appointmentRequest.timeStart,
      time_end: appointmentRequest.timeEnd,
      comment: appointmentRequest.comment,
      channel: appointmentRequest.channel,
      source: appointmentRequest.source,
      type: appointmentRequest.type,
      is_outside: appointmentRequest.isOutside ? 1 : 2,
      is_telemedicine: appointmentRequest.isTelemedicine ? 1 : 2,
      check_intersection: 1
    };

    // Добавляем услуги если указаны
    if (appointmentRequest.serviceId) {
      renovatioAppointmentData.services = JSON.stringify([{
        service_id: appointmentRequest.serviceId,
        count: 1,
        discount: 0
      }]);
    }

    let renovatioAppointmentId = null;
    try {
      renovatioAppointmentId = await renovatioService.createAppointment(renovatioAppointmentData);
    } catch (renovatioError) {
      console.error('Renovatio appointment creation failed:', renovatioError);
      return res.status(500).json({
        error: 'Failed to create appointment in Renovatio',
        message: 'Ошибка создания записи в системе. Попробуйте позже.'
      });
    }

    // Сохраняем в локальную БД
    const appointmentData = {
      userId: null, // Пользователь не зарегистрирован
      serviceId: appointmentRequest.serviceId,
      appointmentDate: new Date(appointmentRequest.timeStart),
      appointmentTime: appointmentRequest.timeStart,
      notes: appointmentRequest.comment,
      renovatioId: renovatioAppointmentId,
      renovatioStatus: 'upcoming',
      doctorId: appointmentRequest.doctorId,
      clinicId: appointmentRequest.clinicId
    };

    const appointment = await Appointment.createWithRenovatio(appointmentData);

    // Отправляем email с подтверждением записи
    try {
      await emailService.sendAppointmentConfirmation(appointmentRequest.email, {
        firstName: appointmentRequest.firstName,
        lastName: appointmentRequest.lastName,
        doctorName: 'Врач', // Можно получить из Renovatio
        clinicName: 'Клиника', // Можно получить из Renovatio
        date: appointmentRequest.timeStart.split(' ')[0],
        time: appointmentRequest.timeStart.split(' ')[1],
        serviceName: appointmentRequest.serviceId ? 'Услуга' : null
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Не блокируем процесс из-за ошибки email
    }

    // Удаляем временные данные
    await AppointmentRequest.delete(appointmentRequest.id);
    await VerificationCode.markAsUsed(verificationResult.verificationId);

    res.status(201).json({
      success: true,
      message: 'Запись на прием успешно создана',
      appointment: {
        id: appointment.id,
        renovatioId: renovatioAppointmentId,
        firstName: appointmentRequest.firstName,
        lastName: appointmentRequest.lastName,
        email: appointmentRequest.email,
        phone: appointmentRequest.phone,
        doctorId: appointmentRequest.doctorId,
        clinicId: appointmentRequest.clinicId,
        timeStart: appointmentRequest.timeStart,
        timeEnd: appointmentRequest.timeEnd,
        serviceId: appointmentRequest.serviceId,
        status: 'upcoming'
      }
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify code and create appointment'
    });
  }
});

// Получение статуса верификации
router.get('/status/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const formattedEmail = verificationService.formatEmail(email);

    const status = await verificationService.getVerificationStatus(formattedEmail);
    res.json(status);
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get verification status'
    });
  }
});

// Повторная отправка кода
router.post('/resend-code', emailRateLimit, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Missing email',
        message: 'Email is required'
      });
    }

    const formattedEmail = verificationService.formatEmail(email);
    const result = await verificationService.resendCode(formattedEmail);

    if (!result.success) {
      return res.status(400).json({
        error: 'Failed to resend code',
        message: result.message,
        timeLeft: result.timeLeft
      });
    }

    res.json({
      success: true,
      message: 'Код повторно отправлен на email',
      verificationId: result.verificationId,
      expiresAt: result.expiresAt,
      timeLeft: result.timeLeft
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to resend verification code'
    });
  }
});

// Получение статистики верификации (admin only)
router.get('/stats', async (req, res) => {
  try {
    const verificationStats = await VerificationCode.getStats();
    const requestStats = await AppointmentRequest.getStats();

    res.json({
      verification: verificationStats,
      requests: requestStats,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get verification stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get verification statistics'
    });
  }
});

// Очистка просроченных данных (admin only)
router.post('/cleanup', async (req, res) => {
  try {
    const expiredCodes = await verificationService.cleanupExpiredCodes();
    const expiredRequests = await verificationService.cleanupExpiredRequests();

    res.json({
      success: true,
      message: 'Cleanup completed',
      expiredCodes,
      expiredRequests,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to cleanup expired data'
    });
  }
});

module.exports = router;
