import React, { useState, useEffect } from 'react'
import AiApi from '../../api/AiApi'
import './Chat.css'
import { Send } from 'lucide-react'

export default function Chat() {
    const [message, setMessage] = useState<string>('');

    const handleSend = async () => {
        if (!message.trim()) return;
        const response = await AiApi.createChat({ message });
        console.log(response);
        setMessage(''); // очистить поле после отправки
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
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
