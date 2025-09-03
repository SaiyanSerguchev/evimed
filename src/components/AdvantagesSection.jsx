import React from 'react';
import './AdvantagesSection.css';

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M24 32L30 38L40 26" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Диагностика без очередей",
      description: "Прием ведется только по предварительной записи. Снимок вы получите сразу же после исследования"
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 32L28 40L44 24" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="12" fill="none" stroke="#14488C" strokeWidth="2"/>
        </svg>
      ),
      title: "270+ центров диагностики в России",
      description: "Широкая сеть наших центров диагностики охватывает всю страну и постоянно растет"
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <rect x="20" y="20" width="24" height="24" rx="2" fill="none" stroke="#14488C" strokeWidth="2"/>
          <path d="M28 28L36 36M36 28L28 36" stroke="#14488C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Современное оборудование",
      description: "Используем только современное оборудование для получения высококачественных снимков"
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M24 24L40 24M24 32L40 32M24 40L40 40" stroke="#14488C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Опытные специалисты",
      description: "Наши специалисты имеют многолетний опыт работы в области рентгенодиагностики"
    }
  ];

  return (
    <section className="advantages-section">
      <div className="advantages-container">
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





