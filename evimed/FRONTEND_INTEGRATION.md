# Evimed Frontend Integration

Интеграция фронтенда с системой email-верификации и Renovatio API для записи на прием.

## 🚀 Возможности

- **5-шаговый процесс записи** с интуитивным интерфейсом
- **Email-верификация** для безопасности записи
- **Интеграция с Renovatio API** для работы с реальными данными
- **Динамическая загрузка** врачей, клиник и расписания
- **Toast уведомления** для обратной связи
- **Адаптивный дизайн** для всех устройств
- **Валидация форм** с понятными сообщениями об ошибках

## 📋 Процесс записи

1. **Выбор категории услуги** - загрузка из API
2. **Выбор конкретной услуги** - фильтрация по категории
3. **Выбор клиники и врача** - загрузка из Renovatio
4. **Выбор даты и времени** - реальное расписание
5. **Заполнение контактных данных** - с валидацией
6. **Email-верификация** - отправка и проверка кода
7. **Подтверждение записи** - успешное завершение

## 🛠 Технологии

- **React 18** - основной фреймворк
- **Axios** - HTTP клиент для API
- **React Toastify** - уведомления
- **CSS3** - стилизация с анимациями
- **ES6+** - современный JavaScript

## 📁 Структура проекта

```
src/
├── components/
│   ├── AppointmentModal.jsx          # Основное модальное окно записи
│   ├── AppointmentModal.css          # Стили модального окна
│   ├── EmailVerificationModal.jsx    # Модальное окно верификации
│   ├── EmailVerificationModal.css    # Стили верификации
│   ├── CodeInput.jsx                 # Компонент ввода кода
│   ├── CodeInput.css                 # Стили ввода кода
│   ├── Timer.jsx                     # Компонент таймера
│   ├── Timer.css                     # Стили таймера
│   ├── SuccessStep.jsx               # Экран успеха
│   ├── SuccessStep.css               # Стили экрана успеха
│   └── ServicesSection.jsx           # Обновленная секция услуг
├── services/
│   ├── api.js                        # Базовый API клиент
│   ├── verificationApi.js            # API верификации
│   └── renovatioApi.js               # API Renovatio
├── utils/
│   ├── validators.js                 # Валидация форм
│   └── errorHandler.js               # Обработка ошибок
└── App.jsx                           # Главный компонент с Toast
```

## 🔧 Настройка

### 1. Установка зависимостей

```bash
npm install axios react-toastify
```

### 2. Переменные окружения

Создайте файл `.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEBUG=true
REACT_APP_ENABLE_VERIFICATION=true
REACT_APP_ENABLE_RENOVATIO_INTEGRATION=true
```

### 3. Запуск

```bash
npm start
```

## 📡 API Endpoints

### Верификация
- `POST /api/verification/send-code` - отправка кода
- `POST /api/verification/verify-code` - проверка кода
- `GET /api/verification/status/:email` - статус верификации
- `POST /api/verification/resend-code` - повторная отправка

### Справочники
- `GET /api/service-categories` - категории услуг
- `GET /api/services/category/:id` - услуги по категории
- `GET /api/renovatio/clinics` - клиники
- `GET /api/renovatio/doctors?clinic_id=X` - врачи
- `GET /api/renovatio/schedule` - расписание

## 🎨 Компоненты

### AppointmentModal

Основное модальное окно с 5 шагами:

```jsx
<AppointmentModal
  isOpen={isOpen}
  onClose={onClose}
  preselectedService={service} // опционально
/>
```

**Состояния:**
- `currentStep` - текущий шаг (1-5)
- `selectedCategory` - выбранная категория
- `selectedService` - выбранная услуга
- `selectedDoctor` - выбранный врач
- `selectedClinic` - выбранная клиника
- `formData` - данные формы
- `isLoading` - состояние загрузки

### EmailVerificationModal

Модальное окно верификации:

```jsx
<EmailVerificationModal
  isOpen={isOpen}
  onClose={onClose}
  email="user@example.com"
  appointmentData={data}
  onSuccess={handleSuccess}
/>
```

**Функции:**
- Ввод 4-значного кода
- Таймер обратного отсчета
- Повторная отправка кода
- Счетчик попыток

### CodeInput

Компонент ввода кода:

