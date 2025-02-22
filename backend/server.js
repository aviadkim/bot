require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });
    const botMessage = completion.data.choices[0].message.content;
    res.json({ message: botMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});