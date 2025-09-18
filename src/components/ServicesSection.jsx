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
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.833374 10C0.833374 4.93743 4.93743 0.833374 10 0.833374C15.0627 0.833374 19.1667 4.93743 19.1667 10C19.1667 15.0627 15.0627 19.1667 10 19.1667C4.93743 19.1667 0.833374 15.0627 0.833374 10ZM10 2.50004C5.8579 2.50004 2.50004 5.8579 2.50004 10C2.50004 14.1422 5.8579 17.5 10 17.5C14.1422 17.5 17.5 14.1422 17.5 10C17.5 5.8579 14.1422 2.50004 10 2.50004ZM10.0036 4.16671C10.4638 4.16675 10.8369 4.53989 10.8368 5.00012L10.8364 9.65856L14.1253 12.9475C14.4508 13.273 14.4508 13.8006 14.1253 14.126C13.7999 14.4515 13.2723 14.4515 12.9468 14.126L9.41374 10.593C9.25744 10.4367 9.16964 10.2247 9.16966 10.0036L9.17017 4.99996C9.17021 4.53972 9.54334 4.16666 10.0036 4.16671Z" fill="#14488C" fill-opacity="0.44"/>
</svg>

                  <span>{item.time}</span>
                </div>
                <div className="ct-meta-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.833374 10C0.833374 4.93743 4.93743 0.833374 10 0.833374C15.0627 0.833374 19.1667 4.93743 19.1667 10C19.1667 15.0627 15.0627 19.1667 10 19.1667C4.93743 19.1667 0.833374 15.0627 0.833374 10ZM10 2.50004C5.8579 2.50004 2.50004 5.8579 2.50004 10C2.50004 14.1422 5.8579 17.5 10 17.5C14.1422 17.5 17.5 14.1422 17.5 10C17.5 5.8579 14.1422 2.50004 10 2.50004Z" fill="#14488C" fill-opacity="0.44"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.9226 7.74412C14.2481 8.06955 14.2481 8.59719 13.9226 8.92263L9.75596 13.0893C9.43053 13.4147 8.90289 13.4147 8.57745 13.0893L6.07745 10.5893C5.75201 10.2639 5.75201 9.73622 6.07745 9.41078C6.40289 9.08535 6.93053 9.08535 7.25596 9.41078L9.16671 11.3215L12.7441 7.74412C13.0696 7.41868 13.5972 7.41868 13.9226 7.74412Z" fill="#14488C" fill-opacity="0.44"/>
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