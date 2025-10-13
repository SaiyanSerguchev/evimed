import React, { useState, useEffect } from 'react';
import './AdvantagesSection.css';
import Logo_card1 from '../assets/images/advantages/Logo_card1.svg';
import Logo_card2 from '../assets/images/advantages/Logo_card2.svg';
import Logo_card3 from '../assets/images/advantages/Logo_card3.svg';
import Logo_card4 from '../assets/images/advantages/Logo_card4.svg';

const AdvantagesSection = () => {
  const [advantages, setAdvantages] = useState([]);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    loadAdvantages();
  }, []);

  const loadAdvantages = async () => {
    try {
      const response = await fetch(`${API_BASE}/advantages`);
      const data = await response.json();
      
      // Проверяем формат данных
      let advantagesData = data;
      if (data && typeof data === 'object' && data.advantages) {
        advantagesData = data.advantages;
      }
      
      if (!Array.isArray(advantagesData)) {
        advantagesData = [];
      }
      
      // Сортируем по порядку
      const sortedAdvantages = advantagesData.sort((a, b) => a.order - b.order);
      
      console.log('Загружены преимущества:', sortedAdvantages);
      setAdvantages(sortedAdvantages);
    } catch (error) {
      console.error('Ошибка загрузки преимуществ:', error);
      // Используем данные по умолчанию при ошибке
      setAdvantages(getDefaultAdvantages());
    }
  };

  const getDefaultAdvantages = () => [
    {
      id: 1,
      title: "Диагностика без очередей",
      description: "Прием ведется только по предварительной записи. Сам визит займет у вас от 15 минут. Снимки вы получите сразу же после приема.",
      order: 1
    },
    {
      id: 2,
      title: "270+ центров диагностики в России",
      description: "Широкая сеть наших центров диагностики охватывает всю страну и постоянно растёт. Мы стараемся быть ближе к вам.",
      order: 2
    },
    {
      id: 3,
      title: "Преимущества диагностики",
      description: "В наших центрах вы получите максимально точный и подробный результат исследований. Мы экономим ваше время и деньги.",
      order: 3
    },
    {
      id: 4,
      title: "Высоко-технологичное оборудование",
      description: "Проводим исследования областей размером от 2-3 зубов до всей головы на самом современном оборудовании",
      order: 4
    }
  ];

  const getButtonIcon = (order) => {
    switch (order) {
      case 1:
        return (
          <svg width="19" height="19" viewBox="0 0 19 19" >
            <path fillRule="evenodd" clipRule="evenodd" d="M18.0814 0.902915C18.3121 1.12753 18.3927 1.46496 18.2886 1.76962L12.8741 17.603C12.7546 17.9523 12.4194 18.1814 12.0505 18.1659C11.6816 18.1504 11.3669 17.8939 11.2772 17.5357L9.3206 9.72075L1.50841 8.2091C1.14172 8.13814 0.867019 7.83186 0.83623 7.45963C0.805442 7.0874 1.02608 6.74015 1.37614 6.60991L17.2095 0.718954C17.5112 0.606676 17.8507 0.678295 18.0814 0.902915ZM10.9238 9.2617L12.2093 14.3962L16.1426 2.89419L4.73967 7.13676L9.7267 8.10175L11.7713 6.05718C12.0967 5.73175 12.6243 5.73175 12.9498 6.05718C13.2752 6.38262 13.2752 6.91026 12.9498 7.23569L10.9238 9.2617Z" />
          </svg>
        );
      case 2:
        return (
          <svg width="12" height="16" viewBox="0 0 12 16">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.00342 0.5C6.46366 0.5 6.83675 0.873096 6.83675 1.33333V2.16667C6.83675 2.6269 6.46366 3 6.00342 3C5.54318 3 5.17008 2.6269 5.17008 2.16667V1.33333C5.17008 0.873096 5.54318 0.5 6.00342 0.5ZM6.83675 5.5C6.83675 5.03976 6.46366 4.66667 6.00342 4.66667C5.54318 4.66667 5.17008 5.03976 5.17008 5.5V6.33333C5.17008 6.79357 5.54318 7.16667 6.00342 7.16667C6.46366 7.16667 6.83675 6.79357 6.83675 6.33333V5.5ZM5.4107 15.2559C5.73614 15.5814 6.26378 15.5814 6.58921 15.2559L11.5892 10.2559C11.9147 9.93049 11.9147 9.40285 11.5892 9.07741C11.2638 8.75197 10.7361 8.75197 10.4107 9.07741L6.83675 12.6514V9.66667C6.83675 9.20643 6.46365 8.83333 6.00342 8.83333C5.54318 8.83333 5.17008 9.20643 5.17008 9.66667V12.6583L1.58922 9.07741C1.26378 8.75197 0.736141 8.75197 0.410704 9.07741C0.0852668 9.40285 0.0852668 9.93049 0.410704 10.2559L5.4107 15.2559Z" />
          </svg>
        );
      case 3:
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" >
            <path fillRule="evenodd" clipRule="evenodd" d="M0.166626 6.00342C0.166626 5.54318 0.539722 5.17008 0.999959 5.17008H11C11.4602 5.17008 11.8333 5.54318 11.8333 6.00342C11.8333 6.46366 11.4602 6.83675 11 6.83675H0.999959C0.539722 6.83675 0.166626 6.46366 0.166626 6.00342Z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M5.4107 0.410704C5.73614 0.0852667 6.26378 0.0852667 6.58921 0.410704L11.5892 5.4107C11.9147 5.73614 11.9147 6.26378 11.5892 6.58921L6.58921 11.5892C6.26378 11.9147 5.73614 11.9147 5.4107 11.5892C5.08527 11.2638 5.08527 10.7361 5.4107 10.4107L9.82145 5.99996L5.4107 1.58921C5.08527 1.26378 5.08527 0.736141 5.4107 0.410704Z" />
          </svg>
        );
      case 4:
        return (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.08325 1.58333C4.08325 1.1231 4.45634 0.75 4.91658 0.75H12.4166C12.8768 0.75 13.2499 1.1231 13.2499 1.58333V9.08333C13.2499 9.54357 12.8768 9.91667 12.4166 9.91667C11.9563 9.91667 11.5832 9.54357 11.5832 9.08333V3.59518L2.39921 12.7792C2.07378 13.1047 1.54614 13.1047 1.2207 12.7792C0.895264 12.4538 0.895264 11.9261 1.2207 11.6007L10.4047 2.41667H4.91658C4.45634 2.41667 4.08325 2.04357 4.08325 1.58333Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getSymbol = (order) => {
    switch (order) {
      case 1:
        return <img src={Logo_card1} width="200" height="200" alt="Диагностика без очередей" />;
      case 2:
        return <img src={Logo_card2} width="200" height="200" alt="270+ центров диагностики" />;
      case 3:
        return <img src={Logo_card3} width="200" height="200" alt="Преимущества диагностики" />;
      case 4:
        return <img src={Logo_card4} width="200" height="200" alt="Высоко-технологичное оборудование" />;
      default:
        return null;
    }
  };

  return (
    <section className="advantages-section" id="advantages">
      <div className="advantages-container">
        <div className="advantages-header">
            <div className="advantages-subtitle">Почему мы?</div>
            <div className="advantages-title">
              Забота о здоровье для нас это искусство
              <div className="advantages-title-line"></div>
            </div>

            <p className="advantages-description">
              Мы делаем двухмерные (2D) и современные трехмерные (3D) исследования 
              челюстно-лицевой области<br/> для стоматологов, оториноларингологов и 
              челюстно-лицевых хирургов.
            </p>
        </div>
        
        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <div key={advantage.id || index} className="advantage-card">
              <div className="advantage-content">
                <div className="advantage-text">
                  <h3 className="advantage-title">{advantage.title}</h3>
                  <p className="advantage-description">{advantage.description}</p>
                </div>
                <div className="advantage-actions">
                  <div className="advantage-symbol">
                    {getSymbol(advantage.order)}
                  </div>
                  <button className="advantage-button">
                    {getButtonIcon(advantage.order)}
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