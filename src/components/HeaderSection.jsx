import React from 'react';
import './HeaderSection.css';
import SymbolLogo from '../assets/images/icons/Symbol_Logo.svg';
import EvimedLogo from '../assets/images/icons/Evimed.svg';

const HeaderSection = () => {
  const handleLogoClick = () => {
    // Scroll to top when logo is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (section) => {
    // Handle navigation clicks
    console.log(`Navigating to: ${section}`);
    // Add smooth scrolling to sections here
  };

  const handleConsultationClick = () => {
    // Handle consultation button click
    console.log('Consultation button clicked');
    // Add consultation form or modal here
  };

  return (
    <header className="header-section" role="banner">
      <div className="container">
        <div className="header-content">
          {/* Left Section - Logo and Navigation */}
          <div className="header-left">
            {/* Logo */}
            <div className="logo" onClick={handleLogoClick} role="button" tabIndex={0} aria-label="Перейти на главную">
              <div className="logo-symbol" aria-hidden="true">
                <img src={SymbolLogo} alt="Evimed Symbol" width="36" height="36" />
              </div>
              <img src={EvimedLogo} alt="Evimed" className="logo-text" width="96" height="16" />
            </div>
            
            {/* Navigation Menu */}
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
          
          {/* Right Section - Phone and Consultation Button */}
          <div className="header-right">
            {/* Phone Number */}
            <div className="phone-section">
              <a 
                href="tel:+74954924340" 
                className="phone-number"
                aria-label="Позвонить по номеру +7 (495) 492-43-40"
              >
                +7 (495) 492-43-40
              </a>
            </div>
            
            {/* Consultation Button */}
            <button 
              className="consultation-button"
              onClick={handleConsultationClick}
              aria-label="Получить консультацию"
            >
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

