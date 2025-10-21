import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AppointmentModal.css';
import EmailVerificationModal from './EmailVerificationModal';
import SuccessStep from './SuccessStep';
import apiClient from '../services/api';
import renovatioApi from '../services/renovatioApi';
import verificationApi from '../services/verificationApi';
import { validateAppointmentForm, formatAppointmentData } from '../utils/validators';
import { handleApiError, handleAppointmentError } from '../utils/errorHandler';

const AppointmentModal = ({ isOpen, onClose, preselectedService = null }) => {
  // Состояние шагов
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояние выбранных данных
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(preselectedService);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Состояние данных формы
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    thirdName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: null,
    comment: ''
  });
  
  // Состояние загруженных данных
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Состояние верификации
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessStep, setShowSuccessStep] = useState(false);
  const [appointmentResult, setAppointmentResult] = useState(null);
  
  // Состояние ошибок
  const [errors, setErrors] = useState({});

  // Загрузка данных при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      // Если есть предвыбранная услуга, переходим к шагу 3
      if (preselectedService) {
        setCurrentStep(3);
        loadServicesForCategory(preselectedService.categoryId);
      }
    }
  }, [isOpen, preselectedService]);

  // Загрузка услуг при выборе категории
  useEffect(() => {
    if (selectedCategory) {
      loadServicesForCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  // Загрузка врачей при выборе клиники
  useEffect(() => {
    if (selectedClinic) {
      loadDoctors(selectedClinic.id);
    }
  }, [selectedClinic]);

  // Загрузка расписания при выборе врача и даты
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadSchedule();
    }
  }, [selectedDoctor, selectedDate]);

  // Загрузка начальных данных
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, clinicsData] = await Promise.all([
        apiClient.getServiceCategories(),
        renovatioApi.getClinics()
      ]);
      
      setCategories(categoriesData);
      setClinics(clinicsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      toast.error('Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка услуг для категории
  const loadServicesForCategory = async (categoryId) => {
    try {
      setIsLoading(true);
      const servicesData = await apiClient.getServices(categoryId);
      setServices(servicesData);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      toast.error('Не удалось загрузить услуги.');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка врачей для клиники
  const loadDoctors = async (clinicId) => {
    try {
      setIsLoading(true);
      const doctorsData = await renovatioApi.getDoctors(clinicId);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Ошибка загрузки врачей:', error);
      toast.error('Не удалось загрузить врачей.');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка расписания
  const loadSchedule = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      setIsLoading(true);
      const scheduleData = await renovatioApi.getSchedule({
        clinic_id: selectedClinic.id,
        user_id: selectedDoctor.id,
        service_id: selectedService?.id,
        time_start: `${selectedDate} 00:00:00`,
        time_end: `${selectedDate} 23:59:59`
      });
      
      setAvailableSlots(scheduleData);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
      toast.error('Не удалось загрузить расписание.');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчики навигации
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Обработчики выбора
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedService(null);
    setErrors({});
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setErrors({});
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTime(null);
    setAvailableSlots([]);
    setErrors({});
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setSelectedDoctor(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    setErrors({});
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableSlots([]);
    setErrors({});
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setErrors({});
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    // Валидация формы
    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Проверьте правильность заполнения полей');
      return;
    }

    // Проверка выбранных данных
    if (!selectedDoctor || !selectedClinic || !selectedDate || !selectedTime) {
      toast.error('Выберите врача, клинику, дату и время');
      return;
    }

    try {
      setIsLoading(true);
      
      // Форматируем данные для отправки
      const appointmentData = formatAppointmentData(formData, {
        doctorId: selectedDoctor.id,
        clinicId: selectedClinic.id,
        serviceId: selectedService?.id,
        timeStart: `${selectedDate} ${selectedTime}:00`,
        timeEnd: `${selectedDate} ${selectedTime}:30` // Предполагаем 30 минут
      });

      // Отправляем код верификации
      const response = await verificationApi.sendVerificationCode(appointmentData);
      
      if (response.success) {
        setShowVerificationModal(true);
        toast.success('Код подтверждения отправлен на ваш email');
      } else {
        toast.error(response.message || 'Не удалось отправить код подтверждения');
      }
    } catch (error) {
      const handledError = handleAppointmentError(error);
      toast.error(handledError.message);
      console.error('Ошибка отправки кода:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик успешной верификации
  const handleVerificationSuccess = (result) => {
    setShowVerificationModal(false);
    setAppointmentResult(result);
    setShowSuccessStep(true);
    toast.success('Запись успешно создана!');
  };

  // Обработчик закрытия модального окна
  const handleClose = () => {
    if (isLoading) return;
    
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedService(preselectedService);
    setSelectedDoctor(null);
    setSelectedClinic(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({
      firstName: '',
      lastName: '',
      thirdName: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: null,
      comment: ''
    });
    setErrors({});
    setShowVerificationModal(false);
    setShowSuccessStep(false);
    setAppointmentResult(null);
    onClose();
  };

  // Обработчик закрытия успешного экрана
  const handleSuccessClose = () => {
    setShowSuccessStep(false);
    handleClose();
  };

  // Отключение скролла при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Рендер шага 1 - Выбор категории
  const renderStep1 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Выберите категорию услуги</h2>
      {isLoading ? (
        <div className="loading-skeleton">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="service-card skeleton" />
          ))}
        </div>
      ) : (
        <div className="services-grid">
          {categories.map(category => (
            <div
              key={category.id}
              className={`service-card ${selectedCategory?.id === category.id ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              <div className="service-content">
                <h3 className="service-title">{category.name}</h3>
                <p className="service-description">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Рендер шага 2 - Выбор услуги
  const renderStep2 = () => {
    const filteredServices = services.filter(service => 
      service.categoryId === selectedCategory?.id
    );
    
    return (
      <div className="appointment-step">
        <h2 className="appointment-title">Выберите конкретную услугу</h2>
        {isLoading ? (
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="service-card skeleton" />
            ))}
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="service-content">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-price">
                    {service.price} ₽
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Рендер шага 3 - Выбор клиники и врача
  const renderStep3 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Выберите клинику и врача</h2>
      
      <div className="step3-content">
        <div className="clinics-section">
          <h3 className="section-title">Клиника</h3>
          {isLoading ? (
            <div className="loading-skeleton">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="clinic-card skeleton" />
              ))}
            </div>
          ) : (
            <div className="clinics-list">
              {clinics.map(clinic => (
                <div
                  key={clinic.id}
                  className={`clinic-card ${selectedClinic?.id === clinic.id ? 'selected' : ''}`}
                  onClick={() => handleClinicSelect(clinic)}
                >
                  <div className="clinic-info">
                    <h4 className="clinic-name">{clinic.title}</h4>
                    <p className="clinic-address">{clinic.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="doctors-section">
          <h3 className="section-title">Врач</h3>
          {isLoading ? (
            <div className="loading-skeleton">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="doctor-card skeleton" />
              ))}
            </div>
          ) : (
            <div className="doctors-list">
              {doctors.map(doctor => (
                <div
                  key={doctor.id}
                  className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="doctor-info">
                    <h4 className="doctor-name">
                      {doctor.last_name} {doctor.first_name} {doctor.third_name}
                    </h4>
                    <p className="doctor-specialty">{doctor.profession}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Рендер шага 4 - Выбор даты и времени
  const renderStep4 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Выберите дату и время</h2>
      
      <div className="step4-content">
        <div className="date-section">
          <h3 className="section-title">Дата</h3>
          <div className="date-picker">
            <input
              type="date"
              className="date-input"
              value={selectedDate || ''}
              onChange={(e) => handleDateSelect(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="time-section">
          <h3 className="section-title">Время</h3>
          {isLoading ? (
            <div className="loading-skeleton">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="time-slot skeleton" />
              ))}
            </div>
          ) : (
            <div className="time-slots">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  className={`time-slot ${selectedTime === slot.time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Рендер шага 5 - Контактные данные
  const renderStep5 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Ваши контактные данные</h2>
      
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Имя *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? 'error' : ''}
              required
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Фамилия *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? 'error' : ''}
              required
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="thirdName">Отчество</label>
          <input
            type="text"
            id="thirdName"
            name="thirdName"
            value={formData.thirdName}
            onChange={handleInputChange}
            className={errors.thirdName ? 'error' : ''}
          />
          {errors.thirdName && <span className="error-message">{errors.thirdName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            required
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Пол</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
            >
              <option value="">Не указан</option>
              <option value="1">Мужской</option>
              <option value="2">Женский</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Комментарий</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className={errors.comment ? 'error' : ''}
            rows="4"
          />
          {errors.comment && <span className="error-message">{errors.comment}</span>}
        </div>
      </div>

      <div className="appointment-summary">
        <h3 className="summary-title">Сводка записи</h3>
        <div className="summary-item">
          <span className="summary-label">Категория:</span>
          <span className="summary-value">{selectedCategory?.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Услуга:</span>
          <span className="summary-value">{selectedService?.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Клиника:</span>
          <span className="summary-value">{selectedClinic?.title}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Врач:</span>
          <span className="summary-value">
            {selectedDoctor ? `${selectedDoctor.last_name} ${selectedDoctor.first_name}` : ''}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Дата и время:</span>
          <span className="summary-value">{selectedDate} в {selectedTime}</span>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <button className="modal-close" onClick={handleClose} disabled={isLoading}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h1 className="modal-title">Записаться на прием</h1>
            <div className="progress-bar">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`progress-step ${currentStep >= step ? (currentStep === step ? 'half-active' : 'active') : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="modal-body">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={currentStep === 1 ? handleClose : handleBack}
              disabled={isLoading}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Назад
            </button>
            <div className="btn-divider"></div>
            <button
              className="btn btn-primary"
              onClick={currentStep === 5 ? handleSubmit : handleNext}
              disabled={
                isLoading ||
                (currentStep === 1 && !selectedCategory) ||
                (currentStep === 2 && !selectedService) ||
                (currentStep === 3 && (!selectedClinic || !selectedDoctor)) ||
                (currentStep === 4 && (!selectedDate || !selectedTime)) ||
                (currentStep === 5 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
              }
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Загрузка...
                </>
              ) : currentStep === 5 ? (
                'Отправить код подтверждения'
              ) : (
                'Далее'
              )}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно верификации */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={formData.email}
        appointmentData={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          thirdName: formData.thirdName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          doctorId: selectedDoctor?.id,
          clinicId: selectedClinic?.id,
          serviceId: selectedService?.id,
          timeStart: `${selectedDate} ${selectedTime}:00`,
          timeEnd: `${selectedDate} ${selectedTime}:30`,
          comment: formData.comment
        }}
        onSuccess={handleVerificationSuccess}
      />

      {/* Экран успеха */}
      {showSuccessStep && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <SuccessStep
              appointmentData={appointmentResult}
              onClose={handleSuccessClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentModal;