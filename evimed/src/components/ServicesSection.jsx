import React, { useRef, useState, useEffect } from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  // Tabs state
  const [activeTab, setActiveTab] = useState(1); // Default to second tab (index 1)
  const [isDragging, setIsDragging] = useState(false);
  const tabsRef = useRef(null);
  
  // Data state
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadServicesForCategory(categories[activeTab]?.id);
    }
  }, [categories, activeTab]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/service-categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      // Fallback к статичным данным
      setCategories([
        { id: 1, name: 'Двухмерные рентгенологические исследования', order: 1 },
        { id: 2, name: 'Трехмерные рентгенологические исследования челюстей (КЛКТ)', order: 2 },
        { id: 3, name: 'ЛОР-исследования', order: 3 },
        { id: 4, name: 'Дополнительные услуги', order: 4 },
        { id: 5, name: 'Пакетные предложения', order: 5 },
        { id: 6, name: 'Распечатка и дублирование', order: 6 }
      ]);
    }
  };

  const loadServicesForCategory = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      const response = await fetch(`${API_BASE}/services/category/${categoryId}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      // Fallback к статичным данным для КЛКТ
      if (categoryId === 2) {
        setServices([
          {
            id: 1,
            name: '5×5 см, KaVo / область одного сегмента (4-6 зубов)',
            description: '3D-снимок отображает реальные размеры и пропорции анатомических структур',
            duration: '15–30 мин',
            preparation: 'Без подготовки',
            price: 1200
          },
          {
            id: 2,
            name: '6×8 см, KaVo / область зубных дуг (запись на CD)',
            description: '3D-снимок отображает реальные размеры и пропорции анатомических структур',
            duration: '1-2 часа',
            preparation: 'Требуется подготовка',
            price: 1700
          },
          {
            id: 3,
            name: '8×8 см, KaVo / область зубных дуг, нижнечелюстной канал (запись на CD)',
            description: '3D-снимок отображает реальные размеры и пропорции анатомических структур без искажений и со всех сторон. Это позволяет максимально детально изучить диагностическую картину и корректно спланировать лечение.',
            duration: '15 мин',
            preparation: 'Без подготовки',
            price: 2400
          },
          {
            id: 4,
            name: '8×15 см, KaVo / зубные дуги, нижнечелюстной канал, дно верхнечелюстной пазухи',
            description: '3D-снимок отображает реальные размеры и пропорции анатомических структур',
            duration: '30 мин',
            preparation: 'Требуется подготовка',
            price: 3300
          },
          {
            id: 5,
            name: '13×15 см, KaVo / полная челюстно-лицевая область, ВНЧС (CD-запись)',
            description: '3D-снимок отображает реальные размеры и пропорции анатомических структур без искажений и со всех сторон. Это позволяет максимально детально изучить диагностическую картину и корректно спланировать лечение.',
            duration: '1 час',
            preparation: 'Без подготовки',
            price: 3500
          }
        ]);
      } else {
        setServices([]);
      }
    }
  };
  
  // Handle mouse down for drag scrolling
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    tabsRef.current.style.cursor = 'grabbing';
  };
  
  // Handle mouse move for drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    tabsRef.current.scrollLeft -= e.movementX;
  };
  
  // Handle mouse up/leave to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    if (tabsRef.current) {
      tabsRef.current.style.cursor = 'grab';
    }
  };

  // Set cursor style on mount/update
  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.style.cursor = 'grab';
    }
  }, []);

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        {/* Top area */}
        <div className="services-top">
          <div className="services-subhead">Наши услуги</div>

          <div className="services-toprow">
            <h2 className="services-main-title">
              Глубокое обследование и персональное лечение
            </h2>
            <div className="services-title-line"></div>
            <button className="choose-service-btn" type="button">
              <span>Выбрать услугу</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.75 6.00311C0.75 5.5889 1.08579 5.25311 1.5 5.25311H10.5C10.9142 5.25311 11.25 5.5889 11.25 6.00311C11.25 6.41733 10.9142 6.75311 10.5 6.75311H1.5C1.08579 6.75311 0.75 6.41733 0.75 6.00311Z" fill="#14488C" fill-opacity="0.92"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 0.96967C5.76256 0.676777 6.23744 0.676777 6.53033 0.96967L11.0303 5.46967C11.3232 5.76256 11.3232 6.23744 11.0303 6.53033L6.53033 11.0303C6.23744 11.3232 5.76256 11.3232 5.46967 11.0303C5.17678 10.7374 5.17678 10.2626 5.46967 9.96967L9.43934 6L5.46967 2.03033C5.17678 1.73744 5.17678 1.26256 5.46967 0.96967Z" fill="#14488C" fill-opacity="0.92"/>
</svg>

            </button>
          </div>

          <p className="services-lead">
            Мы делаем двухмерные (2D) и современные трехмерные (3D) исследования
            челюстно-лицевой области для стоматологов, оториноларингологов и
            челюстно-лицевых хирургов.
          </p>
        </div>

        {/* Tabs */}
        <div 
          className="services-tabs" 
          ref={tabsRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {categories.map((category, idx) => (
            <button
              key={category.id}
              className={`services-tab ${activeTab === idx ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab(idx)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Offer banner */}
        <div className="promo-banner">
          <div className="promo-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#58B8B1" strokeWidth="2"/>
              <path d="M10 5.5V10.5" stroke="#58B8B1" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="13.5" r="1" fill="#58B8B1"/>
            </svg>
          </div>
          <p className="promo-text">
            <span>
              Повторное исследование любого размера в рамках одного курса лечения —
            </span>
            <strong> 50% от стоимости</strong>
            <span> (запись на CD)</span>
            <br />
            <small>
              * Предложение действительно в течение 1 года, используется 1 раз.
            </small>
          </p>
        </div>

        {/* CT Cards */}
        <div className="services-grid ct-grid">
          {services.map((service, idx) => (
            <div key={service.id || idx} className="ct-card">
              <div className="ct-head">
                <div className="ct-title">
                  <div className="ct-title-line">{service.name}</div>
                </div>
                <p className="ct-desc">{service.description}</p>
              </div>
              <div className="ct-meta">
                <div className="ct-meta-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.833374 10C0.833374 4.93743 4.93743 0.833374 10 0.833374C15.0627 0.833374 19.1667 4.93743 19.1667 10C19.1667 15.0627 15.0627 19.1667 10 19.1667C4.93743 19.1667 0.833374 15.0627 0.833374 10ZM10 2.50004C5.8579 2.50004 2.50004 5.8579 2.50004 10C2.50004 14.1422 5.8579 17.5 10 17.5C14.1422 17.5 17.5 14.1422 17.5 10C17.5 5.8579 14.1422 2.50004 10 2.50004ZM10.0036 4.16671C10.4638 4.16675 10.8369 4.53989 10.8368 5.00012L10.8364 9.65856L14.1253 12.9475C14.4508 13.273 14.4508 13.8006 14.1253 14.126C13.7999 14.4515 13.2723 14.4515 12.9468 14.126L9.41374 10.593C9.25744 10.4367 9.16964 10.2247 9.16966 10.0036L9.17017 4.99996C9.17021 4.53972 9.54334 4.16666 10.0036 4.16671Z" fill="#14488C" fillOpacity="0.44"/>
                  </svg>
                  <span>{service.duration}</span>
                </div>
                <div className="ct-meta-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.833374 10C0.833374 4.93743 4.93743 0.833374 10 0.833374C15.0627 0.833374 19.1667 4.93743 19.1667 10C19.1667 15.0627 15.0627 19.1667 10 19.1667C4.93743 19.1667 0.833374 15.0627 0.833374 10ZM10 2.50004C5.8579 2.50004 2.50004 5.8579 2.50004 10C2.50004 14.1422 5.8579 17.5 10 17.5C14.1422 17.5 17.5 14.1422 17.5 10C17.5 5.8579 14.1422 2.50004 10 2.50004Z" fill="#14488C" fillOpacity="0.44"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M13.9226 7.74412C14.2481 8.06955 14.2481 8.59719 13.9226 8.92263L9.75596 13.0893C9.43053 13.4147 8.90289 13.4147 8.57745 13.0893L6.07745 10.5893C5.75201 10.2639 5.75201 9.73622 6.07745 9.41078C6.40289 9.08535 6.93053 9.08535 7.25596 9.41078L9.16671 11.3215L12.7441 7.74412C13.0696 7.41868 13.5972 7.41868 13.9226 7.74412Z" fill="#14488C" fillOpacity="0.44"/>
                </svg>
                  <span>{service.preparation}</span>
                </div>
              </div>

              <div className="ct-footer">
                <div className="ct-price">
                  <span className="ct-price-value">{service.price}</span>
                  <span className="ct-price-currency">₽</span>
                </div>
                <div className="ct-actions">
                  <button className="ct-icon-btn" type="button" aria-label="Подробнее">
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 4.96875C1.5 4.55454 1.83579 4.21875 2.25 4.21875H3C3.41421 4.21875 3.75 4.55454 3.75 4.96875V10.0313H4.3125C4.72671 10.0313 5.0625 10.3671 5.0625 10.7813C5.0625 11.1955 4.72671 11.5313 4.3125 11.5313H1.6875C1.27329 11.5313 0.9375 11.1955 0.9375 10.7813C0.9375 10.3671 1.27329 10.0313 1.6875 10.0313H2.25V5.71875C1.83579 5.71875 1.5 5.38296 1.5 4.96875Z" fill="#14488C"/>
                  <path d="M3.9375 1.59375C3.9375 2.21507 3.43382 2.71875 2.8125 2.71875C2.19118 2.71875 1.6875 2.21507 1.6875 1.59375C1.6875 0.97243 2.19118 0.46875 2.8125 0.46875C3.43382 0.46875 3.9375 0.97243 3.9375 1.59375Z" fill="#14488C"/>
                  </svg>
                  </button>
                  <button className="ct-icon-btn outline" type="button" aria-label="Записаться">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.75 6.00311C0.75 5.5889 1.08579 5.25311 1.5 5.25311H10.5C10.9142 5.25311 11.25 5.5889 11.25 6.00311C11.25 6.41733 10.9142 6.75311 10.5 6.75311H1.5C1.08579 6.75311 0.75 6.41733 0.75 6.00311Z" fill="#14488C" fill-opacity="0.92"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 0.96967C5.76256 0.676777 6.23744 0.676777 6.53033 0.96967L11.0303 5.46967C11.3232 5.76256 11.3232 6.23744 11.0303 6.53033L6.53033 11.0303C6.23744 11.3232 5.76256 11.3232 5.46967 11.0303C5.17678 10.7374 5.17678 10.2626 5.46967 9.96967L9.43934 6L5.46967 2.03033C5.17678 1.73744 5.17678 1.26256 5.46967 0.96967Z" fill="#14488C" fill-opacity="0.92"/>
                    </svg>
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

export default ServicesSection;