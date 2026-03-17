const axios = require('axios');
const { AiMessage } = require('../../db/models');
const oAuth = require('../utils/gigaChatAuth');
const { gigaChatUrl } = require('../configs/aiConfig');

const SYSTEM_PROMPT = `
Ты — профессиональный AI-консультант студии красоты и здоровья.
Твоя задача — помогать клиентам выбирать процедуры, объяснять их пользу, отвечать на вопросы о стоимости, пакетах услуг, уходе за телом, питании и физической активности.

Ты общаешься с клиентами студии напрямую, как администратор-консультант.

Отвечай только на русском языке.
Твой стиль общения: вежливый, экспертный, спокойный, поддерживающий.
`;

class AIService {
  static async getChatHistory(userId) {
    try {
      return await AiMessage.findAll({
        where: { user_id: userId },
        order: [['created_at', 'ASC']],
        attributes: ['role', 'content'],
      });
    } catch (error) {
      throw new Error('Error fetching chat history: ' + error.message);
    }
  }

  static async saveMessage(userId, role, content) {
    try {
      return await AiMessage.create({ user_id: userId, role, content });
    } catch (error) {
      throw new Error('Error saving message: ' + error.message);
    }
  }

  static async chat(userId, userMessage) {
    try {
      const history = await AIService.getChatHistory(userId);

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(({ role, content }) => ({ role, content })),
        { role: 'user', content: userMessage },
      ];

      await AIService.saveMessage(userId, 'user', userMessage);

      const { access_token } = await oAuth();

      const response = await axios.post(
        gigaChatUrl,
        { model: 'GigaChat', messages },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const assistantContent = response.data.choices[0].message.content;

      await AIService.saveMessage(userId, 'assistant', assistantContent);

      return assistantContent;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AIService;
