require('dotenv').config();
const express = require('express');
const serverConfig = require('./configs/serverConfig');
const apiRouter = require('./routes/api.route');

const PORT = process.env.PORT || 3000;
// создаём приложение
const app = express();

// конфигурируем приложение (подключаем миддлвары)
serverConfig(app);

// Подключаем главный маршрутизатор (apiRouter)
app.use('/api', apiRouter);


// Запускаем приложение
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
