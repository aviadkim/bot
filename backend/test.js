require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function testChat() {
  try {
    console.log('1. Testing with API key prefix:', process.env.OPENAI_API_KEY.substring(0, 5));
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello in Hebrew' }
      ],
      temperature: 0.7,
      max_tokens: 50
    });
    
    console.log('2. Response:', completion.data.choices[0].message.content);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

console.log('Starting test...');
testChat();
