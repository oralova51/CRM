const morgan = require('morgan');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const removeXPoweredByHeader = require('../middlewares/removeHeader');

const corsOptions = { origin: ['http://localhost:5173'], credentials: true };

// Функция принимает серверное приложение и подключает миддлвары
const serverConfig = (app) => {
  app.use(morgan('dev'));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(removeXPoweredByHeader); // собственная миддлвара для удаления заголовка
  app.use(express.static(path.join(__dirname, '../public'))); // раздача статических файлов из папки public
};

module.exports = serverConfig;
