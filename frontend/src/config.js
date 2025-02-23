const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://customer-service-chatbot-production.up.railway.app',
  environment: process.env.NODE_ENV || 'development'
};

export default config;