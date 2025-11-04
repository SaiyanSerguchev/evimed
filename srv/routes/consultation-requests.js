const express = require('express');
const router = express.Router();
const renovatioService = require('../services/renovatioService');

// Создание запроса на консультацию
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, comment } = req.body;

    // Валидация
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Пожалуйста, заполните все обязательные поля'
      });
    }

    // Валидация телефона
    const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        error: 'Invalid phone format',
        message: 'Неверный формат телефона'
      });
    }

    // Получаем клиники для привязки задачи
    const clinics = await renovatioService.getClinics({ show_all: 1, show_deleted: 0 });

    if (!clinics || clinics.length === 0) {
      return res.status(500).json({
        error: 'No clinics available',
        message: 'Нет доступных клиник'
      });
    }

    const defaultClinic = clinics[0];

    // Форматируем срок выполнения - завтра в 10:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDate = `${String(tomorrow.getDate()).padStart(2, '0')}.${String(tomorrow.getMonth() + 1).padStart(2, '0')}.${tomorrow.getFullYear()}`;
    const dueTime = '10:00';

    // Формируем описание задачи
    const taskDescription = `Запрос на консультацию от нового клиента

Контакты:
Имя: ${firstName} ${lastName}
Телефон: ${phone}${email ? `\nEmail: ${email}` : ''}

Комментарий:
${comment || 'Не указан'}

Источник: Форма консультации на сайте`;

    // Создаем задачу в Renovatio
    const taskData = {
      title: `Консультация: ${firstName} ${lastName}`,
      desc: taskDescription,
      priority: 30, // Высокий приоритет для новых клиентов
      type: 2, // Звонок
      clinic_id: defaultClinic.id,
      due_date: dueDate,
      due_time: dueTime,
      send_notifications: 1, // Отправлять уведомления
      source: 'Сайт - форма консультации',
      to_all: 0 // Назначается конкретным исполнителям
      // Опционально: можно указать user_id или role_id для конкретного назначения
      // user_id: '123', // ID конкретного менеджера
      // role_id: '5', // ID роли "Менеджер"
    };

    console.log('Creating consultation task:', taskData);

    const taskId = await renovatioService.createTask(taskData);

    console.log('Consultation task created successfully:', taskId);

    res.status(201).json({
      success: true,
      taskId: taskId,
      message: 'Запрос на консультацию успешно создан'
    });
  } catch (error) {
    console.error('Create consultation request error:', error);
    
    // Детальная обработка ошибок
    let errorMessage = 'Не удалось создать запрос. Попробуйте позже.';
    
    if (error.message?.includes('RENOVATIO_API_KEY')) {
      errorMessage = 'Сервис временно недоступен';
    } else if (error.response?.data?.data?.desc) {
      errorMessage = error.response.data.data.desc;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({
      error: 'Failed to create consultation request',
      message: errorMessage
    });
  }
});

module.exports = router;

