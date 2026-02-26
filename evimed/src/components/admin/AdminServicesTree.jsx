import React, { useState, useEffect, useRef } from 'react';
import './AdminServicesTree.css';

const AdminServicesTree = ({ token, API_BASE }) => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [scrollToCategoryId, setScrollToCategoryId] = useState(null);
  const servicesTreeRef = useRef(null);

  // Формы для добавления
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    order: 0,
    parentId: '',
    imageUrl: ''
  });
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    preparation: '',
    categoryId: '',
    order: 0,
    imageUrl: ''
  });
  const [newServiceImage, setNewServiceImage] = useState(null);
  const [editServiceImage, setEditServiceImage] = useState(null);

  // Режимы редактирования
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({});
  const [editServiceData, setEditServiceData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  // Прокрутка к категории после изменения порядка
  useEffect(() => {
    if (scrollToCategoryId && !loading && servicesTreeRef.current) {
      const categoryElement = servicesTreeRef.current.querySelector(`[data-category-id="${scrollToCategoryId}"]`);
      if (categoryElement) {
        setTimeout(() => {
          categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Подсветка на короткое время
          categoryElement.style.transition = 'background-color 0.3s';
          categoryElement.style.backgroundColor = '#fff3cd';
          setTimeout(() => {
            categoryElement.style.backgroundColor = '';
            setTimeout(() => {
              categoryElement.style.transition = '';
            }, 300);
          }, 1000);
        }, 100);
      }
      setScrollToCategoryId(null);
    }
  }, [scrollToCategoryId, loading]);

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
      let imageUrl = newCategory.imageUrl;
      
      // Загружаем изображение, если оно выбрано
      if (newCategoryImage) {
        imageUrl = await uploadImage(newCategoryImage, 'category');
      }

      const response = await fetch(`${API_BASE}/admin/service-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newCategory, imageUrl })
      });

      if (response.ok) {
        setNewCategory({ name: '', description: '', order: 0, parentId: '', imageUrl: '' });
        setNewCategoryImage(null);
        loadData();
        alert('Категория добавлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  };

  const uploadImage = async (file, type = 'service') => {
    const formData = new FormData();
    formData.append('image', file);

    const endpoint = type === 'category' ? 'category-image' : 'service-image';
    const response = await fetch(`${API_BASE}/upload/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка загрузки изображения');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = newService.imageUrl;
      
      // Загружаем изображение, если оно выбрано
      if (newServiceImage) {
        imageUrl = await uploadImage(newServiceImage);
      }

      const response = await fetch(`${API_BASE}/admin/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newService, imageUrl })
      });

      if (response.ok) {
        setNewService({ name: '', description: '', price: '', duration: '', preparation: '', categoryId: '', order: 0, imageUrl: '' });
        setNewServiceImage(null);
        loadData();
        alert('Услуга добавлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryData({
      name: category.name,
      description: category.description || '',
      order: category.order,
      parentId: category.parentId || '',
      imageUrl: category.imageUrl || ''
    });
    setEditCategoryImage(null);
  };

  const saveCategoryEdit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editCategoryData.imageUrl;
      
      // Загружаем новое изображение, если оно выбрано
      if (editCategoryImage) {
        imageUrl = await uploadImage(editCategoryImage, 'category');
      }

      const response = await fetch(`${API_BASE}/admin/service-categories/${editingCategory}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...editCategoryData, imageUrl })
      });

      if (response.ok) {
        setEditCategoryData(prev => ({ ...prev, imageUrl }));
        setEditCategoryImage(null);
        loadData();
        alert('Категория обновлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка: ' + error.message);
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
      order: service.order,
      imageUrl: service.imageUrl || ''
    });
    setEditServiceImage(null);
  };

  const saveServiceEdit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editServiceData.imageUrl;
      
      // Загружаем новое изображение, если оно выбрано
      if (editServiceImage) {
        imageUrl = await uploadImage(editServiceImage);
      }

      const response = await fetch(`${API_BASE}/admin/services/${editingService}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...editServiceData, imageUrl })
      });

      if (response.ok) {
        setEditServiceData(prev => ({ ...prev, imageUrl }));
        setEditServiceImage(null);
        loadData();
        alert('Услуга обновлена успешно');
      } else {
        const data = await response.json();
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Ошибка: ' + error.message);
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

  const moveCategoryOrder = async (categoryId, direction) => {
    try {
      const rootCategories = getRootCategories().sort((a, b) => (a.order || 0) - (b.order || 0));
      const currentIndex = rootCategories.findIndex(cat => cat.id === categoryId);
      
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= rootCategories.length) return;
      
      // Создаем новый массив с измененным порядком
      const reorderedCategories = [...rootCategories];
      const [movedCategory] = reorderedCategories.splice(currentIndex, 1);
      reorderedCategories.splice(newIndex, 0, movedCategory);
      
      // Переназначаем порядок последовательно всем категориям
      const updatePromises = reorderedCategories.map((cat, index) => {
        const newOrder = index + 1;
        const currentOrder = cat.order || 0;
        // Обновляем только если порядок изменился
        if (currentOrder !== newOrder) {
          return fetch(`${API_BASE}/admin/service-categories/${cat.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ order: newOrder })
          });
        }
        return Promise.resolve({ ok: true });
      });
      
      const results = await Promise.all(updatePromises);
      const failed = results.some(res => res && !res.ok);
      
      if (failed) {
        alert('Ошибка обновления порядка некоторых категорий');
      } else {
        // Сохраняем ID категории для прокрутки после загрузки
        setScrollToCategoryId(categoryId);
        loadData();
      }
    } catch (error) {
      alert('Ошибка изменения порядка категории: ' + error.message);
    }
  };

  const getServicesForCategory = (categoryId) => {
    return services.filter(service => service.categoryId === categoryId);
  };

  // Получить только корневые категории (без родителя)
  const getRootCategories = () => {
    return categories.filter(cat => !cat.parentId);
  };

  // Получить дочерние категории
  const getChildCategories = (parentId) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

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
        alert(`Синхронизация завершена!\n\nКатегории: ${result.categories.total} из ${result.categories.original} (создано ${result.categories.created}, обновлено ${result.categories.updated})\nУслуги: ${result.services.total} из ${result.services.original} (создано ${result.services.created}, обновлено ${result.services.updated})\nОшибок: ${result.errors.length}\n\nПримечание: Показываются только подкатегории ИССЛЕДОВАНИЯ, ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ объединены в одну категорию, и ПАКЕТНОЕ ПРЕДЛОЖЕНИЕ.`);
        loadData(); // Перезагружаем данные после синхронизации
      } else {
        const error = await response.json();
        alert('Ошибка синхронизации: ' + error.error);
      }
    } catch (error) {
      alert('Ошибка подключения к серверу: ' + error.message);
    }
  };

  // Получаем отсортированные корневые категории один раз
  const getSortedRootCategories = () => {
    return getRootCategories().sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Рекурсивный рендер категории и её детей
  const renderCategoryNode = (category, level = 0, sortedRootCategories = null) => {
    const categoryServices = getServicesForCategory(category.id);
    const childCategories = getChildCategories(category.id);
    const isExpanded = expandedCategories.has(category.id);
    
    // Вычисляем индекс категории в отсортированном списке корневых категорий (только для корневых)
    let categoryIndex = -1;
    if (!category.parentId) {
      if (!sortedRootCategories) {
        sortedRootCategories = getSortedRootCategories();
      }
      categoryIndex = sortedRootCategories.findIndex(cat => cat.id === category.id);
    }
    
    return (
      <div 
        key={category.id} 
        className="tree-category" 
        style={{ marginLeft: `${level * 20}px` }}
        data-category-id={category.id}
      >
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
              ({categoryServices.length} услуг{childCategories.length > 0 ? `, ${childCategories.length} подкатегорий` : ''})
            </span>
          </div>
          <div className="category-actions">
            {/* Кнопки изменения порядка - только для корневых категорий */}
            {!category.parentId && (
              <>
                <button
                  className="order-btn"
                  onClick={() => moveCategoryOrder(category.id, 'up')}
                  title="Переместить вверх"
                  disabled={categoryIndex === 0}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="order-btn"
                  onClick={() => moveCategoryOrder(category.id, 'down')}
                  title="Переместить вниз"
                  disabled={categoryIndex === sortedRootCategories.length - 1}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4V12M8 12L4 8M8 12L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
            <button
              className="edit-btn"
              onClick={() => editCategory(category)}
              title="Редактировать"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.686 11.9445 1.59124C12.1727 1.49649 12.4166 1.44775 12.6627 1.44775C12.9088 1.44775 13.1527 1.49649 13.3809 1.59124C13.6091 1.686 13.817 1.82491 13.9921 2.00001C14.1672 2.17511 14.3061 2.38305 14.4009 2.61122C14.4956 2.8394 14.5444 3.08327 14.5444 3.32935C14.5444 3.57543 14.4956 3.8193 14.4009 4.04748C14.3061 4.27565 14.1672 4.48359 13.9921 4.65868L5.176 13.4747L1.33333 14.6667L2.52533 10.824L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteCategory(category.id)}
              title="Удалить"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Редактирование категории */}
        {editingCategory === category.id && (
          <div className="edit-form">
            <form onSubmit={saveCategoryEdit}>
              {/* Основная информация */}
              <div className="form-section">
                <h4 className="form-section-title">Основная информация</h4>
                <div className="form-group">
                  <label>Название категории *</label>
                  <input
                    type="text"
                    value={editCategoryData.name}
                    onChange={(e) => setEditCategoryData({...editCategoryData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Описание</label>
                  <textarea
                    value={editCategoryData.description}
                    onChange={(e) => setEditCategoryData({...editCategoryData, description: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>

              {/* Структура и порядок */}
              <div className="form-section">
                <h4 className="form-section-title">Структура и порядок</h4>
                <div className="form-group">
                  <label>Родительская категория</label>
                  <select
                    value={editCategoryData.parentId}
                    onChange={(e) => setEditCategoryData({...editCategoryData, parentId: e.target.value})}
                  >
                    <option value="">Корневая категория</option>
                    {categories
                      .filter(cat => cat.id !== editingCategory)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.parent ? `↳ ${cat.name}` : cat.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Порядок сортировки</label>
                  <input
                    type="number"
                    value={editCategoryData.order}
                    onChange={(e) => setEditCategoryData({...editCategoryData, order: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              {/* Изображение */}
              <div className="form-section">
                <h4 className="form-section-title">Изображение категории</h4>
                <div className="form-group full-width">
                  <div className="image-preview-container">
                    <label>Текущее изображение:</label>
                    <div className="image-preview">
                      {editCategoryData.imageUrl && !editCategoryImage ? (
                        <img
                          src={`${API_BASE}${editCategoryData.imageUrl}`}
                          alt="Current"
                        />
                      ) : (
                        <span className="no-image-placeholder">Нет изображения</span>
                      )}
                    </div>
                  </div>
                  <label>Загрузить новое изображение:</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => setEditCategoryImage(e.target.files[0])}
                  />
                  {editCategoryImage && (
                    <div className="image-preview-container">
                      <label>Предпросмотр нового изображения:</label>
                      <div className="image-preview">
                        <img 
                          src={URL.createObjectURL(editCategoryImage)} 
                          alt="Preview" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="edit-actions">
                <button type="submit" className="save-btn">Сохранить</button>
                <button type="button" onClick={() => setEditingCategory(null)} className="cancel-btn">Отмена</button>
              </div>
            </form>
          </div>
        )}

        {/* Услуги и подкатегории */}
        {isExpanded && (
          <div className="category-content">
            {/* Услуги категории */}
            {categoryServices.length > 0 && (
              <div className="category-services">
                {categoryServices.map(service => (
                  <div key={service.id} className="service-container">
                    <div className="tree-service">
                      <div className="service-info">
                        <span className={`service-name ${!service.isActive ? 'inactive' : ''}`}>
                          {service.name}
                        </span>
                        <span className="service-price">{service.price} ₽</span>
                        <span className="service-duration">{service.duration}</span>
                      </div>
                      <div className="service-actions">
                        <button
                          className="edit-btn"
                          onClick={() => editService(service)}
                          title="Редактировать"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.686 11.9445 1.59124C12.1727 1.49649 12.4166 1.44775 12.6627 1.44775C12.9088 1.44775 13.1527 1.49649 13.3809 1.59124C13.6091 1.686 13.817 1.82491 13.9921 2.00001C14.1672 2.17511 14.3061 2.38305 14.4009 2.61122C14.4956 2.8394 14.5444 3.08327 14.5444 3.32935C14.5444 3.57543 14.4956 3.8193 14.4009 4.04748C14.3061 4.27565 14.1672 4.48359 13.9921 4.65868L5.176 13.4747L1.33333 14.6667L2.52533 10.824L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteService(service.id)}
                          title="Удалить"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Редактирование услуги */}
                    {editingService === service.id && (
                      <div className="service-edit-form">
                        <form onSubmit={saveServiceEdit}>
                          {/* Основная информация */}
                          <div className="form-section">
                            <h4 className="form-section-title">Основная информация</h4>
                            <div className="form-group">
                              <label>Название услуги *</label>
                              <input
                                type="text"
                                value={editServiceData.name}
                                onChange={(e) => setEditServiceData({...editServiceData, name: e.target.value})}
                                required
                              />
                            </div>
                            <div className="form-group full-width">
                              <label>Описание</label>
                              <textarea
                                value={editServiceData.description}
                                onChange={(e) => setEditServiceData({...editServiceData, description: e.target.value})}
                                rows="3"
                              />
                            </div>
                          </div>

                          {/* Параметры услуги */}
                          <div className="form-section">
                            <h4 className="form-section-title">Параметры услуги</h4>
                            <div className="form-group">
                              <label>Цена (₽) *</label>
                              <input
                                type="number"
                                value={editServiceData.price}
                                onChange={(e) => setEditServiceData({...editServiceData, price: e.target.value})}
                                required
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Длительность</label>
                              <input
                                type="text"
                                placeholder="например: 30 мин"
                                value={editServiceData.duration}
                                onChange={(e) => setEditServiceData({...editServiceData, duration: e.target.value})}
                              />
                            </div>
                            <div className="form-group full-width">
                              <label>Подготовка</label>
                              <input
                                type="text"
                                placeholder="например: Без подготовки"
                                value={editServiceData.preparation}
                                onChange={(e) => setEditServiceData({...editServiceData, preparation: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Категория и порядок */}
                          <div className="form-section">
                            <h4 className="form-section-title">Категория и порядок</h4>
                            <div className="form-group">
                              <label>Категория *</label>
                              <select
                                value={editServiceData.categoryId}
                                onChange={(e) => setEditServiceData({...editServiceData, categoryId: e.target.value})}
                                required
                              >
                                <option value="">Выберите категорию</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Порядок сортировки</label>
                              <input
                                type="number"
                                value={editServiceData.order}
                                onChange={(e) => setEditServiceData({...editServiceData, order: parseInt(e.target.value)})}
                                min="0"
                              />
                            </div>
                          </div>

                          {/* Изображение */}
                          <div className="form-section">
                            <h4 className="form-section-title">Изображение услуги</h4>
                            <div className="form-group full-width">
                              <div className="image-preview-container">
                                <label>Текущее изображение:</label>
                                <div className="image-preview">
                                  {editServiceData.imageUrl && !editServiceImage ? (
                                    <img
                                      src={`${API_BASE}${editServiceData.imageUrl}`}
                                      alt="Current"
                                    />
                                  ) : (
                                    <span className="no-image-placeholder">Нет изображения</span>
                                  )}
                                </div>
                              </div>
                              <label>Загрузить новое изображение:</label>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => setEditServiceImage(e.target.files[0])}
                              />
                              {editServiceImage && (
                                <div className="image-preview-container">
                                  <label>Предпросмотр нового изображения:</label>
                                  <div className="image-preview">
                                    <img 
                                      src={URL.createObjectURL(editServiceImage)} 
                                      alt="Preview" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

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

            {/* Рекурсивный рендер дочерних категорий */}
            {childCategories.length > 0 && (
              <div className="child-categories">
                {childCategories.map(childCat => renderCategoryNode(childCat, level + 1, sortedRootCategories))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="admin-services-tree-loading">Загрузка...</div>;
  }

  return (
    <div className="admin-services-tree">
      <div className="tree-header">
        <h2>Древовидная структура услуг</h2>
        <div className="header-actions">
          <button onClick={syncWithRenovatio} className="sync-btn">
            Синхронизировать с Renovatio
          </button>
          <button onClick={loadData} className="refresh-btn">Обновить</button>
        </div>
      </div>

      {/* Формы добавления */}
      <div className="add-forms">
        <div className="add-category-form">
          <h3>Добавить категорию</h3>
          <form onSubmit={addCategory}>
            {/* Основная информация */}
            <div className="form-section">
              <h4 className="form-section-title">Основная информация</h4>
              <div className="form-group">
                <label>Название категории *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Описание</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  rows="3"
                />
              </div>
            </div>

            {/* Структура и порядок */}
            <div className="form-section">
              <h4 className="form-section-title">Структура и порядок</h4>
              <div className="form-group">
                <label>Родительская категория</label>
                <select
                  value={newCategory.parentId}
                  onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value})}
                >
                  <option value="">Корневая категория</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.parent ? `↳ ${category.name}` : category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Порядок сортировки</label>
                <input
                  type="number"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory({...newCategory, order: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
            </div>

            {/* Изображение */}
            <div className="form-section">
              <h4 className="form-section-title">Изображение категории</h4>
              <div className="form-group full-width">
                <label>Загрузить изображение:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => setNewCategoryImage(e.target.files[0])}
                />
                {newCategoryImage && (
                  <div className="image-preview-container">
                    <label>Предпросмотр:</label>
                    <div className="image-preview">
                      <img 
                        src={URL.createObjectURL(newCategoryImage)} 
                        alt="Preview" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit">Добавить категорию</button>
          </form>
        </div>

        <div className="add-service-form">
          <h3>Добавить услугу</h3>
          <form onSubmit={addService}>
            {/* Основная информация */}
            <div className="form-section">
              <h4 className="form-section-title">Основная информация</h4>
              <div className="form-group">
                <label>Название услуги *</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Описание</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  rows="3"
                />
              </div>
            </div>

            {/* Параметры услуги */}
            <div className="form-section">
              <h4 className="form-section-title">Параметры услуги</h4>
              <div className="form-group">
                <label>Цена (₽) *</label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Длительность</label>
                <input
                  type="text"
                  placeholder="например: 30 мин"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                />
              </div>
              <div className="form-group full-width">
                <label>Подготовка</label>
                <input
                  type="text"
                  placeholder="например: Без подготовки"
                  value={newService.preparation}
                  onChange={(e) => setNewService({...newService, preparation: e.target.value})}
                />
              </div>
            </div>

            {/* Категория и порядок */}
            <div className="form-section">
              <h4 className="form-section-title">Категория и порядок</h4>
              <div className="form-group">
                <label>Категория *</label>
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
              </div>
              <div className="form-group">
                <label>Порядок сортировки</label>
                <input
                  type="number"
                  value={newService.order}
                  onChange={(e) => setNewService({...newService, order: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
            </div>

            {/* Изображение */}
            <div className="form-section">
              <h4 className="form-section-title">Изображение услуги</h4>
              <div className="form-group full-width">
                <label>Загрузить изображение:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => setNewServiceImage(e.target.files[0])}
                />
                {newServiceImage && (
                  <div className="image-preview-container">
                    <label>Предпросмотр:</label>
                    <div className="image-preview">
                      <img 
                        src={URL.createObjectURL(newServiceImage)} 
                        alt="Preview" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit">Добавить услугу</button>
          </form>
        </div>
      </div>

      {/* Древовидная структура - рекурсивный рендеринг */}
      <div className="services-tree" ref={servicesTreeRef}>
        {(() => {
          const sortedRoot = getSortedRootCategories();
          return sortedRoot.map(category => renderCategoryNode(category, 0, sortedRoot));
        })()}
      </div>
    </div>
  );
};

export default AdminServicesTree;
