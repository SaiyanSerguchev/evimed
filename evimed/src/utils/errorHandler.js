// Централизованная обработка ошибок

// Коды ошибок и их описания
const ERROR_MESSAGES = {
  // Ошибки сети
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  TIMEOUT_ERROR: 'Превышено время ожидания ответа от сервера.',
  
  // Ошибки валидации
  VALIDATION_ERROR: 'Проверьте правильность заполнения полей.',
  INVALID_EMAIL: 'Введите корректный email адрес.',
  INVALID_PHONE: 'Введите корректный номер телефона.',
  INVALID_NAME: 'Имя может содержать только буквы.',
  
  // Ошибки верификации
  VERIFICATION_CODE_INVALID: 'Неверный код подтверждения.',
  VERIFICATION_CODE_EXPIRED: 'Код подтверждения истек. Запросите новый код.',
  VERIFICATION_MAX_ATTEMPTS: 'Превышено максимальное количество попыток. Запросите новый код.',
  VERIFICATION_RATE_LIMIT: 'Слишком много запросов. Попробуйте позже.',
  
  // Ошибки записи
  APPOINTMENT_CONFLICT: 'Выбранное время уже занято. Выберите другое время.',
  APPOINTMENT_NOT_FOUND: 'Запись не найдена.',
  APPOINTMENT_CREATION_FAILED: 'Не удалось создать запись. Попробуйте позже.',
  
  // Ошибки сервера
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Недостаточно прав для выполнения операции.',
  NOT_FOUND: 'Запрашиваемый ресурс не найден.',
  
  // Ошибки Renovatio
  RENOVATIO_API_ERROR: 'Ошибка интеграции с системой записи.',
  RENOVATIO_CONNECTION_ERROR: 'Не удалось подключиться к системе записи.',
  RENOVATIO_SYNC_ERROR: 'Ошибка синхронизации данных.',
  
  // Общие ошибки
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
  FORM_INCOMPLETE: 'Заполните все обязательные поля.',
  REQUIRED_FIELD: 'Это поле обязательно для заполнения.'
};

// Получение сообщения об ошибке по коду
export const getErrorMessage = (errorCode, defaultMessage = null) => {
  return ERROR_MESSAGES[errorCode] || defaultMessage || ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Обработка ошибок API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Если это уже обработанная ошибка
  if (error.message && error.status !== undefined) {
    return {
      message: error.message,
      status: error.status,
      code: error.code || 'API_ERROR',
      data: error.data
    };
  }
  
  // Обработка ошибок axios
  if (error.response) {
    const { status, data } = error.response;
    
    // Специфичные ошибки по статусу
    switch (status) {
      case 400:
        return {
          message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          status: 400,
          code: 'VALIDATION_ERROR',
          data
        };
      
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status: 401,
          code: 'UNAUTHORIZED',
          data
        };
      
      case 403:
        return {
          message: ERROR_MESSAGES.FORBIDDEN,
          status: 403,
          code: 'FORBIDDEN',
          data
        };
      
      case 404:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          status: 404,
          code: 'NOT_FOUND',
          data
        };
      
      case 409:
        return {
          message: ERROR_MESSAGES.APPOINTMENT_CONFLICT,
          status: 409,
          code: 'APPOINTMENT_CONFLICT',
          data
        };
      
      case 429:
        return {
          message: ERROR_MESSAGES.VERIFICATION_RATE_LIMIT,
          status: 429,
          code: 'RATE_LIMIT',
          data
        };
      
      case 500:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          status: 500,
          code: 'SERVER_ERROR',
          data
        };
      
      default:
        return {
          message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
          status,
          code: 'API_ERROR',
          data
        };
    }
  }
  
  // Ошибки сети
  if (error.request) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }
  
  // Ошибки таймаута
  if (error.code === 'ECONNABORTED') {
    return {
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      status: 0,
      code: 'TIMEOUT_ERROR'
    };
  }
  
  // Неизвестные ошибки
  return {
    message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    status: 0,
    code: 'UNKNOWN_ERROR'
  };
};

// Обработка ошибок верификации
export const handleVerificationError = (error) => {
  const handledError = handleApiError(error);
  
  // Специфичные коды ошибок верификации
  if (handledError.data?.code) {
    switch (handledError.data.code) {
      case 'CODE_NOT_FOUND':
        return {
          ...handledError,
          message: ERROR_MESSAGES.VERIFICATION_CODE_EXPIRED,
          code: 'CODE_EXPIRED'
        };
      
      case 'INVALID_CODE':
        return {
          ...handledError,
          message: ERROR_MESSAGES.VERIFICATION_CODE_INVALID,
          code: 'INVALID_CODE'
        };
      
      case 'MAX_ATTEMPTS_EXCEEDED':
        return {
          ...handledError,
          message: ERROR_MESSAGES.VERIFICATION_MAX_ATTEMPTS,
          code: 'MAX_ATTEMPTS'
        };
      
      default:
        return handledError;
    }
  }
  
  return handledError;
};

// Обработка ошибок записи
export const handleAppointmentError = (error) => {
  const handledError = handleApiError(error);
  
  // Специфичные коды ошибок записи
  if (handledError.data?.code) {
    switch (handledError.data.code) {
      case 'APPOINTMENT_CONFLICT':
        return {
          ...handledError,
          message: ERROR_MESSAGES.APPOINTMENT_CONFLICT,
          code: 'CONFLICT'
        };
      
      case 'RENOVATIO_ERROR':
        return {
          ...handledError,
          message: ERROR_MESSAGES.RENOVATIO_API_ERROR,
          code: 'RENOVATIO_ERROR'
        };
      
      default:
        return handledError;
    }
  }
  
  return handledError;
};

// Логирование ошибок
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    message: error.message,
    status: error.status,
    code: error.code,
    stack: error.stack
  };
  
  console.error('Error Log:', errorInfo);
  
  // В продакшене можно отправлять ошибки в систему мониторинга
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTracking(errorInfo);
  }
};

// Создание пользовательских ошибок
export const createError = (message, code = 'CUSTOM_ERROR', status = 0) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
};

// Проверка является ли ошибка критической
export const isCriticalError = (error) => {
  const criticalCodes = [
    'SERVER_ERROR',
    'RENOVATIO_CONNECTION_ERROR',
    'NETWORK_ERROR',
    'TIMEOUT_ERROR'
  ];
  
  return criticalCodes.includes(error.code);
};

// Проверка можно ли повторить операцию
export const isRetryableError = (error) => {
  const retryableCodes = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR'
  ];
  
  return retryableCodes.includes(error.code);
};

// Получение рекомендаций по исправлению ошибки
export const getErrorRecommendations = (error) => {
  const recommendations = {
    'NETWORK_ERROR': 'Проверьте подключение к интернету и попробуйте снова.',
    'TIMEOUT_ERROR': 'Попробуйте повторить операцию через несколько минут.',
    'VERIFICATION_RATE_LIMIT': 'Подождите минуту перед повторной отправкой кода.',
    'APPOINTMENT_CONFLICT': 'Выберите другое время для записи.',
    'VALIDATION_ERROR': 'Проверьте правильность заполнения всех полей.',
    'SERVER_ERROR': 'Попробуйте повторить операцию позже или обратитесь в поддержку.'
  };
  
  return recommendations[error.code] || 'Попробуйте повторить операцию позже.';
};
