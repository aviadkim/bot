import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import './App.css';

function App() {
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Test backend connection
        const response = await fetch('/health');
        if (!response.ok) throw new Error('Backend connection failed');
        setInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Could not connect to server');
      }
    };
    init();
  }, []);

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!initialized) {
    return <div className="loading-container">טוען...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>מוקד שירות גלובל</h1>
      </header>
      <main className="App-main">
        <Chat />
      </main>
    </div>
  );
}

export default App;