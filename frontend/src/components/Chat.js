import React, { useState } from 'react';
import config from '../config';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);

  const runDebugCheck = async () => {
    setIsDebugging(true);
    setDebugInfo(null);
    const debugResults = [];

    try {
      // Check backend connectivity
      debugResults.push('בודק חיבור לשרת...');
      const serverCheck = await fetch(`${config.apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' }),
      });

      if (!serverCheck.ok) {
        throw new Error(`Server connection failed: ${serverCheck.status}`);
      }
      debugResults.push('✅ חיבור לשרת תקין');

      // Test OpenAI API
      const apiResponse = await serverCheck.json();
      if (apiResponse.message) {
        debugResults.push('✅ OpenAI API מחובר ופועל');
      } else {
        debugResults.push('❌ בעיה בתגובת OpenAI API');
      }

      // Check environment variables
      debugResults.push(`🔍 כתובת שרת: ${config.apiUrl}`);
      
    } catch (error) {
      console.error('Debug Error:', error);
      debugResults.push(`❌ שגיאה: ${error.message}`);
      debugResults.push('הצעות לפתרון:');
      debugResults.push('1. ודא שמפתח ה-API של OpenAI מוגדר ב-Railway');
      debugResults.push('2. ודא שהשרת פועל ומקבל בקשות');
      debugResults.push('3. בדוק את הגדרות ה-CORS בשרת');
    } finally {
      setDebugInfo(debugResults.join('\n'));
      setIsDebugging(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError('שגיאה בשליחת ההודעה. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <strong>{msg.role === 'user' ? 'אתה' : 'נציג שירות'}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="loading-indicator">נציג השירות מקליד...</div>
          </div>
        )}
        {error && (
          <div className="error-message">{error}</div>
        )}
        {debugInfo && (
          <div className="debug-info" style={{
            margin: '10px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            whiteSpace: 'pre-line',
            textAlign: 'left',
            direction: 'ltr'
          }}>
            {debugInfo}
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          className="message-input"
          placeholder="הקלד את הודעתך כאן..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && input.trim() && sendMessage()}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          שלח
        </button>
        <button 
          onClick={runDebugCheck}
          disabled={isDebugging}
          className="debug-button"
        >
          {isDebugging ? 'בודק...' : 'בדיקת מערכת'}
        </button>
      </div>
    </div>
  );
}

export default Chat;