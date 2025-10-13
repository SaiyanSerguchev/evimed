import React, { useState, useEffect } from 'react';
import './AdminBranches.css';

const AdminBranches = ({ token, API_BASE }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBranch, setNewBranch] = useState({
    title: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    order: 0
  });
  const [editingBranch, setEditingBranch] = useState(null);
  const [editBranchData, setEditBranchData] = useState({});

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/branches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        console.error('Ошибка загрузки филиалов:', response.status);
      }
    } catch (error) {
      console.error('Ошибка загрузки филиалов:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBranch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/branches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBranch)
      });

      if (response.ok) {
        setNewBranch({ title: '', address: '', phone: '', email: '', workingHours: '', order: 0 });
        loadBranches();
        alert('Филиал добавлен успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const editBranch = (branch) => {
    setEditingBranch(branch.id);
    setEditBranchData({
      title: branch.title,
      address: branch.address,
      phone: branch.phone || '',
      email: branch.email || '',
      workingHours: branch.workingHours || '',
      order: branch.order
    });
  };

  const saveBranchEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/branches/${editingBranch}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editBranchData)
      });

      if (response.ok) {
        setEditingBranch(null);
        loadBranches();
        alert('Филиал обновлен успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const cancelBranchEdit = () => {
    setEditingBranch(null);
    setEditBranchData({});
  };

  const deleteBranch = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот филиал?')) return;

    try {
      const response = await fetch(`${API_BASE}/admin/branches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        loadBranches();
        alert('Филиал удален успешно');
      } else {
        alert('Ошибка удаления филиала');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };


  if (loading) {
    return <div className="admin-branches-loading">Загрузка филиалов...</div>;
  }

  return (
    <div className="admin-branches">
      <div className="branches-header">
        <h2>Управление филиалами</h2>
        <button onClick={loadBranches} className="refresh-btn">Обновить</button>
      </div>

      {/* Форма добавления */}
      <div className="add-branch-form">
        <h3>Добавить филиал</h3>
        <form onSubmit={addBranch}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Название филиала"
              value={newBranch.title}
              onChange={(e) => setNewBranch({...newBranch, title: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Адрес"
              value={newBranch.address}
              onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="tel"
              placeholder="Телефон"
              value={newBranch.phone}
              onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              value={newBranch.email}
              onChange={(e) => setNewBranch({...newBranch, email: e.target.value})}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Часы работы (например: Пн-Пт: 9:00-18:00)"
              value={newBranch.workingHours}
              onChange={(e) => setNewBranch({...newBranch, workingHours: e.target.value})}
            />
            <input
              type="number"
              placeholder="Порядок сортировки"
              value={newBranch.order}
              onChange={(e) => setNewBranch({...newBranch, order: parseInt(e.target.value)})}
              min="0"
            />
          </div>
          <button type="submit">Добавить филиал</button>
        </form>
      </div>

      {/* Список филиалов */}
      <div className="branches-list">
        <h3>Список филиалов ({branches.length})</h3>
        <div className="branches-grid">
          {branches.map(branch => (
            <div key={branch.id} className="branch-card">
              {editingBranch === branch.id ? (
                <div className="branch-edit-form">
                  <h4>Редактировать филиал</h4>
                  <form onSubmit={saveBranchEdit}>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Название филиала"
                        value={editBranchData.title}
                        onChange={(e) => setEditBranchData({...editBranchData, title: e.target.value})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Адрес"
                        value={editBranchData.address}
                        onChange={(e) => setEditBranchData({...editBranchData, address: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="tel"
                        placeholder="Телефон"
                        value={editBranchData.phone}
                        onChange={(e) => setEditBranchData({...editBranchData, phone: e.target.value})}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editBranchData.email}
                        onChange={(e) => setEditBranchData({...editBranchData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Часы работы"
                        value={editBranchData.workingHours}
                        onChange={(e) => setEditBranchData({...editBranchData, workingHours: e.target.value})}
                      />
                      <input
                        type="number"
                        placeholder="Порядок"
                        value={editBranchData.order}
                        onChange={(e) => setEditBranchData({...editBranchData, order: parseInt(e.target.value)})}
                        min="0"
                      />
                    </div>
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">Сохранить</button>
                      <button type="button" onClick={cancelBranchEdit} className="cancel-btn">Отмена</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="branch-preview">
                    <h4>{branch.title}</h4>
                    <p className="branch-address">{branch.address}</p>
                    {branch.phone && <p className="branch-phone">📞 {branch.phone}</p>}
                    {branch.email && <p className="branch-email">✉️ {branch.email}</p>}
                    {branch.workingHours && <p className="branch-hours">🕒 {branch.workingHours}</p>}
                    <div className="branch-meta">
                      <span>Порядок: {branch.order}</span>
                    </div>
                  </div>
                  <div className="branch-actions">
                    <button
                      className="edit-btn"
                      onClick={() => editBranch(branch)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBranch(branch.id)}
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

export default AdminBranches;
