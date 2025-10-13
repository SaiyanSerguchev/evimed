import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

// Import admin components
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminServicesTree from '../components/admin/AdminServicesTree';
import AdminAppointments from '../components/admin/AdminAppointments';
import AdminUsers from '../components/admin/AdminUsers';
import AdminBanners from '../components/admin/AdminBanners';
import AdminAdvantages from '../components/admin/AdminAdvantages';
import AdminBranches from '../components/admin/AdminBranches';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [advantages, setAdvantages] = useState([]);

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
      
      // Проверяем формат данных и фильтруем дубликаты
      let bannersData = data;
      
      // Если данные в объекте с массивом banners
      if (data && typeof data === 'object' && data.banners) {
        bannersData = data.banners;
      }
      
      // Если это не массив, преобразуем в массив
      if (!Array.isArray(bannersData)) {
        bannersData = [];
      }
      
      // Фильтруем дубликаты по ID
      const uniqueBanners = bannersData.filter((banner, index, self) => 
        index === self.findIndex(b => b.id === banner.id)
      );
      
      console.log('Загружены баннеры:', uniqueBanners);
      setBanners(uniqueBanners);
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
      setBanners([]);
    }
  };

  const loadAdvantages = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/advantages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Проверяем формат данных и фильтруем дубликаты
      let advantagesData = data;
      
      // Если данные в объекте с массивом advantages
      if (data && typeof data === 'object' && data.advantages) {
        advantagesData = data.advantages;
      }
      
      // Если это не массив, преобразуем в массив
      if (!Array.isArray(advantagesData)) {
        advantagesData = [];
      }
      
      // Фильтруем дубликаты по ID
      const uniqueAdvantages = advantagesData.filter((advantage, index, self) => 
        index === self.findIndex(a => a.id === advantage.id)
      );
      
      console.log('Загружены преимущества:', uniqueAdvantages);
      setAdvantages(uniqueAdvantages);
    } catch (error) {
      console.error('Ошибка загрузки преимуществ:', error);
      setAdvantages([]);
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
              type="text"
              placeholder="Логин"
              value={loginData.login}
              onChange={(e) => setLoginData({...loginData, login: e.target.value})}
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
          <p>Тестовый админ: admin / admin123</p>
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
          className={activeTab === 'banners' ? 'active' : ''}
          onClick={() => { setActiveTab('banners'); loadBanners(); }}
        >
          Баннеры
        </button>
        <button
          className={activeTab === 'advantages' ? 'active' : ''}
          onClick={() => { setActiveTab('advantages'); loadAdvantages(); }}
        >
          Преимущества
        </button>
        <button
          className={activeTab === 'services-tree' ? 'active' : ''}
          onClick={() => setActiveTab('services-tree')}
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
          className={activeTab === 'branches' ? 'active' : ''}
          onClick={() => setActiveTab('branches')}
        >
          Филиалы
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => { setActiveTab('users'); loadUsers(); }}
        >
          Пользователи
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'dashboard' && (
          <AdminDashboard dashboardData={dashboardData} />
        )}

                {activeTab === 'services-tree' && (
                  <AdminServicesTree
                    token={token}
                    API_BASE={API_BASE}
                  />
                )}

        {activeTab === 'appointments' && (
          <AdminAppointments 
            appointments={appointments}
            onUpdateAppointmentStatus={loadAppointments}
            token={token}
            API_BASE={API_BASE}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsers users={users} />
        )}

        {activeTab === 'banners' && (
          <AdminBanners 
            banners={banners}
            onLoadBanners={loadBanners}
            token={token}
            API_BASE={API_BASE}
          />
        )}

                {activeTab === 'advantages' && (
                  <AdminAdvantages
                    advantages={advantages}
                    onLoadAdvantages={loadAdvantages}
                    token={token}
                    API_BASE={API_BASE}
                  />
                )}

                {activeTab === 'branches' && (
                  <AdminBranches
                    token={token}
                    API_BASE={API_BASE}
                  />
                )}
      </main>
    </div>
  );
};

export default AdminPanel;