import React from 'react';
import './HeaderSection.css';
import SymbolLogo from '../assets/images/icons/Symbol_Logo.svg';
import EvimedLogo from '../assets/images/icons/Evimed.svg';

const HeaderSection = () => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleConsultationClick = () => {
    console.log('Consultation button clicked');
  };

  return (
    <header className="header-section" role="banner">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={handleLogoClick} role="button" tabIndex={0} aria-label="Перейти на главную">
              <div className="logo-symbol" aria-hidden="true">
                <img src={SymbolLogo} alt="Evimed Symbol" width="36" height="36" />
              </div>
              <img src={EvimedLogo} alt="Evimed" className="logo-text" width="96" height="16" />
            </div>
            
            <nav className="navigation" role="navigation" aria-label="Главное меню">
              <button 
                className="nav-button" 
                onClick={() => handleNavClick('advantages')}
                aria-label="Перейти к разделу Почему мы"
              >
                Почему мы?
              </button>
              <button 
                className="nav-button" 
                onClick={() => handleNavClick('services')}
                aria-label="Перейти к разделу Услуги"
              >
                Услуги
              </button>
              <button 
                className="nav-button" 
                onClick={() => handleNavClick('contacts')}
                aria-label="Перейти к разделу Наши адреса"
              >
                Наши адреса
              </button>
            </nav>
          </div>
          
          <div className="header-right">
            <div className="phone-section">
              <a href="tel:+74954924340" className="phone-number" aria-label="Позвонить по номеру +7 (495) 492-43-40">
                +7 (495) 492-43-40
              </a>
            </div>
            
            <button className="consultation-button" onClick={handleConsultationClick} aria-label="Получить консультацию">
              <span>Консультация</span>
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3.75 9H14.25M14.25 9L9 3.75M14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
