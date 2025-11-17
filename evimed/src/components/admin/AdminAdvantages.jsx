import React, { useState } from 'react';
import './AdminAdvantages.css';

const AdminAdvantages = ({ advantages, onLoadAdvantages, token, API_BASE }) => {
  const [editingAdvantage, setEditingAdvantage] = useState(null);
  const [editAdvantageData, setEditAdvantageData] = useState({
    title: '',
    description: '',
    order: 1
  });

  const editAdvantage = (advantage) => {
    setEditingAdvantage(advantage.id);
    setEditAdvantageData({
      title: advantage.title,
      description: advantage.description,
      order: advantage.order
    });
  };

  const saveAdvantageEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/advantages/${editingAdvantage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editAdvantageData.title,
          description: editAdvantageData.description
        })
      });
      
      if (response.ok) {
        setEditingAdvantage(null);
        setEditAdvantageData({
          title: '',
          description: '',
          order: 1
        });
        onLoadAdvantages();
        alert('Преимущество обновлено успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const cancelAdvantageEdit = () => {
    setEditingAdvantage(null);
    setEditAdvantageData({
      title: '',
      description: '',
      order: 1
    });
  };

  const updateAdvantage = async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/admin/advantages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        onLoadAdvantages();
      } else {
        alert('Ошибка обновления преимущества');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  return (
      <div className="admin-advantages-list">
        <h3>Управление преимуществами</h3>
        <div className="admin-advantages-grid">
          {advantages && advantages.map(advantage => (
            <div key={advantage.id} className="admin-advantage-card">
              {editingAdvantage === advantage.id ? (
                <div className="admin-advantage-edit-form">
                  <h4>Редактировать преимущество #{advantage.order}</h4>
                  <form onSubmit={saveAdvantageEdit}>
                    <input
                      type="text"
                      placeholder="Заголовок"
                      value={editAdvantageData.title}
                      onChange={(e) => setEditAdvantageData({...editAdvantageData, title: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Описание"
                      value={editAdvantageData.description}
                      onChange={(e) => setEditAdvantageData({...editAdvantageData, description: e.target.value})}
                      required
                    />
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">Сохранить</button>
                      <button type="button" onClick={cancelAdvantageEdit} className="cancel-btn">Отмена</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="admin-advantage-preview">
                    <h4>{advantage.title}</h4>
                    <p>{advantage.description}</p>
                    <div className="admin-advantage-order">Порядок: {advantage.order}</div>
                  </div>
                  <div className="admin-advantage-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => editAdvantage(advantage)}
                      title="Редактировать"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.686 11.9445 1.59124C12.1727 1.49649 12.4166 1.44775 12.6627 1.44775C12.9088 1.44775 13.1527 1.49649 13.3809 1.59124C13.6091 1.686 13.817 1.82491 13.9921 2.00001C14.1672 2.17511 14.3061 2.38305 14.4009 2.61122C14.4956 2.8394 14.5444 3.08327 14.5444 3.32935C14.5444 3.57543 14.4956 3.8193 14.4009 4.04748C14.3061 4.27565 14.1672 4.48359 13.9921 4.65868L5.176 13.4747L1.33333 14.6667L2.52533 10.824L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
  );
};

export default AdminAdvantages;
