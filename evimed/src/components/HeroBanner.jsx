import React, { useState, useEffect } from 'react';
import './HeroBanner.css';
import heroEquipment from '../assets/images/hero/hero-equipment.png';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch(`${API_BASE}/banners`);
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
      // Fallback к статичным данным
      setBanners([
        {
          id: 1,
          title: 'Федеральная сеть независимых центров рентгенодиагностики «Эвимед»',
          description: 'Предоставляем услуги в области рентгенодиагностики для стоматологов, оториноларингологов и челюстно–лицевых хирургов.',
          order: 1
        },
        {
          id: 2,
          title: 'Мы открыли уникальный центр функциональной диагностики!',
          description: 'Предоставляем услуги в области рентгенодиагностики для стоматологов, оториноларингологов и челюстно–лицевых хирургов.',
          order: 2
        }
      ]);
    }
  };

  const totalSlides = banners.length || 2;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  useEffect(() => {
    if (totalSlides > 1) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(timer);
    }
  }, [currentSlide, totalSlides]);

  return (
    <section className="hero-banner">
      {banners.map((banner, index) => (
        <div key={banner.id} className={`hero-slide ${currentSlide === index ? 'active' : ''}`}>
          {/* Hero Image */}
          <div className="hero-image">
            <img 
              src={banner.imageUrl || heroEquipment} 
              alt={banner.imageAlt || 'Медицинское оборудование'} 
              className="equipment-image"
            />
          </div>
          
          {/* Hero Content */}
          <div className="hero-content">
            {/* Text Content */}
            <div className="hero-text">
              <h1 className="hero-title">
                {banner.title}
              </h1>
              {banner.description && (
                <p className="hero-description">
                  {banner.description}
                </p>
              )}
            </div>
            
            {/* CTA Button */}
            <button className="hero-button" onClick={() => window.location.href = '/appointment'}>
              <span className="hero-button-text">Записаться на прием</span>
              <svg className="hero-button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M1.67 10H15.83M15.83 10L10 4.17M15.83 10L10 15.83" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Slider Navigation */}
      <div className="hero-slider-nav">
        <div className="slider-arrows">
          <button className="slider-arrow slider-arrow-left" onClick={prevSlide} disabled={currentSlide === 0}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M30 12L18 24L30 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slider-arrow slider-arrow-right" onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M18 12L30 24L18 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="slider-dots">
          {banners.map((banner, index) => (
            <button 
              key={banner.id}
              className={`slider-dot ${currentSlide === index ? 'active' : ''}`} 
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
