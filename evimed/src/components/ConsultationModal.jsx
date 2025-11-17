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

    // Согласие на обработку данных
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Необходимо согласие на обработку данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsLoading(true);

    try {
      // Создаем запрос на консультацию через backend
      await apiClient.post('/consultation-requests', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        thirdName: formData.thirdName || undefined,
        phone: formData.phone,
        birthDate: formData.birthDate || undefined,
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
              <h2 className="modal-title">Записаться на консультацию</h2>
            </div>

            <div className="modal-body">
          <div className="appointment-step step5">
            <h2 className="appointment-title step5-title">Контактная информация</h2>
            
            <div className="step5-form">
              <div className="step5-form-row">
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
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`step5-input step5-date-input ${errors.birthDate ? 'error' : ''} ${!formData.birthDate ? 'empty' : ''}`}
                    disabled={isLoading}
                  />
                  {!formData.birthDate && (
                    <span className="step5-date-placeholder">Дата рождения</span>
                  )}
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
                  <span>Записаться на консультацию</span>
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

