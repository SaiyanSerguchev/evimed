# evimed

������ ��������� ������ (client/, server/).

## Docker

### Быстрый старт

1. Соберите образ (многоэтапная сборка Node -> Nginx):
```bash
docker compose build
```

2. Запустите контейнер:
```bash
docker compose up -d
```

3. Откройте приложение: `http://localhost:8080`

### Полезные команды
- Остановить: `docker compose down`
- Пересобрать с нуля: `docker compose build --no-cache`
- Просмотреть логи: `docker compose logs -f`

### Примечания
- Сборка фронтенда выполняется командой `npm run build`, артефакты попадают в `dist/` (см. `webpack.config.js`).
- Nginx настроен под SPA: все неизвестные маршруты отдаются через `index.html`.