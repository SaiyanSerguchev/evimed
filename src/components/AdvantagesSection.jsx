import React from 'react';
import './AdvantagesSection.css';

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="20" y1="20" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="20" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 12 20 L 16 24 L 28 12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Диагностика без очередей",
      description: "Прием ведется только по предварительной записи. Снимок вы получите сразу же после исследования"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M 12 20 L 16 24 L 28 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M 20 12 L 20 28 M 12 20 L 28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "270+ центров диагностики в России",
      description: "Широкая сеть наших центров диагностики охватывает всю страну и постоянно растет"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M 12 20 L 16 24 L 28 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 15 15 L 25 25 M 25 15 L 15 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Современное оборудование",
      description: "Используем только современное оборудование для получения высококачественных снимков"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M 12 20 L 16 24 L 28 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 12 16 L 28 16 M 12 24 L 28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Опытные специалисты",
      description: "Наши специалисты имеют многолетний опыт работы в области рентгенодиагностики"
    }
  ];

  return (
    <section className="advantages-section">
      <div className="container">
        <div className="advantages-header">
          <h2 className="advantages-title">Почему мы?</h2>
          <div className="title-line"></div>
          <p className="advantages-subtitle">
            Забота о здоровье для нас это искусство
          </p>
          <p className="advantages-description">
            Мы делаем двухмерные (2D) и современные трехмерные (3D) исследования 
            челюстно-лицевой области для стоматологов, отоларингологов и 
            челюстно-лицевых хирургов.
          </p>
        </div>
        
        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <div key={index} className="advantage-card">
              <div className="advantage-icon">
                {advantage.icon}
              </div>
              <h3 className="advantage-title">{advantage.title}</h3>
              <p className="advantage-description">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;

