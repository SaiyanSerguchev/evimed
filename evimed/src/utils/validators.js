// Утилиты для валидации форм

// Валидация email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? '' : 'Введите корректный email адрес'
  };
};

// Валидация телефона
export const validatePhone = (phone) => {
  // Удаляем все символы кроме цифр
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Проверяем длину (7-15 цифр)
  const isValidLength = cleanPhone.length >= 7 && cleanPhone.length <= 15;
  
  return {
    isValid: isValidLength,
    message: isValidLength ? '' : 'Введите корректный номер телефона (7-15 цифр)'
  };
};

// Форматирование телефона
export const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11 && cleanPhone.startsWith('7')) {
    // Российский номер: +7 (999) 123-45-67
    return `+7 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7, 9)}-${cleanPhone.slice(9)}`;
  } else if (cleanPhone.length === 10) {
    // Российский номер без +7: (999) 123-45-67
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6, 8)}-${cleanPhone.slice(8)}`;
  }
  
  return phone; // Возвращаем как есть, если формат не распознан
};

// Валидация имени
export const validateName = (name) => {
  const trimmedName = name.trim();
  const isValidLength = trimmedName.length >= 2 && trimmedName.length <= 50;
  const hasValidChars = /^[а-яёА-ЯЁa-zA-Z\s\-']+$/.test(trimmedName);
  
  return {
    isValid: isValidLength && hasValidChars,
    message: !isValidLength 
      ? 'Имя должно содержать от 2 до 50 символов'
      : !hasValidChars 
        ? 'Имя может содержать только буквы, пробелы, дефисы и апострофы'
        : ''
  };
};

// Валидация ФИО
export const validateFullName = (firstName, lastName, thirdName = '') => {
  const firstNameValidation = validateName(firstName);
  const lastNameValidation = validateName(lastName);
  const thirdNameValidation = thirdName ? validateName(thirdName) : { isValid: true, message: '' };
  
  return {
    isValid: firstNameValidation.isValid && lastNameValidation.isValid && thirdNameValidation.isValid,
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    thirdName: thirdNameValidation
  };
};

// Валидация даты рождения
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { isValid: true, message: '' }; // Дата рождения не обязательна
  }
  
  const date = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, message: 'Введите корректную дату' };
  }
  
  if (age < 0 || age > 120) {
    return { isValid: false, message: 'Возраст должен быть от 0 до 120 лет' };
  }
  
  return { isValid: true, message: '' };
};

// Валидация комментария
export const validateComment = (comment) => {
  const trimmedComment = comment.trim();
  const isValidLength = trimmedComment.length <= 500;
  
  return {
    isValid: isValidLength,
    message: isValidLength ? '' : 'Комментарий не должен превышать 500 символов'
  };
};

// Валидация кода верификации
export const validateVerificationCode = (code) => {
  const cleanCode = code.replace(/\D/g, '');
  const isValidLength = cleanCode.length === 4;
  const isNumeric = /^\d{4}$/.test(cleanCode);
  
  return {
    isValid: isValidLength && isNumeric,
    message: !isValidLength 
      ? 'Код должен содержать 4 цифры'
      : !isNumeric 
        ? 'Код должен содержать только цифры'
        : ''
  };
};

// Валидация всей формы записи
export const validateAppointmentForm = (formData) => {
  const errors = {};
  
  // Валидация обязательных полей
  if (!formData.firstName) {
    errors.firstName = 'Имя обязательно для заполнения';
  } else {
    const firstNameValidation = validateName(formData.firstName);
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.message;
    }
  }
  
  if (!formData.lastName) {
    errors.lastName = 'Фамилия обязательна для заполнения';
  } else {
    const lastNameValidation = validateName(formData.lastName);
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.message;
    }
  }
  
  if (!formData.email) {
    errors.email = 'Email обязателен для заполнения';
  } else {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }
  }
  
  if (!formData.phone) {
    errors.phone = 'Телефон обязателен для заполнения';
  } else {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }
  
  // Валидация опциональных полей
  if (formData.thirdName) {
    const thirdNameValidation = validateName(formData.thirdName);
    if (!thirdNameValidation.isValid) {
      errors.thirdName = thirdNameValidation.message;
    }
  }
  
  if (formData.birthDate) {
    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.isValid) {
      errors.birthDate = birthDateValidation.message;
    }
  }
  
  if (formData.comment) {
    const commentValidation = validateComment(formData.comment);
    if (!commentValidation.isValid) {
      errors.comment = commentValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Санитизация данных формы
export const sanitizeFormData = (formData) => {
  return {
    firstName: formData.firstName?.trim() || '',
    lastName: formData.lastName?.trim() || '',
    thirdName: formData.thirdName?.trim() || '',
    email: formData.email?.trim().toLowerCase() || '',
    phone: formData.phone?.trim() || '',
    birthDate: formData.birthDate || '',
    gender: formData.gender || null,
    comment: formData.comment?.trim() || ''
  };
};

// Форматирование данных для отправки на сервер
export const formatAppointmentData = (formData, selectedData) => {
  const sanitizedData = sanitizeFormData(formData);
  
  return {
    // Данные пациента
    first_name: sanitizedData.firstName,
    last_name: sanitizedData.lastName,
    third_name: sanitizedData.thirdName || null,
    email: sanitizedData.email,
    phone: sanitizedData.phone,
    birth_date: sanitizedData.birthDate || null,
    gender: sanitizedData.gender || null,
    
    // Данные записи
    doctor_id: selectedData.doctorId,
    clinic_id: selectedData.clinicId,
    service_id: selectedData.serviceId,
    time_start: selectedData.timeStart,
    time_end: selectedData.timeEnd,
    comment: sanitizedData.comment || null,
    
    // Дополнительные параметры
    channel: 'website',
    source: 'evimed',
    type: 'appointment',
    is_outside: false,
    is_telemedicine: false
  };
};
