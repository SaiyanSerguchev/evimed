import React from 'react';
import './InstructionsSection.css';

const InstructionsSection = () => {
  const instructions = [
    {
      step: 1,
      title: "Запись на прием",
      description: "Позвоните нам или запишитесь онлайн на удобное для вас время. Мы подберем оптимальное время для исследования.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="16" y="16" width="32" height="24" rx="4" fill="none" stroke="#14488C" strokeWidth="2"/>
          <line x1="16" y1="24" x2="48" y2="24" stroke="#14488C" strokeWidth="2"/>
          <circle cx="32" cy="32" r="4" fill="#14488C"/>
        </svg>
      )
    },
    {
      step: 2,
      title: "Подготовка к исследованию",
      description: "Получите подробные инструкции по подготовке к исследованию. Минимальные ограничения для вашего комфорта.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="#14488C" strokeWidth="2"/>
          <path d="M32 16L32 48M16 32L48 32" stroke="#14488C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      step: 3,
      title: "Проведение исследования",
      description: "Проходите исследование в комфортной обстановке. Наши специалисты обеспечат максимальный комфорт.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="16" y="16" width="32" height="32" rx="6" fill="none" stroke="#14488C" strokeWidth="2"/>
          <circle cx="32" cy="32" r="8" fill="#14488C"/>
        </svg>
      )
    },
    {
      step: 4,
      title: "Получение результатов",
      description: "Получите результаты исследования сразу после процедуры. Быстро, качественно и без ожидания.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="rgba(20, 72, 140, 0.06)" stroke="#14488C" strokeWidth="2"/>
          <path d="M20 20L28 28L44 12" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 24L32 40L48 24" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 20L32 36L48 20" stroke="#14488C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="instructions-section">
      <div className="instructions-container">
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
