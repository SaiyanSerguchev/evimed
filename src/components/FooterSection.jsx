import React from 'react';
import './FooterSection.css';

const FooterSection = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Эвимед</h3>
            <p className="footer-description">
              Федеральная сеть независимых центров рентгенодиагностики. 
              Предоставляем услуги в области рентгенодиагностики для стоматологов, 
              отоларингологов и челюстно-лицевых хирургов.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg className="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5.01 14.33c-.1.22-.32.35-.56.35H5.55c-.24 0-.46-.13-.56-.35-.1-.22-.06-.47.1-.64l1.5-1.5c.18-.18.42-.24.64-.18.22.06.35.28.35.5v1.5c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5v-1.5c0-.22.13-.44.35-.5.22-.06.46 0 .64.18l1.5 1.5c.16.17.2.42.1.64z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg className="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm4.5 14.5h-9c-.28 0-.5-.22-.5-.5v-8c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v8c0 .28-.22.5-.5.5z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg className="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 14.5c0 .28-.22.5-.5.5h-9c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v9z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Услуги</h3>
            <a href="#" className="footer-link">Рентгенография</a>
            <a href="#" className="footer-link">Компьютерная томография</a>
            <a href="#" className="footer-link">Консультации специалистов</a>
            <a href="#" className="footer-link">Подготовка к исследованиям</a>
          </div>
          
          <div className="footer-section">
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
          
          <div className="footer-section">
            <h3 className="footer-title">Адреса</h3>
            <div className="contact-info">
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Якутск, пр. Ленина 1</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Якутск, пр. Кирова 25</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            © 2024 Эвимед. Все права защищены.
          </div>
          <div className="footer-links">
            <a href="#" className="footer-bottom-link">Политика конфиденциальности</a>
            <a href="#" className="footer-bottom-link">Условия использования</a>
            <a href="#" className="footer-bottom-link">Карта сайта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;





