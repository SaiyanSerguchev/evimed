import React, { useState, useEffect } from 'react';
import './AdminServicesTree.css';

const AdminServicesTree = ({ token, API_BASE }) => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Формы для добавления
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    order: 0
  });
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    preparation: '',
    categoryId: '',
    order: 0
  });

  // Режимы редактирования
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({});
  const [editServiceData, setEditServiceData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE}/admin/service-categories`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/services`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (categoriesRes.ok && servicesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const servicesData = await servicesRes.json();
        
        setCategories(categoriesData);
        setServices(servicesData);
        
        // Автоматически раскрываем категории с услугами
        const categoriesWithServices = new Set(servicesData.map(s => s.categoryId));
        setExpandedCategories(categoriesWithServices);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/service-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        setNewCategory({ name: '', description: '', order: 0 });
        loadData();
        alert('Категория добавлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
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
        setNewService({ name: '', description: '', price: '', duration: '', preparation: '', categoryId: '', order: 0 });
        loadData();
        alert('Услуга добавлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryData({
      name: category.name,
      description: category.description || '',
      order: category.order
    });
  };

  const saveCategoryEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/service-categories/${editingCategory}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editCategoryData)
      });

      if (response.ok) {
        setEditingCategory(null);
        loadData();
        alert('Категория обновлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const editService = (service) => {
    setEditingService(service.id);
    setEditServiceData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration || '',
      preparation: service.preparation || '',
      categoryId: service.categoryId,
      order: service.order
    });
  };

  const saveServiceEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/services/${editingService}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editServiceData)
      });

      if (response.ok) {
        setEditingService(null);
        loadData();
        alert('Услуга обновлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию? Все услуги в этой категории также будут удалены.')) return;

    try {
      const response = await fetch(`${API_BASE}/admin/service-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        loadData();
        alert('Категория удалена успешно');
      } else {
        alert('Ошибка удаления категории');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const deleteService = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;

    try {
      const response = await fetch(`${API_BASE}/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        loadData();
        alert('Услуга удалена успешно');
      } else {
        alert('Ошибка удаления услуги');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  const toggleCategoryStatus = async (id, isActive) => {
    try {
      const response = await fetch(`${API_BASE}/admin/service-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      alert('Ошибка обновления статуса категории');
    }
  };

  const toggleServiceStatus = async (id, isActive) => {
    try {
      const response = await fetch(`${API_BASE}/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      alert('Ошибка обновления статуса услуги');
    }
  };

  const getServicesForCategory = (categoryId) => {
    return services.filter(service => service.categoryId === categoryId);
  };

  if (loading) {
    return <div className="admin-services-tree-loading">Загрузка...</div>;
  }

  return (
    <div className="admin-services-tree">
      <div className="tree-header">
        <h2>Древовидная структура услуг</h2>
        <button onClick={loadData} className="refresh-btn">Обновить</button>
      </div>

      {/* Формы добавления */}
      <div className="add-forms">
        <div className="add-category-form">
          <h3>Добавить категорию</h3>
          <form onSubmit={addCategory}>
            <input
              type="text"
              placeholder="Название категории"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Описание категории"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
            />
            <input
              type="number"
              placeholder="Порядок"
              value={newCategory.order}
              onChange={(e) => setNewCategory({...newCategory, order: parseInt(e.target.value)})}
              min="0"
            />
            <button type="submit">Добавить категорию</button>
          </form>
        </div>

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
              type="text"
              placeholder="Длительность"
              value={newService.duration}
              onChange={(e) => setNewService({...newService, duration: e.target.value})}
            />
            <input
              type="text"
              placeholder="Подготовка"
              value={newService.preparation}
              onChange={(e) => setNewService({...newService, preparation: e.target.value})}
            />
            <select
              value={newService.categoryId}
              onChange={(e) => setNewService({...newService, categoryId: e.target.value})}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Порядок"
              value={newService.order}
              onChange={(e) => setNewService({...newService, order: parseInt(e.target.value)})}
              min="0"
            />
            <button type="submit">Добавить услугу</button>
          </form>
        </div>
      </div>

      {/* Древовидная структура */}
      <div className="services-tree">
        {categories.map(category => {
          const categoryServices = getServicesForCategory(category.id);
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className="tree-category">
              <div className="category-header">
                <button
                  className="expand-btn"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
                <div className="category-info">
                  <span className={`category-name ${!category.isActive ? 'inactive' : ''}`}>
                    {category.name}
                  </span>
                  <span className="category-meta">
                    ({categoryServices.length} услуг)
                  </span>
                </div>
                <div className="category-actions">
                  <button
                    className={`status-btn ${category.isActive ? 'active' : 'inactive'}`}
                    onClick={() => toggleCategoryStatus(category.id, !category.isActive)}
                  >
                    {category.isActive ? 'Активна' : 'Неактивна'}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => editCategory(category)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {/* Редактирование категории */}
              {editingCategory === category.id && (
                <div className="edit-form">
                  <form onSubmit={saveCategoryEdit}>
                    <input
                      type="text"
                      placeholder="Название категории"
                      value={editCategoryData.name}
                      onChange={(e) => setEditCategoryData({...editCategoryData, name: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Описание категории"
                      value={editCategoryData.description}
                      onChange={(e) => setEditCategoryData({...editCategoryData, description: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Порядок"
                      value={editCategoryData.order}
                      onChange={(e) => setEditCategoryData({...editCategoryData, order: parseInt(e.target.value)})}
                      min="0"
                    />
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">Сохранить</button>
                      <button type="button" onClick={() => setEditingCategory(null)} className="cancel-btn">Отмена</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Услуги категории */}
              {isExpanded && (
                <div className="category-services">
                  {categoryServices.map(service => (
                    <div key={service.id} className="tree-service">
                      <div className="service-info">
                        <span className={`service-name ${!service.isActive ? 'inactive' : ''}`}>
                          {service.name}
                        </span>
                        <span className="service-price">{service.price} ₽</span>
                        <span className="service-duration">{service.duration}</span>
                      </div>
                      <div className="service-actions">
                        <button
                          className={`status-btn ${service.isActive ? 'active' : 'inactive'}`}
                          onClick={() => toggleServiceStatus(service.id, !service.isActive)}
                        >
                          {service.isActive ? 'Активна' : 'Неактивна'}
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => editService(service)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteService(service.id)}
                        >
                          Удалить
                        </button>
                      </div>

                      {/* Редактирование услуги */}
                      {editingService === service.id && (
                        <div className="edit-form">
                          <form onSubmit={saveServiceEdit}>
                            <input
                              type="text"
                              placeholder="Название услуги"
                              value={editServiceData.name}
                              onChange={(e) => setEditServiceData({...editServiceData, name: e.target.value})}
                              required
                            />
                            <textarea
                              placeholder="Описание"
                              value={editServiceData.description}
                              onChange={(e) => setEditServiceData({...editServiceData, description: e.target.value})}
                            />
                            <input
                              type="number"
                              placeholder="Цена"
                              value={editServiceData.price}
                              onChange={(e) => setEditServiceData({...editServiceData, price: e.target.value})}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Длительность"
                              value={editServiceData.duration}
                              onChange={(e) => setEditServiceData({...editServiceData, duration: e.target.value})}
                            />
                            <input
                              type="text"
                              placeholder="Подготовка"
                              value={editServiceData.preparation}
                              onChange={(e) => setEditServiceData({...editServiceData, preparation: e.target.value})}
                            />
                            <select
                              value={editServiceData.categoryId}
                              onChange={(e) => setEditServiceData({...editServiceData, categoryId: e.target.value})}
                              required
                            >
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Порядок"
                              value={editServiceData.order}
                              onChange={(e) => setEditServiceData({...editServiceData, order: parseInt(e.target.value)})}
                              min="0"
                            />
                            <div className="edit-actions">
                              <button type="submit" className="save-btn">Сохранить</button>
                              <button type="button" onClick={() => setEditingService(null)} className="cancel-btn">Отмена</button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminServicesTree;
