import React from 'react';
import './AdminUsers.css';

const AdminUsers = ({ users }) => {
  return (
    <div className="users-management">
      <h3>Пользователи</h3>
      {users && users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Логин</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Дата регистрации</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email || '-'}</td>
                <td>{user.login || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Пользователи не найдены</p>
      )}
    </div>
  );
};

export default AdminUsers;
