// server/src/middlewares/verifyAccessTokenOptional.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyAccessTokenOptional(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.user = decoded.user || decoded;
    next();
  } catch {
    next(); // токен невалидный — просто идём дальше без user
  }
}

module.exports = verifyAccessTokenOptional;