// server/src/middlewares/verifyAccessToken.js
require('dotenv').config();
const formatResponse = require('../utils/formatResponse');
const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
  try {
    // Проверяем наличие заголовка
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json(
        formatResponse(401, 'Нет заголовка авторизации', null, 'No authorization header')
      );
    }

    // Проверяем формат "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json(
        formatResponse(401, 'Неверный формат авторизации', null, 'Invalid authorization format')
      );
    }

    const token = parts[1];
    
    if (!token) {
      return res.status(401).json(
        formatResponse(401, 'Нет токена доступа', null, 'No access token')
      );
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Проверяем структуру токена
    if (decoded.user) {
      res.locals.user = decoded.user;
    } else {
      res.locals.user = decoded;
    }

    next();
  } catch (error) {
    console.log('==== Verify Access Token Error ====');
    console.log(error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        formatResponse(401, 'Токен истек', null, 'Token expired')
      );
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        formatResponse(401, 'Невалидный токен', null, 'Invalid token')
      );
    }
    
    res.status(500).json(
      formatResponse(500, 'Внутренняя ошибка сервера', null, error.message)
    );
  }
}

module.exports = verifyAccessToken;