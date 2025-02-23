require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
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
  console.error('OpenAI API key is missing. Please set OPENAI_API_KEY in .env file');
  process.exit(1);
}

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// The "catchall" handler for any request that doesn't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Try different ports if default is in use
const tryPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .on('listening', () => {
        console.log(`Server started successfully on port ${port}`);
        resolve(server);
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}`);
          server.close();
          resolve(tryPort(port + 1));
        } else {
          reject(err);
        }
      });
  });
};

// Start server with port fallback
const PORT = process.env.PORT || 5001;
let server = null;

tryPort(PORT).then(serverInstance => {
  server = serverInstance;
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shutting down');
  });
});