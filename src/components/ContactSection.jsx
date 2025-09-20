import React from 'react';
import './ContactSection.css';
import contactsMap from '../assets/images/contacts/contactsmap.png';

const ContactSection = () => {
  // Autonomous content (no external JSON import)
  const kicker = 'Адреса и контакты';
  const title = 'Свяжитесь с нами';
  const description = 'Широкая сеть наших центров диагностики охватывает всю страну и постоянно растёт. Мы стараемся быть ближе к вам.';
  const phone = '+7 (495) 492-43-40';
  const email = 'info@axiomaykt.ru';

  const branches = [
    { title: 'Головной центр рентгено-диагностики', address: 'Якутск, пр. Ленина 1, этаж 7, офис 721' },
    { title: 'Филиал на Кирова', address: 'Якутск, пр. Кирова 28, этаж 1, офис 101' },
    { title: 'Филиал из будущего', address: 'Якутск, пр. Ленина 1, этаж 7, офис 721' },
    { title: 'Филиал из будущего', address: 'Якутск, пр. Ленина 1, этаж 7, офис 721' },
  ];

  // Simple text contacts
  const contactText = {
    phone,
    email
  };

  return (
    <section className="contact-section" id="contacts">
      <div className="contact-container">
        <div className="contact-header">
          <div className="contact-kicker">{kicker}</div>
          <h2 className="contact-title">{title}          
            <div className="title-line"></div>
          </h2>
          <p className="contact-description">{description}</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-details">
              <div className="contact-lines">
                <div className="contact-line">{contactText.phone}</div>
                <div className="contact-line">{contactText.email}</div>
              </div>
            </div>
              <div className="contact-branches">
                <h3 className="branches-title">Адреса</h3>
                <ul className="branches-list">
                  {branches.map((b, i) => (
                    <li className="branch-item" key={`${b.title}-${i}`}>
                      <div className="branch-name">{b.title}</div>
                      <div className="branch-address">{b.address}</div>
                    </li>
                  ))}
                </ul>
              </div>
          </div>
        </div>
      </div>
      <div className="contact-map" role="img" aria-label="Карта филиалов">
        <img src={contactsMap} alt="Карта филиалов" />
      </div>
    </section>
  );
};

export default ContactSection;





