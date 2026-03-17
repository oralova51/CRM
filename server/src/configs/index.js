require('dotenv').config();

module.exports = {
  hfToken: process.env.HF_API_KEY,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  port: process.env.PORT,
  chunkSize: 100,
  topP: 1,
};