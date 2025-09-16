import React from 'react';
import './FooterSection.css';
import EvimedLogo from '../assets/images/icons/Evimed.svg';

const FooterSection = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main">
            {/* Logo and Description */}
            <div className="footer-logo-wrapper">
              <div className="footer-logo">
                <div className="logo-symbol">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.0003 17.4546C16.8036 17.4546 17.4549 16.8034 17.4549 16C17.4549 15.1967 16.8036 14.5454 16.0003 14.5454C15.1969 14.5454 14.5457 15.1967 14.5457 16C14.5457 16.8034 15.1969 17.4546 16.0003 17.4546Z" fill="#14488C"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.9089 15.9999C10.9089 18.8115 13.1883 21.0907 15.9998 21.0907V18.1815C14.7948 18.1815 13.8179 17.2048 13.8179 15.9998L10.9089 15.9999Z" fill="#B6BDCC"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M21.091 16.0002C21.091 13.1884 18.8117 10.9092 16 10.9092V13.8184C17.2051 13.8184 18.1819 14.7952 18.1819 16.0003L21.091 16.0002Z" fill="#1A232E"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.44189 20.3637C10.8519 24.5378 16.1894 25.968 20.3637 23.558L18.9091 21.0386C16.1262 22.6453 12.5679 21.6918 10.9612 18.909L8.44189 20.3637Z" fill="#1A232E"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.8186 26.7072C15.7321 30.1213 23.2935 28.0952 26.7078 22.1816L24.1883 20.727C21.5775 25.2493 15.7952 26.7985 11.2731 24.1876L9.8186 26.7072Z" fill="#14488C"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M23.5585 11.6363C21.1485 7.46214 15.8109 6.03195 11.6367 8.44195L13.0913 10.9613C15.8741 9.35467 19.4325 10.3081 21.0392 13.091L23.5585 11.6363Z" fill="#14488C"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M22.1819 5.29273C16.2684 1.87863 8.70697 3.90474 5.29272 9.81828L7.81213 11.2729C10.423 6.7506 16.2052 5.20134 20.7274 7.81223L22.1819 5.29273Z" fill="#B6BDCC"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 32C24.8367 32 32 24.8365 32 16.0001H29.0909C29.0909 23.2301 23.23 29.091 15.9999 29.091L16 32Z" fill="#B6BDCC"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 0C7.16332 0 0 7.1635 0 16H2.90923C2.90923 8.76992 8.77011 2.90909 16.0001 2.90909L16 0Z" fill="#1A232E"/>
                  </svg>
                </div>
                <div className="logo-text">
                  <img src={EvimedLogo} alt="Evimed" width="85" height="14" />
                </div>
              </div>
              <p className="footer-description">Независимые центры рентгено-диагностики</p>
            </div>
            
            {/* Navigation - Now on the right side */}
            <div className="footer-nav-column">
              <a href="#about" className="footer-nav-link">Почему мы?</a>
              <a href="#services" className="footer-nav-link">Услуги</a>
              <a href="#contact" className="footer-nav-link">Наши адреса</a>
            </div>
          

          {/* Right Section - Contact Info */}
          <div className="footer-right">
            <div className="footer-contact">
              <div className="footer-contact-info">
                <a href="tel:+74954924340" className="footer-contact-link">+7 (495) 492-43-40</a>
                <div className="contact-underline"></div>
              </div>
              <div className="footer-contact-info">
                <a href="mailto:info@axiomaykt.ru" className="footer-contact-link">info@axiomaykt.ru</a>
                <div className="contact-underline"></div>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Telegram">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0.833 10L18.333 1.667L16.667 18.333L8.333 10L0.833 10Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.667 10C16.667 13.682 13.682 16.667 10 16.667C8.333 16.667 6.833 16 5.667 15L1.667 16.667L3.333 12.667C2.333 11.5 1.667 10 1.667 8.333C1.667 4.651 4.651 1.667 8.333 1.667C12.015 1.667 15 4.651 15 8.333" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="VK">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10.833 13.333C11.5 13.333 11.833 12.833 11.833 12.833S11.833 11.5 12.5 11.167C13.167 10.833 14 12 14.833 12.667C15.5 13.167 16 13.333 16 13.333H18.333C18.333 13.333 17.5 12.167 16.167 10.833C14.833 9.5 15.167 9.833 16.833 7.5C17.833 6 18.167 5.167 18 4.833C17.833 4.5 17 4.667 17 4.667H14.667C14.667 4.667 14.5 4.5 14.333 4.667C14.167 4.833 14 5.167 14 5.167S13.5 6.333 12.833 7.167C11.5 8.833 11 8.5 10.833 8.333C10.5 8 10.5 7.167 10.5 6.5C10.5 5.167 10.667 4.5 10 4.167C9.833 4 9.5 4 8.833 4C7.833 4 7 4 6.5 4.333C6.167 4.5 6 4.833 6.167 4.833C6.333 4.833 6.667 4.833 6.833 5.167C7.167 5.667 7.167 6.833 7.167 6.833S7.333 8.167 6.833 8.5C6.5 8.667 6 8.167 5 6.5C4.333 5.667 3.833 4.667 3.833 4.667S3.667 4.333 3.5 4.167C3.333 4 3 4 3 4H0.833C0.833 4 0.5 4 0.667 4.333C0.833 4.667 3.167 9.167 5.833 11.833C8.167 14.167 10.833 13.333 10.833 13.333Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="1.667" y="1.667" width="16.667" height="16.667" rx="5" stroke="currentColor" strokeWidth="1.667"/>
                  <circle cx="10" cy="10" r="3.333" stroke="currentColor" strokeWidth="1.667"/>
                  <circle cx="15" cy="5" r="0.833" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Max">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3.333 6.667L10 10L16.667 6.667M3.333 6.667V13.333C3.333 14.254 4.079 15 5 15H15C15.921 15 16.667 14.254 16.667 13.333V6.667M3.333 6.667C3.333 5.746 4.079 5 5 5H15C15.921 5 16.667 5.746 16.667 6.667" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright"> 2025, Независимые центры рентгенодиагностики «Evimed»</p>
          <a href="#privacy" className="footer-privacy-link">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;





