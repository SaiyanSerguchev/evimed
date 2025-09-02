import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="8" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="2"/>
          <circle cx="24" cy="28" r="4" fill="currentColor"/>
        </svg>
      ),
      title: "Рентгенография",
      description: "Традиционные двухмерные снимки для диагностики различных патологий",
      features: ["Быстрое выполнение", "Высокая точность", "Доступная цена"]
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M 12 24 L 20 32 L 36 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Компьютерная томография",
      description: "Современные 3D исследования для детальной диагностики",
      features: ["3D изображения", "Высокое разрешение", "Безопасность"]
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M 24 8 L 32 16 L 24 24 L 16 16 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M 24 24 L 32 32 L 24 40 L 16 32 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Консультации специалистов",
      description: "Профессиональные консультации опытных врачей-рентгенологов",
      features: ["Опытные врачи", "Подробные объяснения", "Рекомендации"]
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="services-header">
          <h2 className="services-title">Услуги</h2>
          <div className="title-line"></div>
          <p className="services-subtitle">
            Наши услуги
          </p>
          <p className="services-description">
            Предоставляем полный спектр услуг в области рентгенодиагностики 
            для точной постановки диагноза и эффективного лечения.
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="service-feature">
                    <svg className="feature-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M 3 8 L 7 12 L 13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;




