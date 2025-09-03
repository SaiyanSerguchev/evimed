import React from 'react';
import './FooterSection.css';

const FooterSection = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo Section */}
          <div className="footer-logo-section">
            <div className="footer-logo">
              <div className="logo-symbol">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M16.36 16.36L19.27 19.27L22.18 22.18" stroke="#14488C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.27 18L18 18L18 12.27" stroke="#B6BDCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.5 12.27L23.73 12.27L23.73 26.5" stroke="#1A232E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="logo-text">
                <span>Эвимед</span>
              </div>
            </div>
            <p className="footer-description">
              Федеральная сеть независимых центров рентгенодиагностики. 
              Предоставляем услуги в области рентгенодиагностики для стоматологов, 
              отоларингологов и челюстно-лицевых хирургов.
            </p>
          </div>

          {/* Services Section */}
          <div className="footer-services">
            <h3 className="footer-title">Услуги</h3>
            <nav className="footer-nav">
              <a href="#" className="footer-link">Рентгенография</a>
              <a href="#" className="footer-link">Компьютерная томография</a>
              <a href="#" className="footer-link">Консультации специалистов</a>
              <a href="#" className="footer-link">Подготовка к исследованиям</a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h3 className="footer-title">Контакты</h3>
            <div className="contact-info">
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Пн-Пт: 8:00-20:00</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Сб-Вс: 9:00-18:00</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>+7 (495) 492-43-40</span>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="footer-addresses">
            <h3 className="footer-title">Адреса</h3>
            <div className="address-info">
              <div className="address-item">
                <svg className="address-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Якутск, пр. Ленина 1</span>
              </div>
              <div className="address-item">
                <svg className="address-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Якутск, пр. Кирова 25</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2024 Эвимед. Все права защищены.
            </div>
            <nav className="footer-bottom-nav">
              <a href="#" className="footer-bottom-link">Политика конфиденциальности</a>
              <a href="#" className="footer-bottom-link">Условия использования</a>
              <a href="#" className="footer-bottom-link">Карта сайта</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;





