import React from 'react';
import './HeroBanner.css';
import heroEquipment from '../assets/images/hero/hero-equipment.png';

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      {/* Background Image */}
      <div className="hero-background"></div>
      
      {/* Hero Image */}
      <div className="hero-image">
        <img 
          src={heroEquipment} 
          alt="Ортопантомограф OP300" 
          className="equipment-image"
        />
      </div>
      
      {/* Hero Content */}
      <div className="hero-content">
        {/* Text Content */}
        <div className="hero-text">
          <h1 className="hero-title">
            Федеральная сеть независимых центров рентгенодиагностики «Эвимед»
          </h1>
          <p className="hero-description">
            Предоставляем услуги в области рентгенодиагностики для стоматологов, оториноларингологов и челюстно–лицевых хирургов.
          </p>
        </div>
        
        {/* CTA Button */}
        <button className="hero-button">
          <span className="hero-button-text">Записаться на прием</span>
          <svg className="hero-button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1.67 10H15.83M15.83 10L10 4.17M15.83 10L10 15.83" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Slider Navigation */}
      <div className="hero-slider-nav">
        <div className="slider-arrows">
          <button className="slider-arrow slider-arrow-left" disabled>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M30 12L18 24L30 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slider-arrow slider-arrow-right">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M18 12L30 24L18 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="slider-dots">
          <div className="slider-dot active"></div>
          <div className="slider-dot"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
