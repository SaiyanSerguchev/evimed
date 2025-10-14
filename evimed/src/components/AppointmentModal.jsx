import React, { useState } from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });

  const services = [
    {
      id: 1,
      title: 'Двухмерные рентгенологические исследования',
      description: 'Стандартные рентгеновские снимки',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjE1IiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIxNSAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMTUiIGhlaWdodD0iMTQwIiBmaWxsPSIjRUJFREY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMEgxOTVWMTEwSDIwVjMwWiIgZmlsbD0iI0U1RTdFQiIvPgo8cGF0aCBkPSJNMzAgNDBIMTg1VjEwMEgzMFY0MFoiIGZpbGw9IiNEM0Q3RTAiLz4KPHBhdGggZD0iTTQwIDUwSDE3NVY5MEg0MFY1MFoiIGZpbGw9IiNCNkI5QjYiLz4KPHBhdGggZD0iTTUwIDYwSDE2NVY4MEg1MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTYwIDcwSDE1NVY3MEg2MFY3MFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+'
    },
    {
      id: 2,
      title: 'Трехмерные рентгенологические исследования челюстей (3D КЛКТ)',
      description: 'Трехмерная компьютерная томография',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjE1IiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIxNSAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMTUiIGhlaWdodD0iMTQwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjEwNy41IiBjeT0iNzAiIHI9IjQwIiBmaWxsPSIjMTQ0ODhDIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIxMDcuNSIgY3k9IjcwIiByPSIzMCIgZmlsbD0iIzE0NDg4QyIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPGNpcmNsZSBjeD0iMTA3LjUiIGN5PSI3MCIgcj0iMjAiIGZpbGw9IiMxNDQ4OEMiLz4KPHBhdGggZD0iTTg3LjUgNTVMMTI3LjUgNTVMMTI3LjUgODVMODcuNSA4NUw4Ny41IDU1WiIgZmlsbD0iIzE0NDg4QyIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPC9zdmc+'
    },
    {
      id: 3,
      title: 'ЛОР-исследования (2D РГ / 3D КЛКТ)',
      description: 'Исследования уха, горла и носа',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjE1IiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIxNSAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMTUiIGhlaWdodD0iMTQwIiBmaWxsPSIjRUJFREY2Ii8+CjxjaXJjbGUgY3g9IjEwNy41IiBjeT0iNzAiIHI9IjQwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjEwNy41IiBjeT0iNzAiIHI9IjMwIiBmaWxsPSIjRDNEN0UwIi8+CjxjaXJjbGUgY3g9IjEwNy41IiBjeT0iNzAiIHI9IjIwIiBmaWxsPSIjQjZCOUI2Ii8+CjxjaXJjbGUgY3g9IjEwNy41IiBjeT0iNzAiIHI9IjEwIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg=='
    },
    {
      id: 4,
      title: 'Не знаю. Нужна консультация',
      description: 'Консультация специалиста',
      image: null
    }
  ];

  const branches = [
    { id: 1, name: 'Центральный офис', address: 'ул. Примерная, 123' },
    { id: 2, name: 'Филиал №1', address: 'ул. Другая, 456' },
    { id: 3, name: 'Филиал №2', address: 'ул. Третья, 789' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Здесь будет логика отправки данных
    console.log('Appointment data:', {
      service: selectedService,
      branch: selectedBranch,
      date: selectedDate,
      time: selectedTime,
      formData
    });
    onClose();
  };

  const renderStep1 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Какой снимок вас интересует?</h2>
      <div className="services-grid">
        {services.map(service => (
          <div
            key={service.id}
            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
            onClick={() => handleServiceSelect(service)}
          >
            {service.image && (
              <div className="service-image">
                <img src={service.image} alt={service.title} />
              </div>
            )}
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
            </div>
            {!service.image && (
              <div className="service-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Выберите филиал и время</h2>
      
      <div className="step2-content">
        <div className="branches-section">
          <h3 className="section-title">Филиал</h3>
          <div className="branches-list">
            {branches.map(branch => (
              <div
                key={branch.id}
                className={`branch-card ${selectedBranch?.id === branch.id ? 'selected' : ''}`}
                onClick={() => handleBranchSelect(branch)}
              >
                <div className="branch-info">
                  <h4 className="branch-name">{branch.name}</h4>
                  <p className="branch-address">{branch.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="datetime-section">
          <div className="date-section">
            <h3 className="section-title">Дата</h3>
            <div className="date-picker">
              <input
                type="date"
                className="date-input"
                onChange={(e) => handleDateSelect(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="time-section">
            <h3 className="section-title">Время</h3>
            <div className="time-slots">
              {timeSlots.map(time => (
                <button
                  key={time}
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="appointment-step">
      <h2 className="appointment-title">Ваши контактные данные</h2>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="name">Имя *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Комментарий</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows="4"
          />
        </div>
      </div>

      <div className="appointment-summary">
        <h3 className="summary-title">Сводка записи</h3>
        <div className="summary-item">
          <span className="summary-label">Услуга:</span>
          <span className="summary-value">{selectedService?.title}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Филиал:</span>
          <span className="summary-value">{selectedBranch?.name}</span>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="modal-header">
          <h1 className="modal-title">Записаться на снимок</h1>
          <div className="progress-bar">
            <div className="progress-step active"></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}></div>
          </div>
        </div>

        <div className="modal-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={currentStep === 1 ? onClose : handleBack}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Назад
          </button>
          <div className="btn-divider"></div>
          <button
            className="btn btn-primary"
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            disabled={
              (currentStep === 1 && !selectedService) ||
              (currentStep === 2 && (!selectedBranch || !selectedDate || !selectedTime)) ||
              (currentStep === 3 && (!formData.name || !formData.phone))
            }
          >
            {currentStep === 3 ? 'Записаться' : 'Далее'}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
