import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './AppointmentModal.css';
import './ConsultationModal.css';
import apiClient from '../services/api';

const ConsultationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    comment: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Email (опциональный)
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Неверный формат email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        phone: formData.phone,
        email: formData.email || undefined,
        comment: formData.comment || undefined
      });

      toast.success('Спасибо! Мы свяжемся с вами в ближайшее время.');
      
      // Очищаем форму
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        comment: ''
      });
      setErrors({});
      
      onClose();
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

        <div className="modal-header">
          <h2 className="modal-title">Получить консультацию</h2>
          <p className="consultation-subtitle">
            Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время
          </p>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Имя <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={errors.firstName ? 'error' : ''}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Введите имя"
                  disabled={isLoading}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Фамилия <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className={errors.lastName ? 'error' : ''}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Введите фамилию"
                  disabled={isLoading}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Телефон <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={errors.phone ? 'error' : ''}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 999-99-99"
                  disabled={isLoading}
                  autoComplete="tel"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className={errors.email ? 'error' : ''}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Комментарий</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Укажите тему консультации или вопросы"
                rows="3"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </button>
          <div className="btn-divider"></div>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Отправка...
              </>
            ) : (
              <>
                Отправить заявку
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M13 8l-4-4M13 8l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;

