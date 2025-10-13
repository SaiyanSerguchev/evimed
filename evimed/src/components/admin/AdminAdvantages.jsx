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
                    >
                      Редактировать
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
