import apiClient from './api';

// API для работы с email-верификацией
class VerificationApi {
  // Отправка кода верификации
  async sendVerificationCode(appointmentData) {
    try {
      const response = await apiClient.post('/verification/send-code', appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Проверка кода верификации
  async verifyCode(email, code) {
    try {
      const response = await apiClient.post('/verification/verify-code', {
        email,
        code
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение статуса верификации
  async getVerificationStatus(email) {
    try {
      const response = await apiClient.get(`/verification/status/${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Повторная отправка кода
  async resendCode(email) {
    try {
      const response = await apiClient.post('/verification/resend-code', {
        email
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение статистики верификации (admin only)
  async getVerificationStats() {
    try {
      const response = await apiClient.get('/verification/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Очистка просроченных данных (admin only)
  async cleanupExpiredData() {
    try {
      const response = await apiClient.post('/verification/cleanup');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ВРЕМЕННО: Создание записи без верификации email
  async createAppointmentWithoutVerification(appointmentData) {
    try {
      const response = await apiClient.post('/verification/create-appointment', appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Создаем экземпляр API верификации
const verificationApi = new VerificationApi();

export default verificationApi;
