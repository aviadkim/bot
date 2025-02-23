const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://customer-service-chatbot-production.up.railway.app'
    : 'http://localhost:8080'
};

export default config;