import React, { useState } from 'react';
import './AdminBanners.css';

const AdminBanners = ({ banners, onLoadBanners, token, API_BASE }) => {
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    order: 1
  });
  const [editingBanner, setEditingBanner] = useState(null);
  const [editBannerData, setEditBannerData] = useState({
    title: '',
    description: '',
    order: 1
  });

  const addBanner = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBanner)
      });
      
      if (response.ok) {
        setNewBanner({ title: '', description: '', order: 1 });
        onLoadBanners();
        alert('Баннер добавлен успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const updateBanner = async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/admin/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        onLoadBanners();
      } else {
        alert('Ошибка обновления баннера');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const editBanner = (banner) => {
    setEditingBanner(banner.id);
    setEditBannerData({
      title: banner.title,
      description: banner.description || '',
      order: banner.order
    });
  };

  const saveBannerEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/banners/${editingBanner}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editBannerData)
      });
      
      if (response.ok) {
        setEditingBanner(null);
        setEditBannerData({
          title: '',
          description: '',
          order: 1
        });
        onLoadBanners();
        alert('Баннер обновлен успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const cancelBannerEdit = () => {
    setEditingBanner(null);
    setEditBannerData({
      title: '',
      description: '',
      order: 1
    });
  };

  const deleteBanner = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот баннер?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        onLoadBanners();
        alert('Баннер удален успешно');
      } else {
        alert('Ошибка удаления баннера');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="banners-management">
      <div className="add-banner-form">
        <h3>Добавить баннер</h3>
        <form onSubmit={addBanner}>
          <input
            type="text"
            placeholder="Заголовок"
            value={newBanner.title}
            onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Описание"
            value={newBanner.description}
            onChange={(e) => setNewBanner({...newBanner, description: e.target.value})}
          />
          <input
            type="number"
            placeholder="Порядковый номер"
            value={newBanner.order}
            onChange={(e) => setNewBanner({...newBanner, order: parseInt(e.target.value)})}
            min="1"
            required
          />
          <button type="submit">Добавить баннер</button>
        </form>
      </div>

      <div className="banners-list">
        <h3>Список баннеров</h3>
        <div className="banners-grid">
          {banners && banners.map(banner => (
            <div key={banner.id} className="banner-card">
              {editingBanner === banner.id ? (
                <div className="banner-edit-form">
                  <h4>Редактировать баннер</h4>
                  <form onSubmit={saveBannerEdit}>
                    <input
                      type="text"
                      placeholder="Заголовок"
                      value={editBannerData.title}
                      onChange={(e) => setEditBannerData({...editBannerData, title: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Описание"
                      value={editBannerData.description}
                      onChange={(e) => setEditBannerData({...editBannerData, description: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Порядковый номер"
                      value={editBannerData.order}
                      onChange={(e) => setEditBannerData({...editBannerData, order: parseInt(e.target.value)})}
                      min="1"
                      required
                    />
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">Сохранить</button>
                      <button type="button" onClick={cancelBannerEdit} className="cancel-btn">Отмена</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="banner-preview">
                    <h4>{banner.title}</h4>
                    <p>{banner.description}</p>
                    <div className="banner-order">Порядок: {banner.order}</div>
                  </div>
                  <div className="banner-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => editBanner(banner)}
                    >
                      Редактировать
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteBanner(banner.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
