const config = require('../configs/index');
const oAuth = require('../utils/gigaChatAuth');
const { gigaChatUrl } = require('../configs/aiConfig');
const axios = require('axios');

class LLMService {
  async generateAnswer(context, question) {
    const requestBody = {
      model: 'arcee-ai/trinity-mini:free',
      messages: [
        {
          role: 'user',
          content: `Context: ${context}. Question: ${question}`,
        },
        {
          role: 'system',
          content: `You are an assistant. Answer only based on the provided context. If the answer is not in the context, say so. Choose only 1 most suitable option and answer in 1 sentence.`,
        },
      ],
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message ?? data?.message ?? JSON.stringify(data);
      console.error('[LLM] OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        body: data,
      });
      throw new Error(`OpenRouter API (${response.status}): ${errorMessage}`);
    }

    const answer = data.choices?.[0]?.message?.content;
    if (answer === undefined) {
      console.error('[LLM] Неожиданная структура ответа OpenRouter:', { data });
      throw new Error('OpenRouter вернул ответ без choices. Проверьте модель и параметры запроса.');
    }

    return answer;
  }

  // Новый метод для GigaChat
async generateAnswerWithGigaChat(context, question) {
  const contextText = Array.isArray(context) ? context.join('\n\n') : context;
  
  const messages = [
    {
      role: 'system',
      content: 'Ты помощник. Отвечай только на основе предоставленного контекста. Если ответа нет в контексте — скажи об этом. Отвечай кратко, на русском.',
    },
    {
      role: 'user',
      content: `Контекст: ${contextText}\n\nВопрос: ${question}`,
    },
  ];
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
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    },
  );
  return response.data.choices[0].message.content;
}
}

module.exports = new LLMService();
