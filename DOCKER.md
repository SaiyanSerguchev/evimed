# Docker Setup для Evimed

Этот проект использует Docker Compose для запуска всех сервисов: frontend, backend и база данных PostgreSQL.

## Требования

- Docker >= 20.10
- Docker Compose >= 2.0

## Быстрый старт

1. **Скопируйте файл с переменными окружения:**
   ```bash
   cp .env.example .env
   ```

2. **Отредактируйте `.env` файл** и укажите необходимые значения:
   - Пароль для базы данных
   - JWT секрет (обязательно измените в production!)
   - Настройки email
   - API ключи для Renovatio (если используется)

3. **Запустите все сервисы:**
   ```bash
   docker-compose up -d
   ```

4. **Проверьте статус:**
   ```bash
   docker-compose ps
   ```

5. **Просмотрите логи:**
   ```bash
   # Все сервисы
   docker-compose logs -f
   
   # Только backend
   docker-compose logs -f backend
   
   # Только frontend
   docker-compose logs -f frontend
   ```

## Доступ к сервисам

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432

## Управление

### Остановка сервисов
```bash
docker-compose down
```

### Остановка с удалением volumes (удалит данные БД!)
```bash
docker-compose down -v
```

### Пересборка образов
```bash
docker-compose build --no-cache
```

### Перезапуск конкретного сервиса
```bash
docker-compose restart backend
```

## Миграции базы данных

Миграции Prisma выполняются автоматически при запуске backend контейнера.

Для ручного выполнения миграций:
```bash
docker-compose exec backend npx prisma migrate deploy
```

Для создания новой миграции (в development):
```bash
docker-compose exec backend npx prisma migrate dev --name migration_name
```

## Prisma Studio (для просмотра БД)

```bash
docker-compose exec backend npx prisma studio
```

Затем откройте http://localhost:5555 в браузере.

## Загрузка данных (seed)

```bash
docker-compose exec backend npm run db:seed
```

## Структура проекта

```
evimed/
├── docker-compose.yml      # Основной файл docker-compose
├── .env.example            # Пример переменных окружения
├── srv/                    # Backend
│   ├── Dockerfile
│   └── .dockerignore
└── evimed/                 # Frontend
    ├── Dockerfile
    └── .dockerignore
```

## Переменные окружения

Основные переменные (см. `.env.example`):

- `DB_USER`, `DB_PASSWORD`, `DB_NAME` - настройки PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT токенов
- `ADMIN_LOGIN`, `ADMIN_PASSWORD` - учетные данные администратора
- `EMAIL_*` - настройки email сервиса
- `RENOVATIO_API_KEY` - ключ API для интеграции с Renovatio

## Troubleshooting

### Backend не запускается

1. Проверьте логи: `docker-compose logs backend`
2. Убедитесь, что база данных запущена: `docker-compose ps postgres`
3. Проверьте переменные окружения в `.env`

### База данных не подключается

1. Проверьте, что контейнер postgres запущен: `docker-compose ps postgres`
2. Проверьте DATABASE_URL в `.env`
3. Проверьте логи: `docker-compose logs postgres`

### Frontend не отображается

1. Проверьте, что backend доступен
2. Проверьте `REACT_APP_API_URL` в `.env`
3. Проверьте логи: `docker-compose logs frontend`

### Очистка и пересборка

Если что-то пошло не так, можно полностью пересобрать:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Production

Для production окружения:

1. Измените `NODE_ENV=production` в `.env`
2. Используйте сильные пароли и секретные ключи
3. Настройте reverse proxy (nginx) перед docker-compose
4. Используйте SSL/TLS сертификаты
5. Настройте регулярные бэкапы базы данных

