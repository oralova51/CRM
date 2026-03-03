import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Salad, Dumbbell } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const initialMessages: Record<string, Message[]> = {
  assistant: [
    {
      id: 1,
      role: "assistant",
      content: "Здравствуйте! Я ваш AI-ассистент Ideal Body Studio. Готов помочь с вопросами о процедурах, записи и уходе. Как я могу вам помочь?",
      timestamp: new Date(),
    },
  ],
  nutrition: [
    {
      id: 1,
      role: "assistant",
      content: "Привет! Я ваш персональный диетолог-консультант. Помогу составить план питания, подскажу рецепты и отвечу на вопросы о здоровом образе жизни. С чего начнём?",
      timestamp: new Date(),
    },
  ],
  fitness: [
    {
      id: 1,
      role: "assistant",
      content: "Здравствуйте! Я ваш фитнес-тренер. Помогу подобрать упражнения, составлю программу тренировок и буду мотивировать вас на пути к результатам. Чем могу помочь?",
      timestamp: new Date(),
    },
  ],
};

export function AIChat() {
  const [activeTab, setActiveTab] = useState("assistant");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMessage],
    }));

    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getSimulatedResponse(activeTab, inputValue),
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], aiMessage],
      }));
    }, 1000);
  };

  const getSimulatedResponse = (tab: string, question: string): string => {
    const responses: Record<string, string[]> = {
      assistant: [
        "Конечно! Я могу помочь вам с записью на любую процедуру. Какая процедура вас интересует?",
        "Отличный вопрос! Рекомендую обратить внимание на LPG-массаж - он отлично подходит для коррекции фигуры.",
        "Я с удовольствием помогу! Могу предложить несколько вариантов времени для вашего визита.",
      ],
      nutrition: [
        "Для достижения лучших результатов рекомендую сбалансированное питание с акцентом на белки и клетчатку. Хотите получить индивидуальный план?",
        "Отличный вопрос! Рекомендую начать день с полноценного завтрака - овсянка с ягодами и орехами будет идеальным вариантом.",
        "Важно помнить о водном балансе - минимум 1.5-2 литра чистой воды в день. Это ускорит метаболизм и улучшит состояние кожи.",
      ],
      fitness: [
        "Отличная идея! Рекомендую начать с кардио 3 раза в неделю по 30 минут. Постепенно увеличивайте нагрузку.",
        "Для вашей цели идеально подойдут силовые тренировки 2-3 раза в неделю. Хотите персональную программу?",
        "Важно помнить о разминке и растяжке - это предотвратит травмы и улучшит результаты тренировок.",
      ],
    };

    const tabResponses = responses[tab] || responses.assistant;
    return tabResponses[Math.floor(Math.random() * tabResponses.length)];
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "assistant":
        return Bot;
      case "nutrition":
        return Salad;
      case "fitness":
        return Dumbbell;
      default:
        return Bot;
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case "assistant":
        return "text-blue-600";
      case "nutrition":
        return "text-emerald-600";
      case "fitness":
        return "text-purple-600";
      default:
        return "text-neutral-600";
    }
  };

  const currentMessages = messages[activeTab] || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl text-neutral-900 mb-2">
            AI Консультанты
          </h1>
          <p className="text-neutral-600">
            Получите персональные рекомендации
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            {/* Tabs Header */}
            <Tabs.List className="flex border-b border-neutral-200">
              <Tabs.Trigger
                value="assistant"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">AI Ассистент</span>
                <span className="sm:hidden">AI</span>
              </Tabs.Trigger>

              <Tabs.Trigger
                value="nutrition"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 transition-colors"
              >
                <Salad className="w-4 h-4" />
                <span className="hidden sm:inline">Диетолог</span>
                <span className="sm:hidden">Питание</span>
              </Tabs.Trigger>

              <Tabs.Trigger
                value="fitness"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 transition-colors"
              >
                <Dumbbell className="w-4 h-4" />
                <span className="hidden sm:inline">Тренер</span>
                <span className="sm:hidden">Фитнес</span>
              </Tabs.Trigger>
            </Tabs.List>

            {/* Chat Content */}
            <Tabs.Content value={activeTab} className="focus:outline-none">
              {/* Messages Area */}
              <div className="h-[calc(100vh-400px)] lg:h-[500px] overflow-y-auto p-4 lg:p-6">
                <div className="space-y-4">
                  {currentMessages.map((message) => {
                    const Icon = message.role === "assistant" ? getTabIcon(activeTab) : User;
                    const iconColor = message.role === "assistant" ? getTabColor(activeTab) : "text-neutral-600";

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === "assistant"
                              ? "bg-neutral-100"
                              : "bg-neutral-900"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              message.role === "assistant" ? iconColor : "text-white"
                            }`}
                          />
                        </div>

                        <div
                          className={`flex-1 max-w-[80%] ${
                            message.role === "user" ? "text-right" : ""
                          }`}
                        >
                          <div
                            className={`inline-block rounded-2xl px-4 py-3 ${
                              message.role === "assistant"
                                ? "bg-neutral-100 text-neutral-900"
                                : "bg-neutral-900 text-white"
                            }`}
                          >
                            {message.content}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 px-1">
                            {message.timestamp.toLocaleTimeString("ru-RU", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-neutral-200 p-4 lg:p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Напишите сообщение..."
                    className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="px-5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-900 mb-1">
                <strong>Совет:</strong> AI-консультанты доступны 24/7
              </p>
              <p className="text-xs text-neutral-600">
                Получайте персональные рекомендации по питанию, тренировкам и процедурам в любое время
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
