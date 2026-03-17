# Личный кабинет — Студия «Идеальное тело»

Мобильный личный кабинет клиента студии коррекции фигуры: записи на процедуры, замеры, программа лояльности, AI-ассистент.

**Стек:** 
Node.js · Express · PostgreSQL · React · Vite · GigaChat   

## Требования

- Node.js 20+
- PostgreSQL 15+

## Запуск

1. Клонировать репозиторий
2. Установить зависимости:
   ```bash
   cd server && npm install
   cd ../client && npm install

3. Создать .env в server/ по образцу server/.env.example

4. Создать БД и применить миграции
``` 
cd server && npm run db
```
5. Запустить 
# Терминал 1
cd server && npm run dev

# Терминал 2
cd client && npm run dev