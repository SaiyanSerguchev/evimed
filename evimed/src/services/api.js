import axios from 'axios';

// Базовый API клиент
class ApiClient {
  constructor() {
    // Определяем базовый URL API
    const getApiUrl = () => {
      // Проверяем есть ли переменная окружения
      if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
      }
      // Fallback на localhost
      return 'http://localhost:5000/api';
    };
    
    this.baseURL = getApiUrl();
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Интерцептор для обработки ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Сервер ответил с кодом ошибки
      return {
        message: error.response.data?.message || 'Ошибка сервера',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Запрос был отправлен, но ответа не было
      return {
        message: 'Ошибка сети. Проверьте подключение к интернету.',
        status: 0,
      };
    } else {
      // Что-то пошло не так при настройке запроса
      return {
        message: error.message || 'Неизвестная ошибка',
        status: 0,
      };
    }
  }

  // Базовые методы HTTP
  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(url, data = {}) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(url, data = {}) {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Методы для работы с сервисами
  async getServiceCategories() {
    return this.get('/service-categories');
  }

  async getServices(categoryId = null) {
    if (categoryId) {
      return this.get(`/services/category/${categoryId}`);
    }
    return this.get('/services');
  }

  async getServiceById(id) {
    return this.get(`/services/${id}`);
  }

  // Методы для работы с филиалами
  async getBranches() {
    return this.get('/branches');
  }

  // Методы для работы с записями
  async createAppointment(appointmentData) {
    return this.post('/appointments', appointmentData);
  }

  async getAppointments(userId = null) {
    if (userId) {
      return this.get(`/appointments/user/${userId}`);
    }
    return this.get('/appointments');
  }

  async getAppointmentById(id) {
    return this.get(`/appointments/${id}`);
  }

  async updateAppointment(id, data) {
    return this.put(`/appointments/${id}`, data);
  }

  async deleteAppointment(id) {
    return this.delete(`/appointments/${id}`);
  }

  // Методы для работы с пользователями
  async registerUser(userData) {
    return this.post('/auth/register', userData);
  }

  async loginUser(credentials) {
    return this.post('/auth/login', credentials);
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Методы для работы с баннерами
  async getBanners() {
    return this.get('/banners');
  }

  // Методы для работы с преимуществами
  async getAdvantages() {
    return this.get('/advantages');
  }
}

// Создаем экземпляр API клиента
const apiClient = new ApiClient();

export default apiClient;
