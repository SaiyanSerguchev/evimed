import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import './AppointmentModal.css';
import './SuccessStep.css';
import EmailVerificationModal from './EmailVerificationModal';
import ConsultationModal from './ConsultationModal';
import apiClient from '../services/api';
import renovatioApi from '../services/renovatioApi';
import verificationApi from '../services/verificationApi';
import { validateAppointmentForm, formatAppointmentData } from '../utils/validators';
import { handleApiError, handleAppointmentError } from '../utils/errorHandler';

// Импорт изображений для карточек
import modalImg1 from '../assets/images/modal/IMG-1.png';
import modalImg2 from '../assets/images/modal/IMG-2.png';
import modalImg3 from '../assets/images/modal/IMG-3.png';

// Компонент карточки услуги с тултипом (показывается только если текст обрезан)
const ServiceCardStep2 = ({ service, isSelected, serviceImage, onClick }) => {
  const titleRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      // Проверяем, обрезан ли текст
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [service.name]);

  return (
    <div
      className={`service-card-step2 ${isSelected ? 'selected' : ''} ${!serviceImage ? 'no-image' : ''}`}
      onClick={onClick}
    >
      <div className="service-card-step2-wrapper">
        <div className="service-content-step2">
          <div className="service-title-wrapper">
            <h3 ref={titleRef} className="service-title-step2">{service.name}</h3>
            {isTruncated && <div className="service-tooltip">{service.name}</div>}
          </div>
        </div>
        {serviceImage && (
          <div className="service-image-step2">
            <img src={serviceImage} alt={service.name} />
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [hasReferral, setHasReferral] = useState(null); // Для ЛОР исследований
  const [isConsultationSelected, setIsConsultationSelected] = useState(false); // Для карточки консультации
  
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
  const [appointmentResult, setAppointmentResult] = useState(null);
  
  // Состояние модального окна консультации
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationComment, setConsultationComment] = useState('');
  
  // Состояние ошибок
  const [errors, setErrors] = useState({});
  
  // Состояние открытия dropdown времени
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  
  // Состояние для date picker даты рождения
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);

  // Проверка, требует ли услуга клинику "Ленина 1"
  const requiresLeninaClinic = (service) => {
    if (!service || !service.name) return false;
    const serviceName = service.name.toUpperCase();
    return (
      serviceName.includes('ПРИДАТОЧНЫХ ПАЗУХ НОСА') ||
      serviceName.includes('ТРГ') ||
      (serviceName.includes('ТЕЛЕРЕНТГЕНОГРАММА') && serviceName.includes('ЧЕРЕПА'))
    );
  };

  // Поиск клиники "Ленина 1" по ключевому слову
  const findLeninaClinic = () => {
    return doctors.find(doctor => {
      const name = doctor.name?.toUpperCase() || '';
      return name.includes('ЛЕНИНА');
    });
  };

  // Загрузка врачей при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      loadDoctors(); // Загружаем врачей сразу при открытии
      // Если есть предвыбранная услуга
      if (preselectedService) {
        // Устанавливаем выбранную услугу
        setSelectedService(preselectedService);
        // Устанавливаем категорию, если она есть в объекте услуги
        if (preselectedService.category) {
          setSelectedCategory(preselectedService.category);
        }
        // Если это ЛОР услуга, начинаем с вопроса о направлении (шаг 1.5)
        if (preselectedService.isLorService) {
          setCurrentStep(1.5);
        } else {
          // Для остальных услуг переходим сразу к шагу 3 (выбор филиала)
          setCurrentStep(3);
        }
        if (preselectedService.categoryId) {
          loadServicesForCategory(preselectedService.categoryId);
        }
      }
    } else {
      // Сбрасываем состояние при закрытии модального окна
      setIsConsultationSelected(false);
    }
  }, [isOpen, preselectedService]);

  // Загрузка услуг при выборе категории (только если мы не на шаге 1)
  useEffect(() => {
    if (selectedCategory && currentStep !== 1) {
      loadServicesForCategory(selectedCategory.id);
    }
  }, [selectedCategory, currentStep]);

  // Загрузка расписания при выборе врача и даты
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadSchedule();
      setIsTimeDropdownOpen(false);
    }
  }, [selectedDoctor, selectedDate]);
  
  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTimeDropdownOpen && !event.target.closest('.custom-time-dropdown')) {
        setIsTimeDropdownOpen(false);
      }
    };
    
    if (isTimeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTimeDropdownOpen]);

  // Автоматический выбор клиники "Ленина 1" для определенных услуг
  useEffect(() => {
    if (selectedService && doctors.length > 0) {
      if (requiresLeninaClinic(selectedService)) {
        const leninaClinic = findLeninaClinic();
        if (leninaClinic && selectedDoctor?.id !== leninaClinic.id) {
          setSelectedDoctor(leninaClinic);
          setSelectedClinic(leninaClinic);
        }
      }
    }
  }, [selectedService, doctors]);

  // Загрузка начальных данных
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, clinicsData] = await Promise.all([
        apiClient.getServiceCategories(),
        renovatioApi.getClinics()
      ]);
      
      // Не фильтруем по услугам на первом шаге, чтобы показать все категории
      const allCategories = Array.isArray(categoriesData) ? categoriesData : [];
      
      setCategories(allCategories);
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

  // Загрузка врачей
  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const doctorsData = await renovatioApi.getDoctors();
      
      // Преобразуем врачей в формат клиник, так как каждый врач = отдельная клиника
      const doctorsAsClinics = doctorsData.map(doctor => ({
        id: doctor.id,
        name: doctor.name, // Адрес клиники
        address: doctor.name,
        default_clinic: doctor.default_clinic,
        profession: doctor.profession_titles,
        doctor_info: doctor
      }));
      
      setDoctors(doctorsAsClinics);
    } catch (error) {
      console.error('Ошибка загрузки врачей:', error);
      toast.error('Не удалось загрузить врачей.');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка расписания
  const loadSchedule = async () => {
    if (!selectedDoctor || !selectedDate || !selectedClinic) return;

    try {
      setIsLoading(true);
      
      // Используем фиксированный step = 30 минут
      const step = 30;
      
      // Параметры запроса расписания логируются на бэкенде

      const scheduleData = await renovatioApi.getSchedule({
        clinic_id: selectedDoctor.default_clinic, // Используем default_clinic из данных врача
        user_id: selectedDoctor.id,
        service_id: selectedService?.id,
        time_start: selectedDate, // Отправляем только дату в формате YYYY-MM-DD
        time_end: selectedDate,   // Для одного дня используем ту же дату
        step: step                 // Фиксированное значение 30 минут
      });
      
      // Обрабатываем разные форматы ответа от API
      let slots = [];
      if (Array.isArray(scheduleData)) {
        slots = scheduleData;
      } else if (scheduleData && Array.isArray(scheduleData.data)) {
        slots = scheduleData.data;
      } else if (scheduleData && scheduleData.slots && Array.isArray(scheduleData.slots)) {
        slots = scheduleData.slots;
      } else {
        slots = [];
      }
      
      setAvailableSlots(slots);
    } catch (error) {
      // Более детальная обработка ошибок
      if (error.response?.status === 500) {
        toast.error('Ошибка сервера при загрузке расписания. Проверьте настройки Renovatio API.');
      } else if (error.response?.status === 400) {
        toast.error('Неверные параметры запроса расписания.');
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Ошибка сети. Проверьте подключение к интернету.');
      } else {
        toast.error('Не удалось загрузить расписание. Попробуйте позже.');
      }
      
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчики навигации
  const handleNext = () => {
    // Если на шаге 1 (выбор категории)
    if (currentStep === 1) {
      // Если выбрана карточка консультации, открываем модальное окно консультации
      if (isConsultationSelected) {
        setConsultationComment('Мне нужна консультация');
        setShowConsultationModal(true);
        return;
      }
      // Если выбрана ЛОР категория, переходим к шагу 1.5 (вопрос о направлении)
      if (isLorCategory(selectedCategory)) {
        setCurrentStep(1.5);
      } else {
        // Для остальных категорий сразу к шагу 2 (выбор услуги)
        setCurrentStep(2);
      }
    }
    // Если на шаге 1.5 (вопрос о направлении для ЛОР)
    else if (currentStep === 1.5) {
      // Если пользователь выбрал "Нет" (нет направления), открываем консультацию
      if (hasReferral === false) {
        const comment = `У меня нет направления от врача.${selectedService ? ` Интересует услуга: ${selectedService.name}${selectedService.description ? `. ${selectedService.description}` : ''}${selectedService.price ? `. Стоимость: ${selectedService.price}₽` : ''}` : ''}`;
        setConsultationComment(comment);
        setShowConsultationModal(true);
        return;
      }
      // Если есть направление, продолжаем обычный процесс
      // Если услуга уже выбрана (из ServicesSection), пропускаем шаг 2
      if (selectedService) {
        // Если услуга требует клинику "Ленина 1", пропускаем шаг 3 и переходим к шагу 4
        if (requiresLeninaClinic(selectedService) && selectedDoctor) {
          setCurrentStep(4);
        } else {
          setCurrentStep(3);
        }
      } else {
        // Иначе идем к шагу 2 (выбор услуги)
        setCurrentStep(2);
      }
    }
    // Если на шаге 2 (выбор услуги)
    else if (currentStep === 2) {
      // Если услуга требует клинику "Ленина 1" и клиника уже выбрана, пропускаем шаг 3
      if (requiresLeninaClinic(selectedService) && selectedDoctor) {
        setCurrentStep(4);
      } else {
        setCurrentStep(3);
      }
    }
    // Для остальных шагов просто увеличиваем номер (но не больше 5, шаг 6 - это экран успеха)
    else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    // Если на шаге 1.5 (вопрос о направлении для ЛОР), возвращаемся к шагу 1
    if (currentStep === 1.5) {
      setCurrentStep(1);
    }
    // Если на шаге 4 и услуга требует клинику "Ленина 1", возвращаемся к шагу 2 (пропускаем шаг 3)
    else if (currentStep === 4 && requiresLeninaClinic(selectedService) && selectedDoctor) {
      setCurrentStep(2);
    }
    // Если на шаге 3 и услуга уже была выбрана и это ЛОР категория
    else if (currentStep === 3 && selectedService && isLorCategory(selectedCategory)) {
      setCurrentStep(1.5);
    }
    // Если на шаге 3 и услуга требует клинику "Ленина 1", возвращаемся к шагу 2
    else if (currentStep === 3 && requiresLeninaClinic(selectedService) && selectedDoctor) {
      setCurrentStep(2);
    }
    // Если на шаге 2 и выбрана ЛОР категория, возвращаемся к шагу 1.5
    else if (currentStep === 2 && isLorCategory(selectedCategory)) {
      setCurrentStep(1.5);
    }
    // Для остальных случаев уменьшаем номер шага
    else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Проверка, является ли категория ЛОР исследованием
  const isLorCategory = (category) => {
    if (!category || !category.name) return false;
    return category.name.toUpperCase().includes('ЛОР');
  };

  // Обработчики выбора
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedService(null);
    setHasReferral(null);
    setErrors({});
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setErrors({});
    
    // Если услуга требует клинику "Ленина 1", автоматически выбираем её
    if (requiresLeninaClinic(service)) {
      const leninaClinic = findLeninaClinic();
      if (leninaClinic) {
        setSelectedDoctor(leninaClinic);
        setSelectedClinic(leninaClinic);
      }
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedClinic(doctor); // Устанавливаем клинику как выбранного врача
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

  // Функция для форматирования времени
  const formatTime = (timeString) => {
    try {
      // Если время уже в формате HH:MM, возвращаем как есть
      if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      
      // Если это ISO строка, парсим как дату
      if (typeof timeString === 'string' && timeString.includes('T')) {
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
          const formatted = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          return formatted;
        }
      }
      
      // Если это уже отформатированное время, возвращаем как есть
      return timeString;
    } catch (error) {
      return timeString || '--:--';
    }
  };

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

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Для поля birthDate применяем маску форматирования
    if (name === 'birthDate') {
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
        [name]: value
      }));
      
      // Очищаем ошибку для этого поля
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
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
      
      // Логирование для отладки
      console.log('Selected doctor:', selectedDoctor);
      console.log('Default clinic:', selectedDoctor?.default_clinic);
      console.log('Selected clinic:', selectedClinic);
      console.log('Selected clinic id:', selectedClinic?.id);
      
      // Проверяем, что у выбранного врача есть default_clinic
      if (!selectedDoctor.default_clinic) {
        console.error('Default clinic is missing for doctor:', selectedDoctor);
        toast.error('Не удалось определить клинику. Попробуйте выбрать другого врача.');
        setIsLoading(false);
        return;
      }
      
      // Вычисляем длительность услуги
      let durationMinutes = 30; // По умолчанию
      if (selectedService?.duration) {
        const durationStr = selectedService.duration.toString();
        const minutesMatch = durationStr.match(/(\d+)\s*м?и?н/);
        const hoursMatch = durationStr.match(/(\d+)\s*ч?ас/);
        
        if (minutesMatch) {
          durationMinutes = parseInt(minutesMatch[1]);
        } else if (hoursMatch) {
          durationMinutes = parseInt(hoursMatch[1]) * 60;
        }
        
        // Ограничиваем значения
        if (durationMinutes < 15) durationMinutes = 15;
        if (durationMinutes > 120) durationMinutes = 30;
      }
      
      // Вычисляем время окончания
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const endTime = new Date(`${selectedDate}T${selectedTime}:00`);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);
      const endTimeStr = endTime.toTimeString().substring(0, 5);
      
      // Формируем комментарий с учетом направления для ЛОР исследований
      let comment = formData.comment || '';
      if (isLorCategory(selectedCategory) && hasReferral !== null) {
        const referralText = hasReferral ? 'Пациент имеет направление от врача' : 'Пациент не имеет направления от врача';
        comment = comment ? `${referralText}. ${comment}` : referralText;
      }
      
      // Форматируем данные для отправки
      const appointmentData = formatAppointmentData(formData, {
        doctorId: selectedDoctor.id,
        clinicId: selectedDoctor.default_clinic, // Используем только default_clinic
        serviceId: selectedService?.id,
        timeStart: `${selectedDate} ${selectedTime}:00`,
        timeEnd: `${selectedDate} ${endTimeStr}:00`,
        comment: comment
      });
      
      console.log('Appointment data being sent:', {
        doctorId: appointmentData.doctor_id,
        clinicId: appointmentData.clinic_id,
        serviceId: appointmentData.service_id
      });

      // ВРЕМЕННО ЗАКОММЕНТИРОВАНО: Отправка кода верификации
      // const response = await verificationApi.sendVerificationCode(appointmentData);
      // 
      // if (response.success) {
      //   setShowVerificationModal(true);
      //   toast.success('Код подтверждения отправлен на ваш email');
      // } else {
      //   toast.error(response.message || 'Не удалось отправить код подтверждения');
      // }

      // ВРЕМЕННО: Создаем запись напрямую без верификации email
      const response = await verificationApi.createAppointmentWithoutVerification(appointmentData);
      
      if (response.success && response.appointment) {
        handleVerificationSuccess(response);
        toast.success('Запись успешно создана!');
      } else {
        toast.error(response.message || 'Не удалось создать запись');
      }
    } catch (error) {
      const handledError = handleAppointmentError(error);
      toast.error(handledError.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик успешной верификации
  const handleVerificationSuccess = (result) => {
    setShowVerificationModal(false);
    
    // Добавляем информацию для отображения в SuccessStep
    const appointmentDataWithDisplay = {
      ...result,
      serviceName: selectedService?.name,
      clinicName: selectedDoctor?.name || selectedClinic?.name || selectedClinic?.title,
      clinicAddress: selectedClinic?.address || selectedClinic?.title,
      appointmentDate: selectedDate,
      appointmentTime: formatTime(selectedTime)
    };
    
    setAppointmentResult(appointmentDataWithDisplay);
    setCurrentStep(6); // Переходим на шаг 6 (экран успеха)
    toast.success('Запись успешно создана!');
  };

  // Обработчик закрытия модального окна
  const handleClose = () => {
    if (isLoading) return;
    
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedService(null); // Сбрасываем услугу при закрытии
    setSelectedDoctor(null);
    setSelectedClinic(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setHasReferral(null); // Сбрасываем выбор направления
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
    setAppointmentResult(null);
    onClose();
  };

  // Отключение скролла при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию скролла
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
    } else {
      // Восстанавливаем позицию скролла
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

    return () => {
      // Очистка при размонтировании
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
    };
  }, [isOpen]);

  // Функция для форматирования названия категории
  const formatCategoryName = (name) => {
    if (!name) return '';
    
    // Удаляем текст в скобках
    let formatted = name.replace(/\s*\([^)]*\)/g, '');
    
    // Приводим к нормальному регистру (первая буква заглавная, остальные строчные)
    // Разбиваем на слова и форматируем каждое слово
    formatted = formatted
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ')
      .trim();
    
    return formatted;
  };

  // Функция для получения изображения категории
  const getCategoryImage = (category) => {
    if (!category) return null;
    
    // Если у категории есть изображение в БД, используем его
    if (category.imageUrl) {
      const getServerBaseUrl = () => {
        const apiUrl = process.env.REACT_APP_API_URL || '/api';
        // Если это относительный путь, возвращаем пустую строку (для nginx proxy)
        if (apiUrl.startsWith('/')) {
          return '';
        }
        // Если это полный URL, убираем /api
        return apiUrl.replace('/api', '');
      };
      return `${getServerBaseUrl()}${category.imageUrl}`;
    }
    
    // Fallback на старые изображения из assets (для обратной совместимости)
    if (!category.name) return null;
    
    const nameUpper = category.name.toUpperCase();
    
    // IMG-3: ЛОР-исследования (проверяем первым, т.к. может содержать "3D" в названии)
    if (nameUpper.includes('ЛОР')) {
      return modalImg3;
    }
    
    // IMG-1: Двухмерные рентгенологические исследования
    if (nameUpper.includes('ДВУХМЕРН')) {
      return modalImg1;
    }
    
    // IMG-2: Трехмерные рентгенологические исследования челюстей (3D КЛКТ)
    if (nameUpper.includes('ТРЕХМЕРН') || nameUpper.includes('3D') || nameUpper.includes('КЛКТ')) {
      return modalImg2;
    }
    
    return null;
  };

  // Мемоизация карточек для шага 1
  const allCards = useMemo(() => {
    // Фильтруем категории исследований (исключаем "Дополнительные услуги" и "Пакетное предложение")
    const investigationCategories = categories.filter(cat => {
      const nameUpper = cat.name.toUpperCase();
      const isNotAdditional = !nameUpper.includes('ДОПОЛНИТЕЛЬН');
      const isNotPackage = !nameUpper.includes('ПАКЕТН');
      const isRoot = cat.parentId === null || cat.parentId === undefined; // Только корневые категории
      
      return isNotAdditional && isNotPackage && isRoot;
    });

    // Добавляем карточку консультации в конец
    return [
      ...investigationCategories.map(cat => ({
        id: cat.id,
        title: formatCategoryName(cat.name),
        type: 'category',
        categoryData: cat,
        image: getCategoryImage(cat)
      })),
      {
        id: 'consultation',
        title: 'Не знаю. Нужна консультация',
        type: 'consultation',
        image: null
      }
    ];
  }, [categories]);

  // Мемоизация обработчика выбора категории
  const handleInitialCategorySelect = useCallback((card) => {
    if (card.type === 'category') {
      setIsConsultationSelected(false);
      setSelectedCategory(card.categoryData);
      setSelectedService(null);
      setHasReferral(null);
      setErrors({});
    } else if (card.type === 'consultation') {
      // Выбираем карточку консультации (открытие модального окна произойдет при нажатии "Далее")
      setSelectedCategory(null);
      setIsConsultationSelected(true);
    }
  }, []);

  // Рендер шага 1 - Выбор категории
  const renderStep1 = () => {
    const showSkeletons = isLoading && categories.length === 0;

    return (
      <div className="appointment-step">
        <h2 className="appointment-title">Какой снимок вас интересует?</h2>
        {showSkeletons ? (
          <div className="initial-services-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="initial-service-card skeleton" />
            ))}
          </div>
        ) : allCards.length === 0 ? (
          <div className="no-categories-message">
            <p>Категории услуг не найдены</p>
            <small>Пожалуйста, выполните синхронизацию с Renovatio CRM</small>
          </div>
        ) : (
          <>
            {/* Desktop version - cards */}
            <div className="initial-services-grid desktop-only">
              {allCards.map(card => (
                <div
                  key={card.id}
                  className={`initial-service-card ${(card.type === 'consultation' && isConsultationSelected) || (card.type === 'category' && selectedCategory?.id === card.id) ? 'selected' : ''} ${!card.image ? 'no-image' : ''}`}
                  onClick={() => handleInitialCategorySelect(card)}
                >
                  <div className="initial-service-content">
                    <h3 className="initial-service-title">{card.title}</h3>
                  </div>
                  {card.image && card.image !== null && card.image !== '' ? (
                    <div className={`initial-service-image ${card.image === modalImg2 ? 'no-filter' : ''}`}>
                      <img src={card.image} alt={card.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="initial-service-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.75 6.00311C0.75 5.5889 1.08579 5.25311 1.5 5.25311H10.5C10.9142 5.25311 11.25 5.5889 11.25 6.00311C11.25 6.41733 10.9142 6.75311 10.5 6.75311H1.5C1.08579 6.75311 0.75 6.41733 0.75 6.00311Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.46967 0.96967C5.76256 0.676777 6.23744 0.676777 6.53033 0.96967L11.0303 5.46967C11.3232 5.76256 11.3232 6.23744 11.0303 6.53033L6.53033 11.0303C6.23744 11.3232 5.76256 11.3232 5.46967 11.0303C5.17678 10.7374 5.17678 10.2626 5.46967 9.96967L9.43934 6L5.46967 2.03033C5.17678 1.73744 5.17678 1.26256 5.46967 0.96967Z" fill="currentColor"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile version - radio options (clinic-radio style) */}
            <div className="mobile-service-options mobile-only">
              {allCards.map(card => (
                <label
                  key={card.id}
                  className={`mobile-service-option clinic-radio-option ${(card.type === 'consultation' && isConsultationSelected) || (card.type === 'category' && selectedCategory?.id === card.id) ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="mobile-service"
                    className="clinic-radio-input"
                    checked={(card.type === 'consultation' && isConsultationSelected) || (card.type === 'category' && selectedCategory?.id === card.id)}
                    onChange={() => handleInitialCategorySelect(card)}
                  />
                  <span className="clinic-radio-icon" />
                  <div className="mobile-service-content">
                    <span className="clinic-radio-text">{card.title}</span>
                    {card.description && (
                      <span className="clinic-radio-description">{card.description}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Рендер шага 1.5 - Вопрос о направлении (только для ЛОР исследований)
  const renderStep1_5 = () => {
    return (
      <div className="appointment-step">
        <h2 className="appointment-title">У вас имеется направление от врача?</h2>
        <div className="referral-options">
          <label className="radio-option clinic-radio-option">
            <input
              type="radio"
              name="hasReferral"
              value="yes"
              className="clinic-radio-input"
              checked={hasReferral === true}
              onChange={() => setHasReferral(true)}
            />
            <span className="clinic-radio-icon" />
            <span className="clinic-radio-text">Да</span>
          </label>
          <label className="radio-option clinic-radio-option">
            <input
              type="radio"
              name="hasReferral"
              value="no"
              className="clinic-radio-input"
              checked={hasReferral === false}
              onChange={() => setHasReferral(false)}
            />
            <span className="clinic-radio-icon" />
            <span className="clinic-radio-text">Нет</span>
          </label>
        </div>
      </div>
    );
  };

  // Рендер шага 2 - Выбор услуги
  const renderStep2 = () => {
    const filteredServices = services.filter(service => 
      service.categoryId === selectedCategory?.id
    );
    
    // Функция для получения изображения услуги
    const getServiceImage = (service) => {
      // Если у услуги есть свое изображение, проверяем его
      if (service.imageUrl) {
        // Проверяем, не совпадает ли imageUrl услуги с imageUrl категории
        if (selectedCategory?.imageUrl && service.imageUrl === selectedCategory.imageUrl) {
          // Если совпадает, используем fallback (изображение категории через getCategoryImage)
          return getCategoryImage(selectedCategory);
        }
        
        // Проверяем, не находится ли изображение в папке categories (старые данные)
        if (service.imageUrl.includes('/uploads/categories/')) {
          // Если изображение в папке categories, используем fallback
          return getCategoryImage(selectedCategory);
        }
        
        // Определяем базовый URL сервера
        const getServerBaseUrl = () => {
          const apiUrl = process.env.REACT_APP_API_URL || '/api';
          // Если это относительный путь, возвращаем пустую строку (для nginx proxy)
          if (apiUrl.startsWith('/')) {
            return '';
          }
          // Если это полный URL, убираем /api
          return apiUrl.replace('/api', '');
        };
        return `${getServerBaseUrl()}${service.imageUrl}`;
      }
      // Иначе используем изображение категории как fallback
      return getCategoryImage(selectedCategory);
    };
    
    return (
      <div className="appointment-step">
        <div className="step2-header">
          <h2 className="appointment-title">{selectedCategory?.name || 'Выберите услугу'}</h2>
          <p className="step2-subtitle">Выберите снимок</p>
        </div>
        {isLoading ? (
          <div className="services-grid-step2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="service-card-step2 skeleton" />
            ))}
          </div>
        ) : (
          <div className="services-grid-step2">
            {filteredServices.map(service => (
              <ServiceCardStep2
                key={service.id}
                service={service}
                isSelected={selectedService?.id === service.id}
                serviceImage={getServiceImage(service)}
                onClick={() => handleServiceSelect(service)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Рендер шага 3 - Выбор клиники и врача (список-аккордеон)
  const renderStep3 = () => {
    const getDoctorDescription = (doctor) => {
      const profession = doctor.profession;
      if (Array.isArray(profession) && profession.length) return profession.join(', ');
      if (typeof profession === 'string' && profession.trim()) return profession;
      if (doctor.address && doctor.address !== doctor.name) return doctor.address;
      return null;
    };
    return (
      <div className="appointment-step">
        <h2 className="appointment-title">Выберите филиал для записи</h2>
        <div className="step3-content">
          {isLoading ? (
            <div className="clinics-radio-list step3-clinic-list">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="step3-clinic-item">
                  <div className="clinic-radio-option skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <div className="clinics-radio-list step3-clinic-list">
              {doctors.map(doctor => {
                const isSelected = selectedDoctor?.id === doctor.id;
                const description = getDoctorDescription(doctor);
                return (
                  <div
                    key={doctor.id}
                    className={`step3-clinic-item ${isSelected ? 'selected' : ''}`}
                  >
                    <label
                      className="clinic-radio-option"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <input
                        type="radio"
                        name="clinic"
                        value={doctor.id}
                        checked={isSelected}
                        onChange={() => handleDoctorSelect(doctor)}
                        className="clinic-radio-input"
                      />
                      <span className="clinic-radio-icon" />
                      <span className="clinic-radio-text">{doctor.name}</span>
                    </label>
                    {description && (
                      <div className="step3-clinic-description" aria-hidden={!isSelected}>
                        {description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Рендер шага 4 - Выбор даты и времени
  const renderStep4 = () => {
    // Форматирование даты для отображения
    const formatDateForDisplay = (dateString) => {
      if (!dateString) return '00.00.0000';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    return (
      <div className="appointment-step">
        <h2 className="appointment-title">Выберите дату и время для записи</h2>
        
        <div className="step4-content">
          <div className="date-time-field">
            <label className="date-time-label">Выберите дату</label>
            <div className="date-dropdown-wrapper">
              <input
                type="date"
                className="date-dropdown-input"
                value={selectedDate || ''}
                onChange={(e) => handleDateSelect(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                id="date-input"
              />
            </div>
          </div>

          <div className="date-time-field">
            <label className="date-time-label">Выберите время</label>
            <div className="time-dropdown-wrapper">
              {!selectedDate ? (
                <div className="time-dropdown disabled">
                  <span className="time-dropdown-text">00.00</span>
                  <svg className="time-dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 14.4C4.46528 14.4 1.6 11.5347 1.6 8C1.6 4.46528 4.46528 1.6 8 1.6C11.5347 1.6 14.4 4.46528 14.4 8C14.4 11.5347 11.5347 14.4 8 14.4ZM8.8 4.8V8.8L11.2 10.4L10.4 11.6L7.6 9.6V4.8H8.8Z" fill="rgba(24, 37, 61, 0.32)"/>
                  </svg>
                </div>
              ) : isLoading ? (
                <div className="time-dropdown loading">
                  <span className="time-dropdown-text">Загрузка...</span>
                </div>
              ) : Array.isArray(availableSlots) && availableSlots.length > 0 ? (
                <div className={`custom-time-dropdown ${isTimeDropdownOpen ? 'open' : ''}`}>
                  <div 
                    className="custom-time-dropdown-trigger"
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  >
                    <span className={`custom-time-dropdown-text ${selectedTime ? 'has-value' : ''}`}>
                      {selectedTime ? formatTime(selectedTime) : '00.00'}
                    </span>
                    <svg 
                      className={`custom-time-dropdown-arrow ${isTimeDropdownOpen ? 'open' : ''}`} 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 6L8 10L12 6" stroke="rgba(24, 37, 61, 0.32)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {isTimeDropdownOpen && (
                    <div className="custom-time-dropdown-list">
                      {availableSlots
                        .filter(slot => slot.available)
                        .map((slot, index) => {
                          const timeValue = formatTime(slot.time);
                          const isSelected = selectedTime === slot.time;
                          return (
                            <React.Fragment key={slot.time || slot.id}>
                              {index > 0 && <div className="custom-time-dropdown-divider" />}
                              <div
                                className={`custom-time-dropdown-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                  handleTimeSelect(slot.time);
                                  setIsTimeDropdownOpen(false);
                                }}
                              >
                                <span className="custom-time-dropdown-item-text">{timeValue}</span>
                                {isSelected && (
                                  <svg className="custom-time-dropdown-item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 8L7 11L12 5" stroke="rgba(24, 37, 61, 0.32)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="time-dropdown disabled">
                  <span className="time-dropdown-text">Нет доступного времени</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Рендер шага 6 - Экран успеха
  const renderStep6 = () => {
    const {
      serviceName,
      clinicName,
      clinicAddress,
      appointmentDate,
      appointmentTime
    } = appointmentResult || {};

    const formatDateForDisplay = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const formatTimeForDisplay = (timeString) => {
      if (!timeString) return '';
      if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      if (typeof timeString === 'string' && timeString.includes('T')) {
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      }
      return timeString || '';
    };

    return (
      <div className="success-step">
        <h2 className="success-subtitle">Вас записали</h2>

        <div className="success-details">
          <div className="success-detail-item">
            <div className="success-detail-label">Выбранная услуга</div>
            <div className="success-detail-value">
              {serviceName || 'Не указана'}
            </div>
          </div>

          <div className="success-detail-item">
            <div className="success-detail-label">Адрес филиала</div>
            <div className="success-detail-value">
              {clinicAddress || clinicName || 'Не указан'}
            </div>
          </div>

          <div className="success-detail-item">
            <div className="success-detail-label">Дата и время</div>
            <div className="success-detail-value">
              {appointmentDate && appointmentTime 
                ? `${formatDateForDisplay(appointmentDate)} в ${formatTimeForDisplay(appointmentTime)}`
                : 'Не указано'
              }
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Рендер шага 5 - Контактные данные
  const renderStep5 = () => (
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
              onChange={handleInputChange}
              placeholder="Введите Фамилию"
              className={`step5-input ${errors.lastName ? 'error' : ''}`}
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
              onChange={handleInputChange}
              placeholder="Введите Имя"
              className={`step5-input ${errors.firstName ? 'error' : ''}`}
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
              onChange={handleInputChange}
              placeholder="Введите Отчество"
              className={`step5-input ${errors.thirdName ? 'error' : ''}`}
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
              onChange={handleInputChange}
              placeholder="Ваш телефон"
              className={`step5-input ${errors.phone ? 'error' : ''}`}
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
              onChange={handleInputChange}
              placeholder="Дата рождения"
              className={`step5-input ${errors.birthDate ? 'error' : ''}`}
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
                  handleInputChange({ target: { name: 'birthDate', value: formatted } });
                } else {
                  handleInputChange({ target: { name: 'birthDate', value: '' } });
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
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8 2.4H12V1.6C12 1.17565 11.6314 0.8 11.2 0.8C10.7686 0.8 10.4 1.17565 10.4 1.6V2.4H5.6V1.6C5.6 1.17565 5.23137 0.8 4.8 0.8C4.36863 0.8 4 1.17565 4 1.6V2.4H3.2C2.31634 2.4 1.6 3.11634 1.6 4V12.8C1.6 13.6837 2.31634 14.4 3.2 14.4H12.8C13.6837 14.4 14.4 13.6837 14.4 12.8V4C14.4 3.11634 13.6837 2.4 12.8 2.4ZM12.8 12.8H3.2V6.4H12.8V12.8ZM3.2 5.6V4H4V4.8C4 5.22435 4.36863 5.6 4.8 5.6C5.23137 5.6 5.6 5.22435 5.6 4.8V4H10.4V4.8C10.4 5.22435 10.7686 5.6 11.2 5.6C11.6314 5.6 12 5.22435 12 4.8V4H12.8V5.6H3.2Z" fill="rgba(24, 37, 61, 0.32)"/>
              </svg>
            </button>
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>
        </div>

        <div className="step5-form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className={`step5-input ${errors.email ? 'error' : ''}`}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="step5-divider"></div>

        <div className="step5-checkbox-wrapper">
          <input
            type="checkbox"
            id="privacyConsent"
            name="privacyConsent"
            className="step5-checkbox"
            required
          />
          <label htmlFor="privacyConsent" className="step5-checkbox-label">
            Я согласен на обработку персональных данных согласно политике конфиденциальности
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && !showConsultationModal && (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose} aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="modal-header">
            <h1 className="modal-title">
              {currentStep === 6 ? 'Спасибо за заявку' : 'Записаться на снимок'}
            </h1>
            {currentStep !== 6 && (
              <div className="progress-bar">
                {[1, 2, 3, 4, 5].map(step => (
                  <div
                    key={step}
                    className={`progress-step ${step <= currentStep ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="modal-body">
            {currentStep === 1 && renderStep1()}
            {currentStep === 1.5 && renderStep1_5()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
          </div>

          {currentStep !== 6 && (
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={currentStep === 1 ? handleClose : handleBack}
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
                onClick={currentStep === 5 ? handleSubmit : handleNext}
                disabled={
                  isLoading ||
                  (currentStep === 1 && !selectedCategory && !isConsultationSelected) ||
                  (currentStep === 1.5 && hasReferral === null) ||
                  (currentStep === 2 && !selectedService) ||
                  (currentStep === 3 && (!selectedClinic || !selectedDoctor)) ||
                  (currentStep === 4 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 5 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
                }
              >
                <div className="text-btn-wrapper">
                  {isLoading ? (
                    <>
                      <div className="spinner" />
                      <span>Загрузка...</span>
                    </>
                  ) : currentStep === 5 ? (
                    <span>Отправить код подтверждения</span>
                  ) : (
                    <>
                      <span>Далее</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {currentStep === 6 && (
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={handleClose}
              >
                <div className="text-btn-wrapper">
                  <span>Закрыть</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ВРЕМЕННО ЗАКОММЕНТИРОВАНО: Модальное окно верификации */}
      {/* <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={formData.email}
        appointmentData={(() => {
          // Вычисляем длительность и время окончания
          let durationMinutes = 30;
          if (selectedService?.duration) {
            const durationStr = selectedService.duration.toString();
            const minutesMatch = durationStr.match(/(\d+)\s*м?и?н/);
            const hoursMatch = durationStr.match(/(\d+)\s*ч?ас/);
            
            if (minutesMatch) {
              durationMinutes = parseInt(minutesMatch[1]);
            } else if (hoursMatch) {
              durationMinutes = parseInt(hoursMatch[1]) * 60;
            }
            
            if (durationMinutes < 15) durationMinutes = 15;
            if (durationMinutes > 120) durationMinutes = 30;
          }
          
          const endTime = new Date(`${selectedDate}T${selectedTime}:00`);
          endTime.setMinutes(endTime.getMinutes() + durationMinutes);
          const endTimeStr = endTime.toTimeString().substring(0, 5);
          
          // Формируем комментарий с учетом направления для ЛОР исследований
          let comment = formData.comment || '';
          if (isLorCategory(selectedCategory) && hasReferral !== null) {
            const referralText = hasReferral ? 'Пациент имеет направление от врача' : 'Пациент не имеет направления от врача';
            comment = comment ? `${referralText}. ${comment}` : referralText;
          }
          
          return {
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
            timeEnd: `${selectedDate} ${endTimeStr}:00`,
            comment: comment
          };
        })()}
        onSuccess={handleVerificationSuccess}
      /> */}


      {/* Модальное окно консультации */}
      <ConsultationModal
        isOpen={showConsultationModal}
        onClose={() => {
          setShowConsultationModal(false);
          setConsultationComment('');
        }}
        initialComment={consultationComment}
      />
    </>
  );
};

export default AppointmentModal;