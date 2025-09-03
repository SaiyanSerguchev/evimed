import React from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Телефон",
      value: "+7 (495) 492-43-40",
      description: "Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Адрес",
      value: "г. Якутск, пр. Ленина 1",
      description: "Центральный район, удобная транспортная доступность"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Email",
      value: "info@evimed.ru",
      description: "Ответим в течение 24 часов"
    }
  ];

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Свяжитесь с нами</h2>
          <div className="title-line"></div>
          <p className="contact-subtitle">
            Готовы ответить на все ваши вопросы
          </p>
          <p className="contact-description">
            Свяжитесь с нами любым удобным способом. Наши специалисты 
            готовы помочь и ответить на все ваши вопросы.
          </p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-item">
                <div className="contact-icon">
                  {info.icon}
                </div>
                <div className="contact-details">
                  <h3 className="contact-item-title">{info.title}</h3>
                  <p className="contact-value">{info.value}</p>
                  <p className="contact-description-text">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="contact-form">
            <h3 className="form-title">Отправить сообщение</h3>
            <form className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Имя</label>
                  <input type="text" id="name" name="name" className="form-input" placeholder="Введите ваше имя" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Телефон</label>
                  <input type="tel" id="phone" name="phone" className="form-input" placeholder="+7 (___) ___-__-__" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" name="email" className="form-input" placeholder="example@email.com" />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Сообщение</label>
                <textarea id="message" name="message" className="form-textarea" rows="4" placeholder="Опишите ваш вопрос или проблему"></textarea>
              </div>
              <button type="submit" className="form-button">
                <span>Отправить сообщение</span>
                <svg className="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 4L16 12L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;





