import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

// Импортируем все компоненты администратора
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminServicesTree from '../components/admin/AdminServicesTree';
import AdminBanners from '../components/admin/AdminBanners';
import AdminAdvantages from '../components/admin/AdminAdvantages';
import AdminBranches from '../components/admin/AdminBranches';
import AdminAppointments from '../components/admin/AdminAppointments';
import AdminUsers from '../components/admin/AdminUsers';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Состояния для данных
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [advantages, setAdvantages] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || '/api';

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
        body: JSON.stringify({ login: loginData.username, password: loginData.password })
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
      // Ошибка загрузки данных
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
      // Ошибка загрузки записей
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
      // Ошибка загрузки пользователей
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
      // Ошибка загрузки баннеров
    }
  };

  const loadAdvantages = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/advantages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAdvantages(data);
    } catch (error) {
      // Ошибка загрузки преимуществ
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
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
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
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
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
        <button 
          className={activeTab === 'advantages' ? 'active' : ''}
          onClick={() => { setActiveTab('advantages'); loadAdvantages(); }}
        >
          Преимущества
        </button>
        <button 
          className={activeTab === 'branches' ? 'active' : ''}
          onClick={() => setActiveTab('branches')}
        >
          Филиалы
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'dashboard' && (
          <AdminDashboard 
            dashboardData={dashboardData}
            token={token}
            API_BASE={API_BASE}
          />
        )}

        {activeTab === 'services' && (
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
          <AdminUsers 
            users={users}
          />
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
