import React, { useState } from 'react';
import config from './config';
import './Chat.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      debugResults.push('🔍 בודק חיבור לשרת...');
      const serverCheck = await fetch(`${config.apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!serverCheck.ok) {
        throw new Error(`Server responded with status: ${serverCheck.status}`);
      }
      debugResults.push('✅ חיבור לשרת תקין');

      const apiResponse = await serverCheck.json();
      if (apiResponse.message) {
        debugResults.push('✅ OpenAI API מחובר ופועל');
      } else if (apiResponse.error) {
        debugResults.push('❌ שגיאה בתגובת OpenAI API');
        debugResults.push(`פירוט: ${apiResponse.error}`);
      }

      debugResults.push('\nמידע סביבה:');
      debugResults.push(`🌐 כתובת שרת: ${config.apiUrl}`);
      debugResults.push(`🔧 מצב: ${process.env.NODE_ENV || 'development'}`);

    } catch (error) {
      console.error('Debug Error:', error);
      if (error.name === 'AbortError') {
        debugResults.push('❌ תם הזמן המוקצב לבדיקה - השרת לא מגיב');
      } else {
        debugResults.push(`❌ שגיאה: ${error.message}`);
      }
      
      debugResults.push('\nצעדים מומלצים לפתרון:');
      debugResults.push('1. ודא שהשרת פועל על הפורט הנכון');
      debugResults.push('2. בדוק את קובץ .env עבור OPENAI_API_KEY');
      debugResults.push('3. נסה לרענן את הדף');
      debugResults.push('4. בדוק את ה-console של הדפדפן לשגיאות נוספות');
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${config.apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`שגיאת שרת: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.name === 'AbortError' 
        ? 'התקשורת נכשלה - בדוק את החיבור שלך לאינטרנט'
        : `שגיאה בשליחת ההודעה: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
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
          <div className="debug-info">{debugInfo}</div>
        )}
      </div>
      <div className="input-container">
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          שלח
        </button>
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
