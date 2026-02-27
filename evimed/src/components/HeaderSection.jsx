import React, { useState, useRef, useEffect } from 'react';
import './HeaderSection.css';
import SymbolLogo from '../assets/images/icons/Symbol_Logo.svg';
import EvimedLogo from '../assets/images/icons/Evimed.svg';
import HamburgerIcon from '../assets/images/icons/hamburger.svg';
import ConsultationModal from './ConsultationModal';

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleConsultationClick = () => {
    setIsConsultationModalOpen(true);
  };
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top ? parseInt(document.body.style.top, 10) * -1 : 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) window.scrollTo(0, scrollY);
    }
  }, [isMobileMenuOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavClick = (section) => {
    closeMobileMenu();
    // Скролл после восстановления body (разблокировка скролла в useEffect)
    setTimeout(() => handleNavClick(section), 100);
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

            <div className="phone-section" ref={dropdownRef} onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
              <div className="phone-numbers-row">
                <a 
                  href="tel:+74112250509" 
                  className="phone-number" 
                  aria-label="Позвонить по номеру +7 (4112) 25-05-09"
                >
                  +7 (4112) 25-05-09
                </a>
                <a 
                  href="tel:+79248650509" 
                  className="phone-number" 
                  aria-label="Позвонить по номеру +7 (924) 865-05-09"
                >
                  +7 (924) 865-05-09
                </a>
              </div>
              <div className={`phone-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                <div className="phone-dropdown-content">
                  <div className="phone-row">
                    <a href="tel:+74112250509" className="phone-number-dropdown">+7 (4112) 25-05-09</a>
                    <a href="tel:+79248650509" className="phone-number-dropdown">+7 (924) 865-05-09</a>
                  </div>
                  
                  <div className="working-hours">
                    <span className="hours-label">Время работы:</span>
                    <span className="hours-value">Будние <b>9:00-20:00</b></span>
                    <span className="hours-value">Выходные <b>10:00-15:00</b></span>
                  </div>
                  
                  <button className="callback-button" onClick={handleConsultationClick}>
                    <span>Консультация</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 3L7.5 6L4.5 9" stroke="#14488C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <button className="mobile-menu-button" onClick={toggleMobileMenu} aria-label="Открыть меню" aria-expanded={isMobileMenuOpen}>
              <img src={HamburgerIcon} alt="Меню" width={24} height={24} />
            </button>
            <button className="consultation-button" onClick={handleConsultationClick} aria-label="Получить консультацию">
              <span>Консультация</span>
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3.75 9H14.25M14.25 9L9 3.75M14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
      <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo" onClick={() => { handleLogoClick(); closeMobileMenu(); }}>
            <div className="logo-symbol">
              <img src={SymbolLogo} alt="Evimed Symbol" width="28" height="28" />
            </div>
            <img src={EvimedLogo} alt="Evimed" className="logo-text" width="96" height="16" />
          </div>
          <button className="close-menu" onClick={closeMobileMenu} aria-label="Закрыть меню">
            &times;
          </button>
        </div>
        <nav className="mobile-nav">
          <button 
            className="mobile-nav-button" 
            onClick={() => handleMobileNavClick('advantages')}
          >
            Почему мы?
          </button>
          <button 
            className="mobile-nav-button" 
            onClick={() => handleMobileNavClick('services')}
          >
            Услуги
          </button>
          <button 
            className="mobile-nav-button" 
            onClick={() => handleMobileNavClick('contacts')}
          >
            Наши адреса
          </button>
        </nav>
        <div className="mobile-contacts">
          <a href="tel:+74112250509" className="mobile-phone">+7 (4112) 25-05-09</a>
          <a href="tel:+79248650509" className="mobile-phone">+7 (924) 865-05-09</a>
          <div className="mobile-working-hours">
            <span>Время работы:</span>
            <span>Будние <b>9:00-20:00</b></span>
            <span>Выходные <b>10:00-15:00</b></span>
          </div>
          <button className="mobile-callback" onClick={() => { handleConsultationClick(); closeMobileMenu(); }}>
            Консультация
          </button>
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </header>
  );
};

export default HeaderSection;
