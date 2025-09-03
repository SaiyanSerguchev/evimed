import React from 'react';
import './InstructionsSection.css';

const InstructionsSection = () => {
  const instructions = [
    {
      step: 1,
      title: "Запись на прием",
      description: "Позвоните нам или запишитесь онлайн на удобное для вас время",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M 8 12 L 32 12 L 32 28 L 8 28 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="8" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2"/>
          <circle cx="20" cy="22" r="3" fill="currentColor"/>
        </svg>
      )
    },
    {
      step: 2,
      title: "Подготовка к исследованию",
      description: "Получите инструкции по подготовке к исследованию",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M 20 12 L 20 28 M 12 20 L 28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: 3,
      title: "Проведение исследования",
      description: "Проходите исследование в комфортной обстановке",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="8" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="20" cy="20" r="6" fill="currentColor"/>
        </svg>
      )
    },
    {
      step: 4,
      title: "Получение результатов",
      description: "Получите результаты исследования сразу после процедуры",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M 8 16 L 20 28 L 32 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 8 12 L 20 24 L 32 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="instructions-section">
      <div className="container">
        <div className="instructions-header">
          <h2 className="instructions-title">Как это работает</h2>
          <div className="title-line"></div>
          <p className="instructions-subtitle">
            Порядок проведения исследования
          </p>
          <p className="instructions-description">
            Простой и понятный процесс от записи до получения результатов
          </p>
        </div>
        
        <div className="instructions-grid">
          {instructions.map((instruction, index) => (
            <div key={index} className="instruction-card">
              <div className="instruction-step">{instruction.step}</div>
              <div className="instruction-icon">
                {instruction.icon}
              </div>
              <h3 className="instruction-title">{instruction.title}</h3>
              <p className="instruction-description">{instruction.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructionsSection;





