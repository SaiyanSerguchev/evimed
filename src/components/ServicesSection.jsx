import React, { useEffect, useRef } from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  // Tabs/categories from the design
  const tabs = [
    { label: 'Двухмерные рентгенологические исследования', active: false },
    { label: 'Трехмерные рентгенологические исследования челюстей (КЛКТ)', active: true },
    { label: 'ЛОР-исследования', active: false },
    { label: 'Дополнительные услуги', active: false },
    { label: 'Пакетные предложения', active: false },
    { label: 'Распечатка и дублирование', active: false },
  ];

  // Статичные карточки КТ (5 штук) напрямую из макета
  const ctOptions = [
    {
      titleRow1: '5×5 см, KaVo / область одного',
      titleRow2: 'сегмента (4-6 зубов)',
      description:
        '3D-снимок отображает реальные размеры и пропорции анатомических структур',
      time: '15–30 мин',
      preparation: 'Без подготовки',
      price: '1 200',
      currency: '₽',
    },
    {
      titleRow1: '6×8 см, KaVo / область зубных дуг',
      titleRow2: '(запись на CD)',
      description:
        '3D-снимок отображает реальные размеры и пропорции анатомических структур',
      time: '1-2 часа',
      preparation: 'Требуется подготовка',
      price: '1 700',
      currency: '₽',
    },
    {
      titleRow1: '8×8 см, KaVo / область зубных дуг,',
      titleRow2: 'нижнечелюстной канал (запись на CD)',
      description:
        '3D-снимок отображает реальные размеры и пропорции анатомических структур без искажений и со всех сторон. Это позволяет максимально детально изучить диагностическую картину и корректно спланировать лечение.',
      time: '15 мин',
      preparation: 'Без подготовки',
      price: '2 400',
      currency: '₽',
    },
    {
      titleRow1: '8×15 см, KaVo / зубные дуги, ниж-',
      titleRow2: 'нечелюстной канал, дно верхнечелюстной пазухи)',
      description:
        '3D-снимок отображает реальные размеры и пропорции анатомических структур',
      time: '30 мин',
      preparation: 'Требуется подготовка',
      price: '3 300',
      currency: '₽',
    },
    {
      titleRow1: '13×15 см, KaVo / полная челюстно-',
      titleRow2: 'лицевая область, ВНЧС (CD-запись)',
      description:
        '3D-снимок отображает реальные размеры и пропорции анатомических структур без искажений и со всех сторон. Это позволяет максимально детально изучить диагностическую картину и корректно спланировать лечение.',
      time: '1 час',
      preparation: 'Без подготовки',
      price: '3 500',
      currency: '₽',
    },
  ];

  // Drag-to-scroll for tabs
  const tabsRef = useRef(null);
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      isDown = true;
      el.classList.add('is-dragging');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove('is-dragging');
    };
    const onMouseUp = () => {
      isDown = false;
      el.classList.remove('is-dragging');
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX; // positive -> move right
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    // Support pointer events (for better cross-browser behavior)
    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') return; // native touch scroll works
      el.setPointerCapture?.(e.pointerId);
    };
    el.addEventListener('pointerdown', onPointerDown);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <section className="services-section">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 5L16 12L8 19" stroke="#14488C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div className="services-tabs" ref={tabsRef}>
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`services-tab ${tab.active ? 'active' : ''}`}
              type="button"
            >
              {tab.label}
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
          {ctOptions.map((item, idx) => (
            <div key={idx} className="ct-card">
              <div className="ct-head">
                <div className="ct-title">
                  <div className="ct-title-line">{item.titleRow1}</div>
                  <div className="ct-title-line secondary">{item.titleRow2}</div>
                </div>
                <p className="ct-desc">{item.description}</p>
              </div>

              <div className="ct-meta">
                <div className="ct-meta-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#485366" strokeWidth="1.5"/>
                    <path d="M12 7v5l3 3" stroke="#485366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{item.time}</span>
                </div>
                <div className="ct-meta-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L10 16L6 12" stroke="#485366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{item.preparation}</span>
                </div>
              </div>

              <div className="ct-footer">
                <div className="ct-price">
                  <span className="ct-price-value">{item.price}</span>
                  <span className="ct-price-currency">{item.currency}</span>
                </div>
                <div className="ct-actions">
                  <button className="ct-icon-btn" type="button" aria-label="Подробнее">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#8690A3" strokeWidth="1.5"/>
                      <path d="M12 8v8" stroke="#8690A3" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="6" r="1" fill="#8690A3"/>
                    </svg>
                  </button>
                  <button className="ct-icon-btn outline" type="button" aria-label="Записаться">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5L16 12L8 19" stroke="#14488C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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