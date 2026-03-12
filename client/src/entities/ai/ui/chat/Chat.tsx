import React, { useState, useRef } from 'react'
import AiApi from '../../api/AiApi'
import './Chat.css'
import { Send, CheckCheck, Bot, User, Sparkles } from 'lucide-react'

const WELCOME_MESSAGE = 'Здравствуйте! Я виртуальный ассистент Студии идеального тела. Подскажу по процедурам, ценам и помогу записаться. Чем я могу быть полезна?'

type ChatMessage = {
    content: string
    role: 'assistant' | 'user'
}

export default function Chat() {
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<ChatMessage[]>([
        { content: WELCOME_MESSAGE, role: 'assistant' },
    ])
    const [writing, setWriting] = useState<boolean>(false)
    const requestCompletedRef = useRef(false)

    const handleSend = async () => {
        if (!message.trim()) return;
        const userMessage = message.trim();
        setMessages((prev) => [...prev, { content: userMessage, role: 'user' }]);
        setMessage('');
        requestCompletedRef.current = false;
        setTimeout(() => {
            if (!requestCompletedRef.current) setWriting(true);
        }, 0);
        try {
            const response = await AiApi.createChat({ message: userMessage });
            if (response?.data?.content) {
                setMessages((prev) => [...prev, { content: response.data.content, role: 'assistant' }]);
            }
        } finally {
            requestCompletedRef.current = true;
            setWriting(false);
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                {/* Шапка чата */}
                <div className="chat-header">
                    <div className="chat-header-content">
                        <div className="chat-header-icon">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="chat-header-title">AI-ассистент</h2>
                            <p className="chat-header-subtitle">Всегда рядом, чтобы помочь</p>
                        </div>
                    </div>
                </div>

                {/* Сообщения */}
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message chat-message--${msg.role}`}
                        >
                            <div className="chat-message-avatar">
                                {msg.role === 'assistant' ? (
                                    <div className="chat-message-avatar-bot">
                                        <Bot size={16} />
                                    </div>
                                ) : (
                                    <div className="chat-message-avatar-user">
                                        <User size={14} />
                                    </div>
                                )}
                            </div>
                            <div className="chat-message-content">
                                <div className="chat-message-bubble">
                                    <span className="chat-message__text">{msg.content}</span>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="chat-message-status">
                                        <CheckCheck size={14} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {writing && (
                        <div className="chat-message chat-message--assistant">
                            <div className="chat-message-avatar">
                                <div className="chat-message-avatar-bot">
                                    <Bot size={16} />
                                </div>
                            </div>
                            <div className="chat-message-content">
                                <div className="chat-message-bubble chat-typing">
                                    <span className="chat-typing__dots">
                                        <span className="chat-typing__dot" />
                                        <span className="chat-typing__dot" />
                                        <span className="chat-typing__dot" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Поле ввода */}
                <div className="chat-input-container">
                    <input
                        type="text"
                        placeholder="Напишите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="chat-input"
                    />
                    <button 
                        onClick={handleSend} 
                        className={`chat-button ${!message.trim() ? 'chat-button-disabled' : ''}`}
                        disabled={!message.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Подпись */}
                <p className="chat-disclaimer">
                    AI-ассистент может ошибаться. Для точной информации обратитесь к администратору.
                </p>
            </div>
        </div>
    )
}