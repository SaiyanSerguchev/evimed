import React from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const addresses = [
    {
      title: "Головной центр рентгено-диагностики",
      address: "Якутск, пр. Ленина 1, этаж 7, офис 721"
    },
    {
      title: "Филиал на Кирова",
      address: "Якутск, пр. Кирова 25, этаж 3, офис 305"
    }
  ];

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="contact-title">Адреса и контакты</h2>
          <div className="title-line"></div>
          <p className="contact-subtitle">
            Свяжитесь с нами
          </p>
          <p className="contact-description">
            Широкая сеть наших центров диагностики охватывает всю страну и постоянно растет. 
            Мы стараемся быть ближе к вам.
          </p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>+7 (495) 492-43-40</span>
            </div>
            <div className="contact-item">
              <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>info@evimed.ru</span>
            </div>
          </div>
          
          <div className="addresses-grid">
            {addresses.map((address, index) => (
              <div key={index} className="address-card">
                <h3 className="address-title">{address.title}</h3>
                <p className="address-text">{address.address}</p>
                <div className="address-actions">
                  <button className="action-button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L15 8L8 15L1 8L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <circle cx="8" cy="8" r="2" fill="currentColor"/>
                    </svg>
                    <span>На карте</span>
                  </button>
                  <button className="action-button">
                    <span>Копировать</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

