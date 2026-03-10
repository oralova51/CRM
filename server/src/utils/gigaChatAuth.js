// src/utils/gigachatAuth.js
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { AI_AUTH_KEY, AI_AUTH_URL } = process.env;

// Настройка работы с HTTPS соединением
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Описание тарификации (в нашем случае физ. лицо)
const payload = {
  scope: 'GIGACHAT_API_PERS',
};

// Настройка экземпляра для последующих запросов
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
    RqUID: crypto.randomUUID(),
    Authorization: `Basic ${AI_AUTH_KEY}`,
  },
});

function oAuth() {
  return axiosInstance
    .post(AI_AUTH_URL, payload)
    .then(({ data }) => data)
    .catch((err) => err);
}

module.exports = oAuth;