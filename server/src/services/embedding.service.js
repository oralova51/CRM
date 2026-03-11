const { InferenceClient } = require('@huggingface/inference');
const config = require('../configs/index');

class EmbeddingService {
  constructor() {
    this.client = new InferenceClient(config.hfToken);
  }
  // метод для получения схожести предложения с другими фрагментами текста
  async getSimilarity(sourceText, sentences) {
    try {
      return await this.client.sentenceSimilarity({
        model: 'intfloat/multilingual-e5-small',
        inputs: {
          source_sentence: sourceText,
          sentences: sentences,
        },
        provider: 'hf-inference',
      });
    } catch (error) {
      console.error('[Embedding] Ошибка HuggingFace API:', error.message, error);
      throw error;
    }
  }
}

module.exports = new EmbeddingService();
