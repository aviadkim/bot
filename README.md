# Customer Service Chatbot

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

### Development
1. Install dependencies:
```bash
npm run install-all
```

2. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

### Production
The application is configured to deploy automatically on Railway using the settings in `railway.toml`.

## Features
- Real-time chat interface
- OpenAI GPT-3.5 Turbo integration
- Hebrew language support
- Professional customer service responses