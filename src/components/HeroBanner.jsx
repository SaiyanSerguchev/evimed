import React from 'react';
import './HeroBanner.css';
import heroEquipment from '../assets/images/hero/hero-equipment.png';

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      {/* Hero Image - Outside container to cover full banner */}
      <div className="hero-image">
        <img 
          src={heroEquipment} 
          alt="Ортопантомограф OP300 - современное оборудование для рентгенодиагностики" 
          className="equipment-image"
        />
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Федеральная сеть независимых центров рентгенодиагностики «Эвимед»
            </h1>
            <p className="hero-description">
              Предоставляем услуги в области рентгенодиагностики для стоматологов, оториноларинголов и челюстно–лицевых хирургов.
            </p>
            <button className="hero-cta-button">
              <span>Записаться на прием</span>
              <svg className="cta-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.75 9H14.25M14.25 9L9 3.75M14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Slider Navigation */}
      <div className="hero-slider-nav">
        <div className="slider-arrows">
          <button className="slider-arrow slider-arrow-left" disabled>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M20 8L12 16L20 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slider-arrow slider-arrow-right">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M12 8L20 16L12 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
