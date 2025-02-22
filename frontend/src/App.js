import React from 'react';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <div className="App" dir="rtl">
      <header className="App-header">
        <h1>מוקד שירות מובנה גלובל</h1>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
}

export default App;