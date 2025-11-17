import React from 'react';
import './ContactSection.css';
import contactsMap from '../assets/images/contacts/contactsmap.png';
import { useRef, useState, useEffect } from 'react';

const ContactSection = () => {
  const kicker = 'Адреса и контакты';
  const title = 'Свяжитесь с нами';
  const description = 'Широкая сеть наших центров диагностики охватывает всю страну и постоянно растёт. Мы стараемся быть ближе к вам.';
  const phone = '+7 (495) 492-43-40';
  const email = 'info@axiomaykt.ru';

  // Data state
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await fetch(`${API_BASE}/branches`);
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Ошибка загрузки филиалов:', error);
      // Fallback к статичным данным
      setBranches([
        { id: 1, title: 'Головной центр рентгено-диагностики', address: 'Якутск, пр. Ленина 1, этаж 7, офис 721' },
        { id: 2, title: 'Филиал на Кирова', address: 'Якутск, пр. Кирова 28, этаж 1, офис 101' },
        { id: 3, title: 'Филиал на Автодорожной', address: 'Якутск, ул. Автодорожная 15, этаж 2, офис 201' },
        { id: 4, title: 'Филиал на Промышленной', address: 'Якутск, ул. Промышленная 8, этаж 3, офис 301' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple text contacts
  const contactText = {
    phone,
    email
  };

  const [isDragging, setIsDragging] = useState(false);
  const [activeBranch, setActiveBranch] = useState(0); // Track active branch index
  const listRef = useRef(null);

  // Обработчики
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // только левая кнопка мыши
    setIsDragging(true);
    listRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    listRef.current.scrollTop -= e.movementY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    listRef.current.style.cursor = 'grab';
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
                <a href="tel:+74954924340" className="contact-line">{contactText.phone}</a>
                <a href="mailto:info@axiomaykt.ru" className="contact-line">{contactText.email}</a>
              </div>
            </div>
              <div className="contact-branches">
                <div className="branches-title-row">
                  <h3 className="branches-title">Адреса</h3>
                  <div className="branches-title-divider" aria-hidden></div>
                </div>
                <ul ref={listRef} className="branches-list"   
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
                  {loading ? (
                    <li className="branch-item loading">
                      <div className="branch-content">
                        <div className="branch-name">Загрузка филиалов...</div>
                      </div>
                    </li>
                  ) : (
                    branches.map((branch, i) => (
                      <li 
                        className={`branch-item ${i === activeBranch ? 'active' : ''}`} 
                        key={branch.id || i}
                        onClick={() => setActiveBranch(i)}>
                        <div className="branch-content">
                          <div className="branch-name">{branch.title}</div>
                          <div className="branch-address">{branch.address}</div>
                          {branch.workingHours && (
                            <div className="branch-hours">{branch.workingHours}</div>
                          )}
                        </div>
                      <div className="branch-actions">
                        <button className="branch-action branch-action-primary">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.333 1.5C12.9774 1.5 13.5 2.02266 13.5 2.66699V4C13.5 3.72386 13.7239 3.5 14 3.5C14.2761 3.5 14.5 3.72386 14.5 4V5.33301C14.5 5.60915 14.2761 5.83301 14 5.83301C13.7239 5.83301 13.5 5.60915 13.5 5.33301V11.333C13.5 11.9207 13.0653 12.4053 12.5 12.4863V13C12.5 13.8284 11.8284 14.5 11 14.5C10.1716 14.5 9.5 13.8284 9.5 13V12.5H6.5V13C6.5 13.8284 5.82844 14.5 5 14.5C4.17156 14.5 3.5 13.8284 3.5 13V12.4863C2.93475 12.4053 2.5 11.9207 2.5 11.333V5.33301C2.5 5.60915 2.27614 5.83301 2 5.83301C1.72386 5.83301 1.5 5.60915 1.5 5.33301V4C1.5 3.72386 1.72386 3.5 2 3.5C2.27614 3.5 2.5 3.72386 2.5 4V2.66699C2.5 2.02266 3.02266 1.5 3.66699 1.5H12.333ZM4.5 13C4.5 13.2762 4.72384 13.5 5 13.5C5.27616 13.5 5.5 13.2762 5.5 13V12.5H4.5V13ZM10.5 13C10.5 13.2762 10.7238 13.5 11 13.5C11.2762 13.5 11.5 13.2762 11.5 13V12.5H10.5V13ZM3.5 11.333C3.5 11.4251 3.57494 11.5 3.66699 11.5H12.333C12.4251 11.5 12.5 11.4251 12.5 11.333V8.16699H3.5V11.333ZM5 9.33301C5.36819 9.33301 5.66699 9.63181 5.66699 10C5.66699 10.3682 5.36819 10.667 5 10.667C4.63181 10.667 4.33301 10.3682 4.33301 10C4.33301 9.63181 4.63181 9.33301 5 9.33301ZM11 9.33301C11.3682 9.33301 11.667 9.63181 11.667 10C11.667 10.3682 11.3682 10.667 11 10.667C10.6318 10.667 10.333 10.3682 10.333 10C10.333 9.63181 10.6318 9.33301 11 9.33301ZM3.66699 2.5C3.57494 2.5 3.5 2.57494 3.5 2.66699V7.16699H12.5V3.31348L11.3838 4.65332C11.207 4.86536 10.8918 4.8945 10.6797 4.71777C10.4676 4.54102 10.4395 4.22581 10.6162 4.01367L11.877 2.5H10.5566L7.70508 5.66797C7.52039 5.87314 7.20427 5.88966 6.99902 5.70508C6.79377 5.52035 6.77718 5.20428 6.96191 4.99902L9.21094 2.5H3.66699Z" fill="#14488C"/>
</svg>
                        </button>
                        <button className="branch-action branch-action-secondary">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.333 1.5C13.5296 1.5 14.5 2.47038 14.5 3.66699C14.4998 4.69125 13.7883 5.54664 12.833 5.77246V11.835C12.8329 13.3068 11.6399 14.5 10.168 14.5C8.69609 14.4999 7.50305 13.3068 7.50293 11.835V4.16797C7.50288 3.24683 6.75604 2.50012 5.83496 2.5C4.91374 2.5 4.16705 3.24676 4.16699 4.16797V10.2266C5.12208 10.4525 5.83286 11.3089 5.83301 12.333C5.83301 13.5295 4.86345 14.4998 3.66699 14.5C2.47038 14.5 1.5 13.5296 1.5 12.333C1.50015 11.3087 2.21159 10.4523 3.16699 10.2266V4.16797C3.16705 2.69448 4.36145 1.5 5.83496 1.5C7.30834 1.50012 8.50288 2.69456 8.50293 4.16797V11.835C8.50305 12.7545 9.24836 13.4999 10.168 13.5C11.0876 13.5 11.8329 12.7545 11.833 11.835V5.77246C10.878 5.54641 10.1671 4.69103 10.167 3.66699C10.167 2.47048 11.1365 1.50018 12.333 1.5ZM3.66699 11.167C3.02277 11.167 2.50018 11.6888 2.5 12.333C2.5 12.9773 3.02266 13.5 3.66699 13.5C4.31117 13.4998 4.83301 12.9772 4.83301 12.333C4.83283 11.6889 4.31106 11.1672 3.66699 11.167ZM12.333 2.5C11.6888 2.50018 11.167 3.02277 11.167 3.66699C11.1672 4.31106 11.6889 4.83283 12.333 4.83301C12.9772 4.83301 13.4998 4.31117 13.5 3.66699C13.5 3.02266 12.9773 2.5 12.333 2.5Z" fill="#14488C" fill-opacity="0.92"/>
</svg>

                        </button>
                      </div>
                    </li>
                    ))
                  )}
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
