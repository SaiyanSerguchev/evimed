import React from 'react';
import './MobilePlaceholder.css';

const MobilePlaceholder = () => {
  return (
    <div className="mobile-placeholder">
      <div className="mobile-placeholder-content">
        <div className="mobile-placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1>Мобильная версия в разработке</h1>
        <p>Мы работаем над адаптацией сайта для мобильных устройств. Пожалуйста, используйте десктопную версию.</p>
        <div className="mobile-placeholder-info">
          <p>Для просмотра сайта откройте его на компьютере или планшете.</p>
        </div>
      </div>
    </div>
  );
};

export default MobilePlaceholder;

