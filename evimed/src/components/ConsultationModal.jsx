import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AppointmentModal.css';
import './ConsultationModal.css';
import apiClient from '../services/api';

const ConsultationModal = ({ isOpen, onClose, initialComment = '' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    thirdName: '',
    phone: '',
    birthDate: '',
    comment: '',
    privacyConsent: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);

  // Отключение скролла при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию скролла только если она еще не сохранена
      const existingScrollY = document.body.getAttribute('data-scroll-y');
      if (!existingScrollY) {
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        // Блокируем скролл на html и body
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.top = `-${scrollY}px`;
        document.documentElement.style.left = `-${scrollX}px`;
        document.documentElement.style.width = '100%';
        document.documentElement.style.overflow = 'hidden';
        
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = `-${scrollX}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        // Сохраняем позицию скролла в data-атрибуте для восстановления
        document.body.setAttribute('data-scroll-y', scrollY.toString());
        document.body.setAttribute('data-scroll-x', scrollX.toString());
      }
    } else {
      // Восстанавливаем позицию скролла только если это последнее модальное окно
      // Проверяем, нет ли других открытых модальных окон (AppointmentModal)
      const appointmentModal = document.querySelector('.appointment-step');
      
      if (!appointmentModal) {
        const scrollY = document.body.getAttribute('data-scroll-y') || '0';
        const scrollX = document.body.getAttribute('data-scroll-x') || '0';
        
        // Восстанавливаем стили
        document.documentElement.style.position = '';
        document.documentElement.style.top = '';
        document.documentElement.style.left = '';
        document.documentElement.style.width = '';
        document.documentElement.style.overflow = '';
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Удаляем data-атрибуты
        document.body.removeAttribute('data-scroll-y');
        document.body.removeAttribute('data-scroll-x');
        
        // Восстанавливаем позицию скролла
        window.scrollTo(parseInt(scrollX), parseInt(scrollY));
      }
    }

    return () => {
      // Очистка при размонтировании только если нет других модальных окон
      const appointmentModal = document.querySelector('.appointment-step');
      
      if (!appointmentModal) {
        document.documentElement.style.position = '';
        document.documentElement.style.top = '';
        document.documentElement.style.left = '';
        document.documentElement.style.width = '';
        document.documentElement.style.overflow = '';
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        document.body.removeAttribute('data-scroll-y');
        document.body.removeAttribute('data-scroll-x');
      }
    };
  }, [isOpen]);

  // Установка начального комментария при открытии
  useEffect(() => {
    if (isOpen && initialComment) {
      setFormData(prev => ({
        ...prev,
        comment: initialComment
      }));
    }
  }, [isOpen, initialComment]);

  // Очистка формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        thirdName: '',
        phone: '',
        birthDate: '',
        comment: '',
        privacyConsent: false
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Функция для форматирования даты в формат дд.мм.гггг
  const formatBirthDate = (value) => {
    // Удаляем все символы, кроме цифр
    const numbers = value.replace(/\D/g, '');
    
    // Ограничиваем длину до 8 цифр
    const limitedNumbers = numbers.slice(0, 8);
    
    // Форматируем в дд.мм.гггг
    let formatted = '';
    for (let i = 0; i < limitedNumbers.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '.';
      }
      formatted += limitedNumbers[i];
    }
    
    return formatted;
  };

  // Функция для валидации даты в формате дд.мм.гггг
  const validateBirthDateFormat = (dateString) => {
    if (!dateString) return { isValid: true, message: '' };
    
    // Проверяем формат дд.мм.гггг
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      return { isValid: false, message: 'Дата должна быть в формате дд.мм.гггг' };
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Проверяем диапазоны
    if (day < 1 || day > 31) {
      return { isValid: false, message: 'День должен быть от 01 до 31' };
    }
    
    if (month < 1 || month > 12) {
      return { isValid: false, message: 'Месяц должен быть от 01 до 12' };
    }
    
    if (year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, message: `Год должен быть от 1900 до ${new Date().getFullYear()}` };
    }
    
    // Проверяем, что дата валидна (например, 31.02.2024 не существует)
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return { isValid: false, message: 'Неверная дата' };
    }
    
    // Проверяем, что дата не в будущем
    if (date > new Date()) {
      return { isValid: false, message: 'Дата рождения не может быть в будущем' };
    }
    
    return { isValid: true, message: '' };
  };

  // Конвертация даты из формата дд.мм.гггг в YYYY-MM-DD
  const convertBirthDateToISO = (dateString) => {
    if (!dateString) return null;
    
    // Если уже в формате YYYY-MM-DD, возвращаем как есть
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Если в формате дд.мм.гггг, конвертируем
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (match) {
      const day = match[1];
      const month = match[2];
      const year = match[3];
      return `${year}-${month}-${day}`;
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    // Имя
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Минимум 2 символа';
    } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Только буквы';
    }

    // Фамилия
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Минимум 2 символа';
    } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Только буквы';
    }

    // Телефон
    const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }

    // Дата рождения (опциональное поле, но если заполнено - валидируем)
    if (formData.birthDate) {
      const birthDateValidation = validateBirthDateFormat(formData.birthDate);
      if (!birthDateValidation.isValid) {
        newErrors.birthDate = birthDateValidation.message;
      }
    }

    // Согласие на обработку данных
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Необходимо согласие на обработку данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Для поля birthDate применяем маску форматирования
    if (name === 'birthDate' && type !== 'checkbox') {
      const formatted = formatBirthDate(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      
      // Валидируем формат в реальном времени
      if (formatted.length === 10) {
        const validation = validateBirthDateFormat(formatted);
        if (!validation.isValid) {
          setErrors(prev => ({
            ...prev,
            [name]: validation.message
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      } else {
        // Очищаем ошибку, если формат еще не полный
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      // Очищаем ошибку при вводе
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsLoading(true);

    try {
      // Конвертируем дату рождения из дд.мм.гггг в YYYY-MM-DD для API
      const birthDateISO = formData.birthDate ? convertBirthDateToISO(formData.birthDate) : undefined;
      
      // Создаем запрос на консультацию через backend
      await apiClient.post('/consultation-requests', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        thirdName: formData.thirdName || undefined,
        phone: formData.phone,
        birthDate: birthDateISO,
        comment: formData.comment || undefined
      });

      // Показываем экран успеха
      setShowSuccess(true);
    } catch (error) {
      console.error('Consultation request error:', error);
      
      const errorMessage = error.response?.data?.message || 'Не удалось отправить запрос. Попробуйте позже.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {showSuccess ? (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Спасибо за заявку</h2>
            </div>

            <div className="modal-body">
              <div className="appointment-step step5">
                <div className="consultation-success-content">
                  <h3 className="consultation-success-subtitle">Мы свяжемся с вами в ближайшее время</h3>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={onClose}
                style={{ flex: 1, justifyContent: 'center', paddingLeft: 0, paddingRight: 0 }}
              >
                <div className="text-btn-wrapper" style={{ width: 'auto', justifyContent: 'center' }}>
                  <span>Закрыть</span>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">
                {window.innerWidth <= 480 ? 'Записаться' : 'Записаться на консультацию'}
              </h2>
            </div>

            <div className="modal-body">
          <div className="appointment-step step5">
            <h2 className="appointment-title step5-title">Контактная информация</h2>
            
            <div className="step5-form">
              <div className="step5-form-row">
                <div className="step5-form-group">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Введите Фамилию"
                    className={`step5-input ${errors.lastName ? 'error' : ''}`}
                    disabled={isLoading}
                    required
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>

                <div className="step5-form-group">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Введите Имя"
                    className={`step5-input ${errors.firstName ? 'error' : ''}`}
                    disabled={isLoading}
                    required
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
              </div>

              <div className="step5-form-row">
                <div className="step5-form-group">
                  <input
                    type="text"
                    id="thirdName"
                    name="thirdName"
                    value={formData.thirdName}
                    onChange={handleChange}
                    placeholder="Введите Отчество"
                    className={`step5-input ${errors.thirdName ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.thirdName && <span className="error-message">{errors.thirdName}</span>}
                </div>
                <div className="step5-form-group"></div>
              </div>

              <div className="step5-form-row">
                <div className="step5-form-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ваш телефон"
                    className={`step5-input ${errors.phone ? 'error' : ''}`}
                    disabled={isLoading}
                    required
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="step5-form-group step5-date-group">
                  <input
                    type="text"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="Дата рождения"
                    className={`step5-input ${errors.birthDate ? 'error' : ''}`}
                    disabled={isLoading}
                    maxLength={10}
                  />
                  <input
                    type="date"
                    id="birthDatePicker"
                    className={`step5-date-picker-hidden ${isBirthDatePickerOpen ? 'active' : ''}`}
                    value={formData.birthDate && /^\d{2}\.\d{2}\.\d{4}$/.test(formData.birthDate) 
                      ? (() => {
                          const [day, month, year] = formData.birthDate.split('.');
                          return `${year}-${month}-${day}`;
                        })()
                      : formData.birthDate}
                    onChange={(e) => {
                      // Конвертируем из YYYY-MM-DD в дд.мм.гггг
                      if (e.target.value) {
                        const [year, month, day] = e.target.value.split('-');
                        const formatted = `${day}.${month}.${year}`;
                        handleChange({ target: { name: 'birthDate', value: formatted, type: 'text' } });
                      } else {
                        handleChange({ target: { name: 'birthDate', value: '', type: 'text' } });
                      }
                      setIsBirthDatePickerOpen(false);
                    }}
                  />
                  <button
                    type="button"
                    className="step5-date-picker-button"
                    onClick={() => {
                      setIsBirthDatePickerOpen(true);
                      document.getElementById('birthDatePicker')?.showPicker?.() || document.getElementById('birthDatePicker')?.click();
                    }}
                    tabIndex={-1}
                    disabled={isLoading}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.8 2.4H12V1.6C12 1.17565 11.6314 0.8 11.2 0.8C10.7686 0.8 10.4 1.17565 10.4 1.6V2.4H5.6V1.6C5.6 1.17565 5.23137 0.8 4.8 0.8C4.36863 0.8 4 1.17565 4 1.6V2.4H3.2C2.31634 2.4 1.6 3.11634 1.6 4V12.8C1.6 13.6837 2.31634 14.4 3.2 14.4H12.8C13.6837 14.4 14.4 13.6837 14.4 12.8V4C14.4 3.11634 13.6837 2.4 12.8 2.4ZM12.8 12.8H3.2V6.4H12.8V12.8ZM3.2 5.6V4H4V4.8C4 5.22435 4.36863 5.6 4.8 5.6C5.23137 5.6 5.6 5.22435 5.6 4.8V4H10.4V4.8C10.4 5.22435 10.7686 5.6 11.2 5.6C11.6314 5.6 12 5.22435 12 4.8V4H12.8V5.6H3.2Z" fill="rgba(24, 37, 61, 0.32)"/>
                    </svg>
                  </button>
                  {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
                </div>
              </div>

              <div className="step5-form-group step5-comment-group">
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Комментарий (необязательно)"
                  className={`step5-input step5-textarea ${errors.comment ? 'error' : ''}`}
                  disabled={isLoading}
                  rows={3}
                />
                {errors.comment && <span className="error-message">{errors.comment}</span>}
              </div>

              <div className="step5-divider"></div>

              <div className="step5-checkbox-wrapper">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleChange}
                  className="step5-checkbox"
                  disabled={isLoading}
                  required
                />
                <label htmlFor="privacyConsent" className="step5-checkbox-label">
                  Я согласен на обработку персональных данных согласно политике конфиденциальности
                </label>
              </div>
              {errors.privacyConsent && <span className="error-message">{errors.privacyConsent}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            <div className="text-btn-wrapper">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Назад</span>
            </div>
          </button>
          <div className="btn-divider"></div>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <div className="text-btn-wrapper">
              {isLoading ? (
                <>
                  <div className="spinner" />
                  <span>Загрузка...</span>
                </>
              ) : (
                <>
                  <span>{window.innerWidth <= 480 ? 'Записаться' : 'Записаться на консультацию'}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;

