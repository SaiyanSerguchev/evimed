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
            <p className="footer-description">Независимые центры рентгенодиагностики</p>
          </div>

          {/* Services Section */}
          <div className="footer-services">
            <h3 className="footer-title">Навигация</h3>
            <nav className="footer-nav">
              <a href="#" className="footer-link">Почему мы?</a>
              <a href="#" className="footer-link">Услуги</a>
              <a href="#" className="footer-link">Наши адреса</a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h3 className="footer-title">Контакты</h3>
            <div className="contact-info">
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>+7 (495) 492-43-40</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 6l7 5 7-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>info@axiomaykt.ru</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2025, Независимые центры рентгенодиагностики «Evimed»
            </div>
            <nav className="footer-bottom-nav">
              <a href="#" className="footer-bottom-link">Политика конфиденциальности</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;





