import React from 'react';
import './SuccessStep.css';

const SuccessStep = ({ 
  appointmentData, 
  onClose 
}) => {
  const {
    serviceName,
    clinicName,
    appointmentDate,
    appointmentTime,
    renovatioId
  } = appointmentData || {};

  return (
    <div className="success-step">
      <div className="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="success-content">
        <h2 className="success-title">Запись успешно создана!</h2>
        <p className="success-subtitle">
          Подтверждение отправлено на ваш email
        </p>

        <div className="appointment-details">
          <div className="detail-item">
            <div className="detail-label">Услуга</div>
            <div className="detail-value">{serviceName || 'Не указана'}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Клиника</div>
            <div className="detail-value">{clinicName || 'Не указана'}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Дата и время</div>
            <div className="detail-value">
              {appointmentDate && appointmentTime 
                ? `${appointmentDate} в ${appointmentTime}`
                : 'Не указано'
              }
            </div>
          </div>

          {renovatioId && (
            <div className="detail-item">
              <div className="detail-label">Номер записи</div>
              <div className="detail-value">{renovatioId}</div>
            </div>
          )}
        </div>

        <div className="success-info">
          <div className="info-item">
            <div className="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="info-text">
              Подтверждение записи отправлено на ваш email
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="info-text">
              Приходите за 10 минут до назначенного времени
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="info-text">
              При необходимости отмены записи звоните по телефону
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button 
            className="btn btn-primary"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
