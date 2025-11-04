const axios = require('axios');

class RenovatioService {
  constructor() {
    this.baseUrl = 'https://app.rnova.org/api/public';
    this.apiKey = process.env.RENOVATIO_API_KEY;
    
    if (!this.apiKey) {
      console.warn('RENOVATIO_API_KEY not found in environment variables');
    }
  }

  async makeRequest(method, params = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('RENOVATIO_API_KEY is not configured');
      }

      const response = await axios.post(`${this.baseUrl}/${method}`, {
        api_key: this.apiKey,
        ...params
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000 // 30 seconds timeout
      });

      if (response.data.error === 1) {
        throw new Error(`Renovatio API Error: ${response.data.data.desc || 'Unknown error'}`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Renovatio API Error for method ${method}:`, error.message);
      throw error;
    }
  }

  // 1. Синхронизация услуг
  async getServices(params = {}) {
    return await this.makeRequest('getServices', {
      show_all: 1,
      show_deleted: 0,
      ...params
    });
  }

  async getServiceCategories(params = {}) {
    return await this.makeRequest('getServiceCategories', {
      show_deleted: 0,
      ...params
    });
  }

  // 2. Создание записи на прием
  async createAppointment(appointmentData) {
    return await this.makeRequest('createAppointment', appointmentData);
  }

  // 4. Получение расписания
  async getSchedule(params) {
    const defaultParams = {
      show_busy: 1,  // Показывать занятые слоты тоже (чтобы видеть is_busy)
      show_past: 0,  // Не показывать прошедшие
      step: 15       // фиксированное значение 15 минут
    };
    
    return await this.makeRequest('getSchedule', {
      ...defaultParams,
      ...params   // переопределяет параметры по умолчанию
    });
  }

  async getUsers(params = {}) {
    return await this.makeRequest('getUsers', {
      show_all: 1,
      show_deleted: 0,
      ...params
    });
  }

  async getClinics(params = {}) {
    return await this.makeRequest('getClinics', {
      show_all: 1,
      show_deleted: 0,
      ...params
    });
  }

  // Проверка статуса визита
  async checkAppointmentStatus(appointmentId) {
    return await this.makeRequest('checkAppointmentStatus', {
      appointment_id: appointmentId
    });
  }

  // Получение профессий врачей
  async getProfessions(params = {}) {
    return await this.makeRequest('getProfessions', {
      show_all: 1,
      show_deleted: 0,
      ...params
    });
  }

  // Получение типов визитов
  async getAppointmentTypes(params = {}) {
    return await this.makeRequest('getAppointmentTypes', {
      show_deleted: 0,
      ...params
    });
  }

  // Получение рекламных каналов
  async getAdvChannels(params = {}) {
    return await this.makeRequest('getAdvChannels', {
      show_deleted: 0,
      ...params
    });
  }

  // Отмена визита
  async cancelAppointment(appointmentId, comment = '') {
    return await this.makeRequest('cancelAppointment', {
      appointment_id: appointmentId,
      comment
    });
  }

  // Подтверждение визита
  async confirmAppointment(appointmentId) {
    return await this.makeRequest('confirmAppointment', {
      appointment_id: appointmentId
    });
  }

  // Получение визитов
  async getAppointments(params = {}) {
    return await this.makeRequest('getAppointments', {
      ...params
    });
  }

  // Получение пациентов
  async getPatient(params = {}) {
    return await this.makeRequest('getPatient', params);
  }

  // Создание пациента
  async createPatient(patientData) {
    return await this.makeRequest('createPatient', patientData);
  }

  // Создание задачи
  async createTask(taskData) {
    const params = {};
    
    // Обязательные и опциональные поля
    if (taskData.title) params.title = taskData.title;
    if (taskData.desc) params.desc = taskData.desc;
    if (taskData.patient_id) params.patient_id = taskData.patient_id;
    if (taskData.priority !== undefined) params.priority = taskData.priority; // 10, 20, 30
    if (taskData.user_id) params.user_id = taskData.user_id; // может быть строка с несколькими ID через запятую
    if (taskData.role_id) params.role_id = taskData.role_id; // может быть строка с несколькими ID через запятую
    if (taskData.to_all !== undefined) params.to_all = taskData.to_all; // 0 или 1
    if (taskData.clinic_id) params.clinic_id = taskData.clinic_id; // может быть строка с несколькими ID через запятую
    if (taskData.responsible_id) params.responsible_id = taskData.responsible_id;
    if (taskData.type !== undefined) params.type = taskData.type; // 1 - задание, 2 - звонок
    if (taskData.due_date) params.due_date = taskData.due_date; // dd.mm.yyyy
    if (taskData.due_time) params.due_time = taskData.due_time; // hh:mm
    if (taskData.send_notifications !== undefined) params.send_notifications = taskData.send_notifications; // 1 или 2
    if (taskData.source) params.source = taskData.source;

    return await this.makeRequest('createTask', params);
  }

  // Получение задач
  async getTasks(params = {}) {
    return await this.makeRequest('getTasks', params);
  }
}

module.exports = new RenovatioService();
