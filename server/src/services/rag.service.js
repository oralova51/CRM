const fs = require('fs/promises');
const embeddingService = require('./embedding.service');
const llmService = require('./llm.service');
const config = require('../configs/index');

class RAGService {
  constructor() {
    this.vectorStorage = [];
  }
  // Разбиваем текст на фрагменты (чанки)
  getTextChunks(text) {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/gm) || [text];

    const chunks = [];

    let currentChunk = '';

    sentences.forEach((sentence) => {
      if (currentChunk.length + sentence.length > config.chunkSize) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      currentChunk += sentence + ' ';
    });

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    console.log(chunks);

    return chunks;
  }

  async getFileIndex(filePath) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const chunks = this.getTextChunks(fileContent);

    // Сохраняем фрагменты в векторном хранилище
    this.vectorStorage = chunks.map((chunk) => ({ text: chunk }));

    return chunks.length;
  }

  // Ищем подходящие по смыслу фрагменты в хранилище
  async findRelevantChunks(query) {
    if (this.vectorStorage.length === 0) {
      return [];
    }
    const textFragments = this.vectorStorage.map((item) => item.text);
    const similarity = await embeddingService.getSimilarity(query, textFragments);

    const rankedSimilarity = similarity
      .map((score, index) => ({
        text: textFragments[index],
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, config.topP);

    return rankedSimilarity.map((item) => item.text);
  }

  // обработка запроса - создание контекста для LLM и генерация ответа
  async query(query) {
    const context = await this.findRelevantChunks(query);
    const answer = await llmService.generateAnswer(context, query);

    return { answer, context };
  }

  clearStorage() {
    this.vectorStorage = [];
  }

  getStorageSize() {
    return this.vectorStorage.length;
  }
}

module.exports = new RAGService();
