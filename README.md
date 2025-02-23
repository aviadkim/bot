# Customer Service Chatbot

## Preview
[![Preview](https://img.shields.io/badge/Preview-View%20Site-blue)](https://generous-curiosity-production.up.railway.app)

## Environment Setup

### Development
1. Create a `.env` file in the `backend` directory with your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

### Production (Railway)
1. Set the `OPENAI_API_KEY` environment variable in your Railway project settings.
2. The application will automatically use the environment variables configured in Railway.

## Running the Application

### Local Development
```bash
npm install
npm run dev
```

### Production
The application is configured to deploy automatically on Railway using the settings in `railway.toml`.

## Production URL
https://generous-curiosity-production.up.railway.app

## Features
- Real-time chat interface
- OpenAI GPT-3.5 Turbo integration
- Hebrew language support
- Professional customer service responses