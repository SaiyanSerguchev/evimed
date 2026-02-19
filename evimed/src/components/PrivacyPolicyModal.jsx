import React, { useEffect } from 'react';
import './PrivacyPolicyModal.css';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="privacy-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title">
      <div className="privacy-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-modal-header">
          <h2 id="privacy-modal-title" className="privacy-modal-title">Политика конфиденциальности</h2>
          <button type="button" className="privacy-modal-close" onClick={onClose} aria-label="Закрыть" />
        </div>
        <div className="privacy-modal-body">
          <section>
            <h3>1. Общие положения</h3>
            <p>Настоящая политика конфиденциальности персональных данных (далее — Политика) действует в отношении всей информации, которую сайт evimed может получить о посетителе во время использования сайта.</p>
          </section>
          <section>
            <h3>2. Персональные данные пользователей</h3>
            <p>Под персональными данными понимается любая информация, относящаяся к прямо или косвенно определённому физическому лицу. Мы можем обрабатывать данные, которые вы указываете при записи на приём: имя, контактный телефон, адрес электронной почты, дата рождения и иные сведения, необходимые для оказания услуг.</p>
          </section>
          <section>
            <h3>3. Цели обработки персональных данных</h3>
            <p>Обработка персональных данных осуществляется в целях записи на приём, связи с вами, направления уведомлений и улучшения качества предоставляемых услуг.</p>
          </section>
          <section>
            <h3>4. Защита персональных данных</h3>
            <p>Мы принимаем необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования и распространения.</p>
          </section>
          <section>
            <h3>5. Передача персональных данных третьим лицам</h3>
            <p>Персональные данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством РФ или с вашего согласия.</p>
          </section>
          <section>
            <h3>6. Обратная связь</h3>
            <p>По вопросам, связанным с обработкой персональных данных, вы можете обратиться по адресу: info@axiomaykt.ru или по телефону +7 (4112) 25-05-09.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
