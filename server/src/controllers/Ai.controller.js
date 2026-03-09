const formatResponse = require("../utils/formatResponse");
const AIService = require("../services/AI.service");

/**
 * Контроллер для взаимодействия с AI-ассистентом чата студии красоты.
 * Использует AIService для работы с GigaChat и хранением сообщений в БД.
 */
class AiController {
  /**
   * GET /api/ai/history
   * Возвращает историю чата текущего пользователя.
   * Требует аутентификации (verifyAccessToken).
   *
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  static async getChatHistory(req, res) {
    try {
      const { user } = res.locals;

      if (!user?.id) {
        return res
          .status(401)
          .json(
            formatResponse(
              401,
              "Требуется авторизация",
              null,
              "User not authenticated",
            ),
          );
      }

      const history = await AIService.getChatHistory(user.id);

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            history.length ? "История чата получена" : "История чата пуста",
            history,
            null,
          ),
        );
    } catch (error) {
      console.error("==== AiController.getChatHistory ====");
      console.error(error);
      return res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при получении истории чата",
            null,
            error.message,
          ),
        );
    }
  }

  /**
   * POST /api/ai/chat
   * Отправляет сообщение пользователя AI-ассистенту и возвращает ответ.
   * Сообщение сохраняется в БД, история используется для контекста.
   * Требует аутентификации (verifyAccessToken).
   *
   * @param {Object} req - Express request
   * @param {Object} req.body - { message: string }
   * @param {Object} res - Express response
   */
  static async sendMessage(req, res) {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Сообщение обязательно и должно быть строкой",
            null,
            "message is required",
          ),
        );
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Сообщение не может быть пустым",
            null,
            "message must not be empty",
          ),
        );
    }

    const MAX_MESSAGE_LENGTH = 2000;
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            `Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`,
            null,
            "message too long",
          ),
        );
    }

    try {
      const { user } = res.locals;

      if (!user?.id) {
        return res
          .status(401)
          .json(
            formatResponse(
              401,
              "Требуется авторизация",
              null,
              "User not authenticated",
            ),
          );
      }

      const assistantContent = await AIService.chat(user.id, trimmedMessage);

      return res
        .status(200)
        .json(
          formatResponse(200, "Ответ получен", { content: assistantContent }, null),
        );
    } catch (error) {
      console.error("==== AiController.sendMessage ====");
      console.error(error);
      return res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при обработке сообщения",
            null,
            error.message,
          ),
        );
    }
  }
}

module.exports = AiController;
