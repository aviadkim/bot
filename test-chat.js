import fetch from 'node-fetch';

async function testChat(message) {
  try {
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    console.log('Bot response:', data.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run tests sequentially
(async () => {
  console.log('Testing English message...');
  await testChat('Hello, can you help me with customer service?');
  
  console.log('\nTesting Hebrew message...');
  await testChat('שלום, אני צריך עזרה בנושא שירות לקוחות');
})();