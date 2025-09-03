import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="16" fill="none" stroke="#14488C" strokeWidth="2" strokeDasharray="4 4"/>
        </svg>
      ),
      title: "Рентгенография",
      description: "Классические двухмерные снимки для диагностики стоматологических проблем",
      features: ["Быстрое выполнение", "Высокое качество", "Мгновенный результат"]
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 16L48 16M16 32L48 32M16 48L48 48" stroke="#14488C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Компьютерная томография",
      description: "Современные трехмерные исследования для точной диагностики",
      features: ["3D моделирование", "Высокая точность", "Детальная визуализация"]
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="12" fill="none" stroke="#14488C" strokeWidth="2"/>
          <path d="M32 20L32 44M20 32L44 32" stroke="#14488C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Консультации специалистов",
      description: "Профессиональные консультации по результатам исследований",
      features: ["Опытные врачи", "Подробные объяснения", "Рекомендации по лечению"]
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 24L40 24M24 32L40 32M24 40L40 40" stroke="#14488C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Подготовка к исследованиям",
      description: "Подробные инструкции по подготовке к диагностическим процедурам",
      features: ["Четкие инструкции", "Поддержка 24/7", "Минимальные ограничения"]
    }
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Наши услуги</h2>
          <div className="title-line"></div>
          <p className="services-subtitle">
            Полный спектр диагностических услуг
          </p>
          <p className="services-description">
            Предоставляем современные методы диагностики для точного выявления 
            проблем челюстно-лицевой области с использованием передового оборудования.
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
                    <svg className="feature-check" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16 6L8 14L4 10" stroke="#14488C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="service-button">
                <span>Подробнее</span>
                <svg className="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 4L16 12L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;





