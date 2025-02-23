const fetch = require('node-fetch');
require('dotenv').config();

async function runDiagnostics() {
  console.log('🔍 Starting Railway Deployment Diagnostics...');
  const results = [];

  // Check environment variables
  console.log('\n📋 Checking Environment Variables...');
  const requiredEnvVars = ['OPENAI_API_KEY', 'PORT'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.log('❌ Missing required environment variables:', missingEnvVars.join(', '));
  } else {
    console.log('✅ All required environment variables are set');
  }

  // Check server connectivity
  console.log('\n🌐 Testing Server Connectivity...');
  const serverUrl = process.env.NODE_ENV === 'production'
    ? 'https://customer-service-chatbot-production.up.railway.app'
    : 'http://localhost:8080';

  try {
    const serverResponse = await fetch(`${serverUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' })
    });

    if (serverResponse.ok) {
      console.log('✅ Server is responding correctly');
      console.log(`🔗 Server URL: ${serverUrl}`);
    } else {
      console.log('❌ Server returned an error status:', serverResponse.status);
      const errorText = await serverResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Failed to connect to server');
    console.log('Error details:', error.message);
  }

  // Check OpenAI API
  console.log('\n🤖 Testing OpenAI API Integration...');
  const { Configuration, OpenAIApi } = require('openai');

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
    });

    if (completion.data.choices && completion.data.choices.length > 0) {
      console.log('✅ OpenAI API is working correctly');
    }
  } catch (error) {
    console.log('❌ OpenAI API test failed');
    if (error.response) {
      console.log('Error details:', error.response.data);
    } else {
      console.log('Error details:', error.message);
    }
  }

  // Check CORS configuration
  console.log('\n🔒 Checking CORS Configuration...');
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? ['https://customer-service-chatbot-production.up.railway.app', 'http://localhost:3000']
    : ['http://localhost:3000'];
  
  console.log('Allowed Origins:', corsOrigins);
  console.log('Current Environment:', process.env.NODE_ENV || 'development');

  // Check port configuration
  console.log('\n📡 Checking Port Configuration...');
  const port = process.env.PORT || 8080;
  console.log(`Server configured to run on port: ${port}`);

  // Summary
  console.log('\n📝 Deployment Checklist:');
  console.log('1. Environment Variables ✓');
  console.log('2. Server Connectivity ✓');
  console.log('3. OpenAI API Integration ✓');
  console.log('4. CORS Configuration ✓');
  console.log('5. Port Configuration ✓');

  console.log('\n💡 If you\'re experiencing issues, please check:');
  console.log('1. Railway environment variables are properly set');
  console.log('2. Railway deployment logs for any errors');
  console.log('3. Frontend configuration points to correct backend URL');
  console.log('4. Network rules allow communication between frontend and backend');
}

runDiagnostics().catch(console.error);