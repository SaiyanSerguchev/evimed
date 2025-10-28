import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ dashboardData, token, API_BASE }) => {
  const syncWithRenovatio = async () => {
    try {
      const response = await fetch(`${API_BASE}/renovatio/sync/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Синхронизация завершена!\n\nКатегории: создано ${result.categories.created}, обновлено ${result.categories.updated}\nУслуги: создано ${result.services.created}, обновлено ${result.services.updated}\nОшибок: ${result.errors.length}`);
        // Можно добавить обновление страницы или перезагрузку данных
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Ошибка синхронизации: ' + error.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу: ' + error.message);
    }
  };

  if (!dashboardData) {
    return (
      <div className="dashboard">
        <div className="loading-message">
          <h3>Загрузка данных...</h3>
          <p>Пожалуйста, подождите, пока загрузятся данные дашборда.</p>
        </div>
      </div>
    );
  }

  if (!dashboardData.stats) {
    return (
      <div className="dashboard">
        <div className="loading-message">
          <h3>Нет данных</h3>
          <p>Данные дашборда недоступны.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Панель администратора</h2>
        <button onClick={syncWithRenovatio} className="sync-btn">
          Синхронизировать с Renovatio
        </button>
      </div>
      
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
  );
};

export default AdminDashboard;
