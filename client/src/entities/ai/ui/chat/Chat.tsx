import React, { useState, useRef } from 'react'
import AiApi from '../../api/AiApi'
import './Chat.css'
import { Send, CheckCheck } from 'lucide-react'

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
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message chat-message--${msg.role}`}
                        >
                            <span className="chat-message__text">{msg.content}</span>
                            {msg.role === 'user' && (
                                <CheckCheck className="chat-message__status" size={16} />
                            )}
                        </div>
                    ))}
                    {writing && (
                        <div className="chat-message chat-message--assistant chat-typing">
                            <span className="chat-typing__dots">
                                <span className="chat-typing__dot" />
                                <span className="chat-typing__dot" />
                                <span className="chat-typing__dot" />
                            </span>
                        </div>
                    )}
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="chat-input"
                    />
                    <button onClick={handleSend} className="chat-button"><Send /></button>
                </div>
            </div>
        </div >)
}
