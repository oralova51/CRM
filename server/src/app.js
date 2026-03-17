require('dotenv').config();
const path = require('path');
const express = require('express');
const serverConfig = require('./configs/serverConfig');
const apiRouter = require('./routes/api.route');
const ragService = require('./services/rag.service');

const PORT = process.env.PORT || 3000;
// создаём приложение
const app = express();

// конфигурируем приложение (подключаем миддлвары)
serverConfig(app);

// Подключаем главный маршрутизатор (apiRouter)
app.use('/api', apiRouter);

// Запускаем приложение после индексации RAG
const defaultRagFilePath = path.join(__dirname, '../public/texts/text.txt');
ragService
  .getFileIndex(defaultRagFilePath)
  .then((chunksCount) => {
    console.log(`[RAG] Проиндексировано ${chunksCount} фрагментов`);
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту: ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('[RAG] Не удалось проиндексировать файл:', err.message);
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту: ${PORT}`);
    });
  });
