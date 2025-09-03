import React from 'react';
import './AdvantagesSection.css';

const AdvantagesSection = () => {
  const advantages = [
    {
      title: "Диагностика без очередей",
      description: "Прием ведется только по предварительной записи. Сам визит займет у вас от 15 минут. Снимки вы получите сразу же после приема.",
      buttonIcon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4L16 10L10 16" stroke="rgba(20, 72, 140, 0.92)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "270+ центров диагностики в России",
      description: "Широкая сеть наших центров диагностики охватывает всю страну и постоянно растёт. Мы стараемся быть ближе к вам.",
      buttonIcon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 6L10 14M6 10L14 10" stroke="rgba(20, 72, 140, 0.92)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "Преимущества диагностики",
      description: "В наших центрах вы получите максимально точный и подробный результат исследований. Мы экономим ваше время и деньги.",
      buttonIcon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 10L14 10M10 6L10 14" stroke="rgba(20, 72, 140, 0.92)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "Высоко-технологичное оборудование",
      description: "Проводим исследования областей размером от 2-3 зубов до всей головы на самом современном оборудовании",
      buttonIcon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4L16 10L10 16M4 10L10 16" stroke="rgba(20, 72, 140, 0.92)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="advantages-section">
      <div className="advantages-container">
        <div className="advantages-header">
            <div className="advantages-subtitle">Почему мы?</div>
            <div className="advantages-title">
              Забота о здоровье для нас это искусство
            </div>
            <div className="title-line"></div>
            <p className="advantages-description">
              Мы делаем двухмерные (2D) и современные трехмерные (3D) исследования 
              челюстно-лицевой области для стоматологов, оториноларингологов и 
              челюстно-лицевых хирургов.
            </p>
        </div>
        
        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <div key={index} className="advantage-card">
              <div className="advantage-content">
                <div className="advantage-text">
                  <h3 className="advantage-title">{advantage.title}</h3>
                  <p className="advantage-description">{advantage.description}</p>
                </div>
                <div className="advantage-actions">
                  <button className="advantage-button">
                    {advantage.buttonIcon}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;






