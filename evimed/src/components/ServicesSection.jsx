import React, { useRef, useState, useEffect } from 'react';
import AppointmentModal from './AppointmentModal';
import ConsultationModal from './ConsultationModal';
import './ServicesSection.css';

const ServicesSection = () => {
  // Tabs state
  const [activeTab, setActiveTab] = useState(0); // Default to first tab with services
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const tabsRef = useRef(null);
  
  // Data state
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  
  // Modal state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedServiceForAppointment, setSelectedServiceForAppointment] = useState(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationComment, setConsultationComment] = useState('');
  
  // Show all state
  const [showAllServices, setShowAllServices] = useState(false);
  const [servicesPerRow, setServicesPerRow] = useState(3); // Динамически определяется
  const [isMobile, setIsMobile] = useState(false);
  const DEFAULT_ROWS = 2;
  const MOBILE_BREAKPOINT = 480;
  const gridRef = useRef(null);
  
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadServicesForCategory(categories[activeTab]?.id);
      setShowAllServices(false); // Сбрасываем при смене категории
    }
  }, [categories, activeTab]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/service-categories`);
      const data = await response.json();
      // Фильтруем только корневые категории (без parentId) с услугами и сортируем по order
      const categoriesWithServices = Array.isArray(data) 
        ? data.filter(cat => !cat.parentId && cat.services && cat.services.length > 0)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
      setCategories(categoriesWithServices);
    } catch (error) {
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
      // Ensure data is an array before setting
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
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
  
  // Улучшенный drag scrolling
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
    tabsRef.current.style.cursor = 'grabbing';
    tabsRef.current.style.userSelect = 'none';
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Множитель для скорости скролла
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    if (tabsRef.current) {
      tabsRef.current.style.cursor = 'grab';
      tabsRef.current.style.userSelect = '';
    }
  };

  const handleTabClick = (idx) => {
    // Предотвращаем клик если был drag
    if (Math.abs(tabsRef.current.scrollLeft - scrollLeft) > 5) {
      return;
    }
    setActiveTab(idx);
  };

  // Отслеживание мобильной версии и количества колонок в grid
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateColumnsCount = () => {
      const gridComputedStyle = window.getComputedStyle(grid);
      const gridTemplateColumns = gridComputedStyle.getPropertyValue('grid-template-columns');
      const columnsCount = gridTemplateColumns.split(' ').length;
      setServicesPerRow(columnsCount);
      
      // Проверяем мобильную версию
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Начальный подсчет
    updateColumnsCount();

    // Отслеживаем изменения размера
    const resizeObserver = new ResizeObserver(updateColumnsCount);
    resizeObserver.observe(grid);

    return () => {
      resizeObserver.disconnect();
    };
  }, [services]);

  // Set cursor style and wheel listener on mount
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    
    container.style.cursor = 'grab';
    
    let scrollAnimation = null;
    let targetScrollLeft = container.scrollLeft;
    
    // Плавная анимация скролла
    const smoothScrollTo = (target) => {
      if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
      }
      
      const start = container.scrollLeft;
      const distance = target - start;
      const duration = 300; // мс
      const startTime = performance.now();
      
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        
        container.scrollLeft = start + distance * eased;
        
        if (progress < 1) {
          scrollAnimation = requestAnimationFrame(animate);
        }
      };
      
      scrollAnimation = requestAnimationFrame(animate);
    };
    
    // Нативный обработчик wheel с passive: false для preventDefault
    const handleWheel = (e) => {
      const isScrollable = container.scrollWidth > container.clientWidth;
      
      if (isScrollable && e.deltaY !== 0) {
        e.preventDefault();
        
        // Накапливаем целевую позицию
        targetScrollLeft = Math.max(
          0,
          Math.min(
            container.scrollWidth - container.clientWidth,
            targetScrollLeft + e.deltaY
          )
        );
        
        smoothScrollTo(targetScrollLeft);
      }
    };
    
    // Добавляем нативный слушатель с passive: false
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Cleanup
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
      }
    };
  }, []);

  // Проверка, является ли категория ЛОР исследованием
  const isLorCategory = (categoryName) => {
    if (!categoryName) return false;
    return categoryName.toUpperCase().includes('ЛОР');
  };

  // Проверка, является ли категория "Дополнительные услуги"
  const isAdditionalServicesCategory = (categoryName) => {
    if (!categoryName) return false;
    return categoryName.toUpperCase().includes('ДОПОЛНИТЕЛЬН');
  };

  // Обработчики для модального окна записи
  const handleOpenAppointmentModal = (service = null) => {
    const currentCategory = categories[activeTab];
    
    // Если это категория "Дополнительные услуги", открываем ConsultationModal
    if (isAdditionalServicesCategory(currentCategory?.name)) {
      if (service) {
        // Формируем комментарий с информацией о выбранной услуге
        const comment = `Меня интересует услуга: ${service.name}${service.description ? `. ${service.description}` : ''}${service.price ? `. Стоимость: ${service.price}₽` : ''}`;
        setConsultationComment(comment);
      } else {
        setConsultationComment('Меня интересуют дополнительные услуги');
      }
      setIsConsultationModalOpen(true);
      return;
    }
    
    // Для остальных категорий открываем AppointmentModal
    // Если есть услуга, добавляем к ней информацию о категории
    if (service) {
      const enrichedService = {
        ...service,
        categoryId: currentCategory?.id,
        category: currentCategory, // Полный объект категории
        isLorService: isLorCategory(currentCategory?.name) // Флаг для ЛОР услуги
      };
      setSelectedServiceForAppointment(enrichedService);
    } else {
      setSelectedServiceForAppointment(null);
    }
    setIsAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedServiceForAppointment(null);
  };

  // Определяем какие услуги показывать (2 ряда на десктопе, все на мобильном)
  const maxServicesDefault = servicesPerRow * DEFAULT_ROWS;
  const displayedServices = (isMobile || showAllServices)
    ? services 
    : services.slice(0, maxServicesDefault);
  
  const hasMoreServices = !isMobile && services.length > maxServicesDefault;

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
            <button 
              className="choose-service-btn" 
              type="button"
              onClick={() => handleOpenAppointmentModal()}
            >
              <span>Выбрать услугу</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M0.75 6.00311C0.75 5.5889 1.08579 5.25311 1.5 5.25311H10.5C10.9142 5.25311 11.25 5.5889 11.25 6.00311C11.25 6.41733 10.9142 6.75311 10.5 6.75311H1.5C1.08579 6.75311 0.75 6.41733 0.75 6.00311Z" fill="#14488C" fillOpacity="0.92"/>
<path fillRule="evenodd" clipRule="evenodd" d="M5.46967 0.96967C5.76256 0.676777 6.23744 0.676777 6.53033 0.96967L11.0303 5.46967C11.3232 5.76256 11.3232 6.23744 11.0303 6.53033L6.53033 11.0303C6.23744 11.3232 5.76256 11.3232 5.46967 11.0303C5.17678 10.7374 5.17678 10.2626 5.46967 9.96967L9.43934 6L5.46967 2.03033C5.17678 1.73744 5.17678 1.26256 5.46967 0.96967Z" fill="#14488C" fillOpacity="0.92"/>
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
              onClick={() => handleTabClick(idx)}
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
        <div className="services-grid ct-grid" ref={gridRef}>
          {displayedServices.map((service, idx) => (
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
                  <button 
                    className="ct-icon-btn outline" 
                    type="button" 
                    aria-label="Записаться"
                    onClick={() => handleOpenAppointmentModal(service)}
                  >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.75 6.00311C0.75 5.5889 1.08579 5.25311 1.5 5.25311H10.5C10.9142 5.25311 11.25 5.5889 11.25 6.00311C11.25 6.41733 10.9142 6.75311 10.5 6.75311H1.5C1.08579 6.75311 0.75 6.41733 0.75 6.00311Z" fill="#14488C" fillOpacity="0.92"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.46967 0.96967C5.76256 0.676777 6.23744 0.676777 6.53033 0.96967L11.0303 5.46967C11.3232 5.76256 11.3232 6.23744 11.0303 6.53033L6.53033 11.0303C6.23744 11.3232 5.76256 11.3232 5.46967 11.0303C5.17678 10.7374 5.17678 10.2626 5.46967 9.96967L9.43934 6L5.46967 2.03033C5.17678 1.73744 5.17678 1.26256 5.46967 0.96967Z" fill="#14488C" fillOpacity="0.92"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка "Показать все" */}
        {hasMoreServices && (
          <div className="show-all-container">
            <button 
              className="show-all-btn" 
              type="button"
              onClick={() => setShowAllServices(!showAllServices)}
            >
              <span>{showAllServices ? 'Свернуть' : 'Показать все'}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={showAllServices ? 'rotated' : ''}
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M0.75 6.00311C0.75 5.5889 1.08579 5.25311 1.5 5.25311H10.5C10.9142 5.25311 11.25 5.5889 11.25 6.00311C11.25 6.41733 10.9142 6.75311 10.5 6.75311H1.5C1.08579 6.75311 0.75 6.41733 0.75 6.00311Z" 
                  fill="currentColor"
                />
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M5.46967 0.96967C5.76256 0.676777 6.23744 0.676777 6.53033 0.96967L11.0303 5.46967C11.3232 5.76256 11.3232 6.23744 11.0303 6.53033L6.53033 11.0303C6.23744 11.3232 5.76256 11.3232 5.46967 11.0303C5.17678 10.7374 5.17678 10.2626 5.46967 9.96967L9.43934 6L5.46967 2.03033C5.17678 1.73744 5.17678 1.26256 5.46967 0.96967Z" 
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно записи */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
        preselectedService={selectedServiceForAppointment}
      />

      {/* Модальное окно консультации */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => {
          setIsConsultationModalOpen(false);
          setConsultationComment('');
        }}
        initialComment={consultationComment}
      />
    </section>
  );
};

export default ServicesSection;