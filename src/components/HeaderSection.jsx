import React from 'react';
import './HeaderSection.css';

const HeaderSection = () => {
  return (
    <header className="header-section">
      <div className="container">
        <div className="header-content">
          {/* Left Section - Logo and Navigation */}
          <div className="header-left">
            {/* Logo */}
            <div className="logo">
              <div className="logo-symbol">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16.36" fill="var(--color-primary-800)"/>
                  <text x="18" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Э</text>
                </svg>
              </div>
              <span className="logo-text">Evimed</span>
            </div>
            
            {/* Navigation Menu */}
            <nav className="navigation">
              <button className="nav-button">Почему мы?</button>
              <button className="nav-button">Услуги</button>
              <button className="nav-button">Наши адреса</button>
            </nav>
          </div>
          
          {/* Right Section - Phone and Consultation Button */}
          <div className="header-right">
            {/* Phone Number */}
            <div className="phone-section">
              <a href="tel:+74954924340" className="phone-number">
                +7 (495) 492-43-40
              </a>
              <div className="phone-underline"></div>
            </div>
            
            {/* Consultation Button */}
            <button className="consultation-button">
              <span>Консультация</span>
              <svg className="arrow-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
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

