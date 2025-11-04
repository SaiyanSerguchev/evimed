# Evimed Backend Server

Backend сервер для медицинской платформы Evimed с использованием Express.js, Prisma ORM и PostgreSQL.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Скопируйте файл конфигурации:
```bash
cp example.env .env
```

3. Настройте переменные окружения в `.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/evimed?schema=public"
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
ADMIN_EMAIL=admin@evimed.ru
ADMIN_PASSWORD=admin123
ADMIN_NAME=Администратор
ADMIN_PHONE=+7 (999) 123-45-67
```

4. Создайте базу данных и выполните миграции:
```bash
npm run db:migrate
```

5. Заполните базу тестовыми данными:
```bash
npm run db:seed
```

## Запуск

### Development режим
```bash
npm run dev
```

### Production режим
```bash
npm start
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация пользователя

### Пользователи
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `PUT /api/users/:id` - Обновить пользователя

### Услуги
- `GET /api/services` - Получить все услуги
- `POST /api/services` - Создать услугу
- `PUT /api/services/:id` - Обновить услугу
- `DELETE /api/services/:id` - Удалить услугу

### Записи на прием
- `GET /api/appointments` - Получить все записи
- `POST /api/appointments` - Создать запись
- `PUT /api/appointments/:id` - Обновить запись
- `DELETE /api/appointments/:id` - Удалить запись

### Баннеры
- `GET /api/banners` - Получить активные баннеры
- `POST /api/admin/banners` - Создать баннер (только админ)
- `PUT /api/admin/banners/:id` - Обновить баннер (только админ)
- `DELETE /api/admin/banners/:id` - Удалить баннер (только админ)

### Админ панель
- `GET /api/admin/dashboard` - Статистика дашборда
- `GET /api/admin/users` - Управление пользователями
- `GET /api/admin/services` - Управление услугами
- `GET /api/admin/appointments` - Управление записями
- `GET /api/admin/banners` - Управление баннерами

## Тестовые данные

После выполнения `npm run db:seed` будет создан админ пользователь с данными из `.env`:

**По умолчанию:**
- Email: `admin@evimed.ru`
- Пароль: `admin123`
- Имя: `Администратор`
- Телефон: `+7 (999) 123-45-67`

**Настройка в `.env`:**
```env
ADMIN_EMAIL=admin@evimed.ru
ADMIN_PASSWORD=admin123
ADMIN_NAME=Администратор
ADMIN_PHONE=+7 (999) 123-45-67
```

Также создаются несколько тестовых услуг и баннеров для демонстрации функциональности.

## Prisma команды

- `npm run db:generate` - Генерация Prisma Client
- `npm run db:migrate` - Выполнение миграций
- `npm run db:deploy` - Деплой миграций (production)
- `npm run db:seed` - Заполнение базы тестовыми данными
- `npm run db:studio` - Открыть Prisma Studio

## Структура проекта

```
srv/
├── prisma/
│   ├── schema.prisma      # Схема базы данных
│   └── seed.js            # Скрипт заполнения тестовыми данными
├── routes/                # API маршруты
├── middleware/           # Middleware функции
├── models/               # Prisma модели
├── lib/                  # Утилиты
├── index.js              # Главный файл сервера
└── package.json          # Зависимости и скрипты
```

## Технологии

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - База данных
- **JWT** - Аутентификация
- **bcryptjs** - Хеширование паролей
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Безопасность HTTP заголовков
- **Morgan** - Логирование HTTP запросов




















