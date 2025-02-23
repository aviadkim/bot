require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();

// Enhanced logging middleware - update to log more details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL
  });
  next();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ extended: true }));

// Add content type middleware
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Accept-Charset', 'utf-8');
  next();
});

// OpenAI Configuration with validation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Environment variables available:', Object.keys(process.env));
  process.exit(1);
}

// Log successful API key loading
console.log('OpenAI API key loaded successfully');

const openai = new OpenAIApi(configuration);

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Making OpenAI API call...');
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `אתה נציג שירות לקוחות מקצועי בחברת טכנולוגיה ישראלית. 
          פרטי התקשורת הם:
          - אימייל: support@companynamesupport.com
          - טלפון: 02-1234567
          - שעות פעילות: ימים א'-ה' 9:00-17:00
          
          אנא ספק מענה מדויק, מקצועי ומכוון מטרה. השתדל לתת תשובות מלאות אך תמציתיות בעברית תקנית.`
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    console.log('OpenAI response received');
    const botMessage = completion.data.choices[0].message.content;
    console.log('Bot response:', botMessage);
    
    const response = {
      message: botMessage,
      timestamp: new Date().toISOString()
    };

    // Ensure proper JSON encoding
    return res.status(200)
      .send(JSON.stringify(response, null, 2));

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    return res.status(500).json({
      error: error.message || 'An error occurred while processing your request'
    });
  }
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Remove previous static file handling
app.use(express.static(path.join(__dirname, 'public')));

// Add specific handlers for js and css files
app.get('*.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', req.url));
});

app.get('*.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'public', req.url));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simplified server startup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Move graceful shutdown here
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});