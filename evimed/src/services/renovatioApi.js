import apiClient from './api';

// API для работы с Renovatio
class RenovatioApi {
  // Получение списка клиник
  async getClinics() {
    try {
      const response = await apiClient.get('/renovatio/clinics');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение списка врачей
  async getDoctors(clinicId = null) {
    try {
      const params = clinicId ? { clinic_id: clinicId } : {};
      const response = await apiClient.get('/renovatio/doctors', params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение расписания
  async getSchedule(params) {
    try {
      const {
        clinic_id,
        user_id,
        service_id,
        time_start,
        time_end,
        step = 30,
        show_busy = 0,
        show_past = 0
      } = params;

      const queryParams = {
        clinic_id,
        user_id,
        service_id,
        time_start,
        time_end,
        step,
        show_busy,
        show_past
      };

      // Удаляем undefined значения
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const response = await apiClient.get('/renovatio/schedule', queryParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение специальностей
  async getProfessions() {
    try {
      const response = await apiClient.get('/renovatio/professions');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение типов визитов
  async getAppointmentTypes() {
    try {
      const response = await apiClient.get('/renovatio/appointment-types');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение рекламных каналов
  async getChannels() {
    try {
      const response = await apiClient.get('/renovatio/channels');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Создание записи через Renovatio (admin only)
  async createAppointment(appointmentData) {
    try {
      const response = await apiClient.post('/appointments/renovatio', appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Проверка статуса записи в Renovatio
  async checkAppointmentStatus(appointmentId) {
    try {
      const response = await apiClient.get(`/appointments/${appointmentId}/renovatio-status`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Отмена записи в Renovatio (admin only)
  async cancelAppointment(appointmentId) {
    try {
      const response = await apiClient.post(`/renovatio/appointment/${appointmentId}/cancel`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Подтверждение записи в Renovatio (admin only)
  async confirmAppointment(appointmentId) {
    try {
      const response = await apiClient.post(`/renovatio/appointment/${appointmentId}/confirm`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение всех записей с интеграцией Renovatio
  async getAllRenovatioAppointments() {
    try {
      const response = await apiClient.get('/appointments/renovatio/all');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Синхронизация услуг (admin only)
  async syncServices() {
    try {
      const response = await apiClient.post('/renovatio/sync/services');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Ручной запуск синхронизации (admin only)
  async manualSync() {
    try {
      const response = await apiClient.post('/renovatio/sync/manual');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение статуса синхронизации (admin only)
  async getSyncStatus() {
    try {
      const response = await apiClient.get('/renovatio/sync/job-status');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Создаем экземпляр API Renovatio
const renovatioApi = new RenovatioApi();

export default renovatioApi;
