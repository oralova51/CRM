import React, { useState, useEffect } from 'react'
import AiApi from '../../api/AiApi'
import './Chat.css'
import { Send } from 'lucide-react'

const WELCOME_MESSAGE = 'Здравствуйте! Я виртуальный ассистент Студии идеального тела. Подскажу по процедурам, ценам и помогу записаться. Чем я могу быть полезна?'

type ChatMessage = {
    content: string
    role: 'assistant' | 'user'
}

export default function Chat() {
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
        setMessages([{ content: WELCOME_MESSAGE, role: 'assistant' }])
    }, [])

    const handleSend = async () => {
        if (!message.trim()) return;
        const response = await AiApi.createChat({ message });
        console.log(response);
        setMessage(''); // очистить поле после отправки
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
                            {msg.content}
                        </div>
                    ))}
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