```jsx
<CodeInput
  length={4}
  onComplete={handleComplete}
  onChange={handleChange}
  disabled={false}
  error={false}
  autoFocus={true}
/>
```

### Timer

Компонент таймера:

```jsx
<Timer
  initialTime={600} // секунды
  onTimeUp={handleTimeUp}
  onTick={handleTick}
  format="mm:ss"
  showIcon={true}
/>
```

## 🔍 Валидация

### Формы

```javascript
import { validateAppointmentForm, formatAppointmentData } from '../utils/validators';

// Валидация формы
const validation = validateAppointmentForm(formData);
if (!validation.isValid) {
  setErrors(validation.errors);
}

// Форматирование для API
const apiData = formatAppointmentData(formData, selectedData);
```

### Поля

- **Email** - проверка формата
- **Телефон** - 7-15 цифр
- **Имя** - 2-50 символов, только буквы
- **Код** - 4 цифры

## ⚠️ Обработка ошибок

### API ошибки

```javascript
import { handleApiError, handleVerificationError } from '../utils/errorHandler';

try {
  const response = await api.getData();
} catch (error) {
  const handledError = handleApiError(error);
  toast.error(handledError.message);
}
```

### Типы ошибок

- **Сеть** - проблемы с подключением
- **Валидация** - неверные данные
- **Верификация** - неверный/истекший код
- **Запись** - конфликт времени
- **Сервер** - внутренние ошибки

## 🎯 Toast уведомления

```javascript
import { toast } from 'react-toastify';

// Успех
toast.success('Запись успешно создана!');

// Ошибка
toast.error('Не удалось загрузить данные');

// Информация
toast.info('Код отправлен на email');

// Предупреждение
toast.warning('Проверьте правильность данных');
```

## 📱 Адаптивность

### Breakpoints

- **Desktop** - > 768px
- **Tablet** - 768px - 480px
- **Mobile** - < 480px

### Особенности

- Сетка услуг адаптируется под экран
- Формы перестраиваются в колонку
- Модальные окна занимают весь экран
- Кнопки увеличиваются для touch

## 🔒 Безопасность

### Клиентская валидация

- Проверка всех полей перед отправкой
- Санитизация пользовательского ввода
- Защита от множественных запросов

### Rate Limiting

- Ограничение отправки кодов (1 в минуту)
- Ограничение общих запросов (5 в час)
- Блокировка при превышении лимитов

## 🧪 Тестирование

### Ручное тестирование

1. **Полный флоу записи**
   - Выбор услуги → врач → время → данные → верификация
   - Проверка всех шагов и переходов

2. **Обработка ошибок**
   - Неверный код верификации
   - Истечение времени
   - Ошибки сети
   - Конфликт записи

3. **Адаптивность**
   - Тестирование на разных экранах
   - Проверка touch-интерфейса

### Автоматическое тестирование

```bash
# Запуск тестов
npm test

# Покрытие кода
npm run test:coverage
```

## 🚀 Развертывание

### Production Build

```bash
npm run build
```

### Environment Variables

```env
REACT_APP_API_URL=https://api.evimed.ru/api
REACT_APP_DEBUG=false
REACT_APP_ENABLE_VERIFICATION=true
REACT_APP_ENABLE_RENOVATIO_INTEGRATION=true
```

## 📊 Мониторинг

### Логирование

```javascript
// Ошибки API
console.error('API Error:', error);

// Пользовательские действия
console.log('User action:', action);
```

### Аналитика

- Отслеживание шагов записи
- Измерение времени завершения
- Анализ ошибок и отказов

## 🔄 Обновления

### Версионирование

- **v1.0.0** - Базовая интеграция
- **v1.1.0** - Email-верификация
- **v1.2.0** - Renovatio API
- **v1.3.0** - Улучшения UX

### Миграции

При обновлении проверьте:
- Совместимость API endpoints
- Изменения в структуре данных
- Новые зависимости

## 📞 Поддержка

### Частые проблемы

1. **Не загружаются данные**
   - Проверьте URL API в .env
   - Убедитесь, что backend запущен

2. **Не отправляется код**
   - Проверьте настройки email в backend
   - Убедитесь в правильности email

3. **Ошибки валидации**
   - Проверьте формат данных
   - Убедитесь в заполнении обязательных полей

### Контакты

- **Email** - support@evimed.ru
- **Telegram** - @evimed_support
- **Документация** - docs.evimed.ru
