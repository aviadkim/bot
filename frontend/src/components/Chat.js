import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { role: 'bot', content: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <strong>{msg.role === 'user' ? 'אתה' : 'נציג שירות'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <button onClick={sendMessage}>שלח</button>
        <input
          type="text"
          value={input}
          placeholder="הקלד את הודעתך כאן..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
      </div>
    </div>
  );
}

export default Chat;