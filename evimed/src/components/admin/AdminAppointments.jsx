import React from 'react';
import './AdminAppointments.css';

const AdminAppointments = ({ appointments, onUpdateAppointmentStatus, token, API_BASE }) => {
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
        onUpdateAppointmentStatus();
      } else {
        alert('Ошибка обновления статуса');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  return (
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
          {appointments && appointments.map(appointment => (
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
  );
};

export default AdminAppointments;
