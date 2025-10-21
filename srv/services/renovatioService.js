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
    return await this.makeRequest('getSchedule', {
      show_busy: 0,
      show_past: 0,
      step: 30,
      ...params
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
}

module.exports = new RenovatioService();
