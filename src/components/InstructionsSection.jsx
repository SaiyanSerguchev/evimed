import React from 'react';
import './InstructionsSection.css';

const InstructionsSection = () => {
  // Steps content (our SVG icons per your instruction)
  const steps = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2a7 7 0 0 0-7 7c0 3.866 3.134 7 7 7h1v2a2 2 0 1 0 4 0v-2h1a1 1 0 0 0 0-2h-6a5 5 0 1 1 5-5 1 1 0 0 0 2 0 7 7 0 0 0-7-7z" fill="#8690A3"/>
        </svg>
      ),
      text: 'Рекомендуем приходить по предварительной записи',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2a5 5 0 0 1 5 5v1a4 4 0 0 1-4 4H7a3 3 0 0 1-3-3V7a5 5 0 0 1 5-5h3z" fill="#8690A3"/>
          <circle cx="8.5" cy="17.5" r="2.5" fill="#8690A3"/>
          <circle cx="15.5" cy="17.5" r="2.5" fill="#8690A3"/>
        </svg>
      ),
      text: 'Перед исследованием нужно снять съемные металлические предметы (серьги, цепочки, пирсинги и тд)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#8690A3" strokeWidth="2"/>
          <path d="M7 9h6M7 13h10" stroke="#8690A3" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      text: 'Не забудьте направление от лечащего врача (при наличии) и документ удостоверяющий личность.',
    },
  ];

  return (
    <section className="instr-section">
      <div className="instr-container">
        {/* Kicker stays on the left column */}
        <div className="instr-kicker">Порядок проведения исследования</div>

        {/* Title row spans both columns: title — divider — button aligned to the right edge */}
        <div className="instr-title-row">
          <h2 className="instr-title">Подготовка к исследованию</h2>
          <div className="instr-title-divider" aria-hidden></div>
          <button className="instr-link" type="button" aria-label="Подробная инструкция">
            <span>Подробная инструкция</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M8 5L16 12L8 19" stroke="#C8DEFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Left content under title */}
        <div className="instr-left">
          <p className="instr-lead">
            Вам предстоит пройти обследование на высокотехнологичном компьютерном томографе, который
            отвечает самым высоким стандартам качества и безопасности, и в этом вам поможет квалифицированный
            медицинский персонал.
          </p>

          <ul className="instr-list">
            {steps.map((s, i) => (
              <li className="instr-item" key={i}>
                <div className="instr-icon-chip">{s.icon}</div>
                <div className="instr-item-text">{s.text}</div>
              </li>
            ))}
          </ul>

          <div className="instr-cta-wrap">
            <button className="instr-cta" type="button">
              <span>Записаться на прием</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M8 5L16 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="instr-right" aria-hidden>
          <div className="instr-right-bg" />
        </div>
      </div>
    </section>
  );
};

export default InstructionsSection;