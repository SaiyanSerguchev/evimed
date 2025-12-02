import React from 'react';
import './SuccessStep.css';

const SuccessStep = ({ 
  appointmentData, 
  onClose 
}) => {
  const {
    serviceName,
    clinicName,
    clinicAddress,
    appointmentDate,
    appointmentTime,
    renovatioId
  } = appointmentData || {};

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (timeString) => {
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
    <>
      <div className="modal-header">
        <h1 className="modal-title">Спасибо за заявку</h1>
      </div>

      <div className="modal-body">
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
                  ? `${formatDateForDisplay(appointmentDate)} в ${formatTime(appointmentTime)}`
                  : 'Не указано'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          className="btn btn-primary"
          onClick={onClose}
        >
          <div className="text-btn-wrapper">
            <span>Закрыть</span>
          </div>
        </button>
      </div>
    </>
  );
};

export default SuccessStep;
