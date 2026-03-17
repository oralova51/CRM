const ragService = require('../services/rag.service');

class RAGController {
  async indexFile(req, res) {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        return res.status(400).json({
          message: 'Необходимо указать путь к файлу',
        });
      }
      const chunksCount = await ragService.getFileIndex(filePath);
      return res.status(200).json({
        message: 'Файл успешно индексирован',
        chunksCount,
        filePath,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Ошибка индексации файла',
        error: error.message,
      });
    }
  }

  async query(req, res) {
    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({
          message: 'Необходимо указать вопрос',
        });
      }
      if (ragService.getStorageSize() === 0) {
        return res.status(400).json({
          message: 'Индексированные файлы отсутствуют',
        });
      }

      const { answer, context } = await ragService.query(question);

      return res.status(200).json({
        message: 'Ответ успешно сгенерирован',
        answer: answer?.trim(),
        context,
      });
    } catch (error) {
      console.error('[RAG] Ошибка при обработке query:', {
        message: error.message,
        stack: error.stack,
      });
      return res.status(500).json({
        message: 'Ошибка генерации ответа',
        error: error.message,
      });
    }
  }

  async clearStorage(req, res) {
    try {
      ragService.clearStorage();
      return res.status(200).json({
        message: 'Хранилище успешно очищено',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Ошибка очистки хранилища',
        error: error.message,
      });
    }
  }
}

module.exports = new RAGController();
