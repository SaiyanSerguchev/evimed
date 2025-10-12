import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [dashboardData, setDashboardData] = useState(null);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  });
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonUrl: '',
    imageUrl: '',
    imageAlt: '',
    order: 0
  });

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        loadDashboardData();
      } else {
        alert('Ошибка входа: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/services`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const loadBanners = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/banners`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newService)
      });
      
      if (response.ok) {
        setNewService({ name: '', description: '', price: '', duration: '', category: '' });
        loadServices();
        alert('Услуга добавлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        loadAppointments();
      } else {
        alert('Ошибка обновления статуса');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

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
        setNewBanner({ title: '', description: '', buttonText: '', buttonUrl: '', imageUrl: '', imageAlt: '', order: 0 });
        loadBanners();
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
        loadBanners();
      } else {
        alert('Ошибка обновления баннера');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const deleteBanner = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот баннер?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        loadBanners();
        alert('Баннер удален успешно');
      } else {
        alert('Ошибка удаления баннера');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div className="admin-login">
        <div className="login-form">
          <h2>Вход в админ панель</h2>
          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
            <button type="submit">Войти</button>
          </form>
          <p>Тестовый админ: admin@evimed.ru / admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Админ панель Evimed</h1>
        <button onClick={logout} className="logout-btn">Выйти</button>
      </header>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Дашборд
        </button>
        <button 
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => { setActiveTab('services'); loadServices(); }}
        >
          Услуги
        </button>
        <button 
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => { setActiveTab('appointments'); loadAppointments(); }}
        >
          Записи
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => { setActiveTab('users'); loadUsers(); }}
        >
          Пользователи
        </button>
        <button 
          className={activeTab === 'banners' ? 'active' : ''}
          onClick={() => { setActiveTab('banners'); loadBanners(); }}
        >
          Баннеры
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'dashboard' && dashboardData && dashboardData.stats && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Всего пользователей</h3>
                <p className="stat-number">{dashboardData.stats.totalUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Услуг</h3>
                <p className="stat-number">{dashboardData.stats.totalServices || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Всего записей</h3>
                <p className="stat-number">{dashboardData.stats.totalAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Записей сегодня</h3>
                <p className="stat-number">{dashboardData.stats.todayAppointments || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Баннеров</h3>
                <p className="stat-number">{dashboardData.stats.totalBanners || 0}</p>
              </div>
            </div>

            <div className="recent-appointments">
              <h3>Последние записи</h3>
              <table>
                <thead>
                  <tr>
                    <th>Пациент</th>
                    <th>Услуга</th>
                    <th>Дата</th>
                    <th>Время</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentAppointments && dashboardData.recentAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.user_name}</td>
                      <td>{appointment.service_name}</td>
                      <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && !dashboardData && (
          <div className="dashboard">
            <div className="loading-message">
              <h3>Загрузка данных...</h3>
              <p>Пожалуйста, подождите, пока загрузятся данные дашборда.</p>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="services-management">
            <div className="add-service-form">
              <h3>Добавить услугу</h3>
              <form onSubmit={addService}>
                <input
                  type="text"
                  placeholder="Название услуги"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Описание"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Цена"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Длительность (мин)"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Категория"
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                />
                <button type="submit">Добавить услугу</button>
              </form>
            </div>

            <div className="services-list">
              <h3>Список услуг</h3>
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Длительность</th>
                    <th>Категория</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{service.price} ₽</td>
                      <td>{service.duration} мин</td>
                      <td>{service.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-management">
            <h3>Управление записями</h3>
            <table>
              <thead>
                <tr>
                  <th>Пациент</th>
                  <th>Услуга</th>
                  <th>Дата</th>
                  <th>Время</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.user_name}</td>
                    <td>{appointment.service_name}</td>
                    <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                    <td>{appointment.appointment_time}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <select 
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                      >
                        <option value="scheduled">Запланировано</option>
                        <option value="confirmed">Подтверждено</option>
                        <option value="completed">Завершено</option>
                        <option value="cancelled">Отменено</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-management">
            <h3>Пользователи</h3>
            <table>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'banners' && (
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
                  type="text"
                  placeholder="Текст кнопки"
                  value={newBanner.buttonText}
                  onChange={(e) => setNewBanner({...newBanner, buttonText: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="URL кнопки"
                  value={newBanner.buttonUrl}
                  onChange={(e) => setNewBanner({...newBanner, buttonUrl: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="URL изображения"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({...newBanner, imageUrl: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Alt текст изображения"
                  value={newBanner.imageAlt}
                  onChange={(e) => setNewBanner({...newBanner, imageAlt: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Порядок"
                  value={newBanner.order}
                  onChange={(e) => setNewBanner({...newBanner, order: parseInt(e.target.value)})}
                />
                <button type="submit">Добавить баннер</button>
              </form>
            </div>

            <div className="banners-list">
              <h3>Список баннеров</h3>
              <div className="banners-grid">
                {banners.map(banner => (
                  <div key={banner.id} className="banner-card">
                    <div className="banner-preview">
                      <h4>{banner.title}</h4>
                      <p>{banner.description}</p>
                      {banner.buttonText && (
                        <button className="preview-button">{banner.buttonText}</button>
                      )}
                    </div>
                    <div className="banner-actions">
                      <button 
                        className={`toggle-btn ${banner.isActive ? 'active' : 'inactive'}`}
                        onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                      >
                        {banner.isActive ? 'Активен' : 'Неактивен'}
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteBanner(banner.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
