const config = {
  apiUrl: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production'
    ? 'https://customer-service-chatbot-production.up.railway.app'
    : 'http://localhost:5000'),
  wsUrl: process.env.REACT_APP_WS_URL || (process.env.NODE_ENV === 'production'
    ? 'wss://customer-service-chatbot-production.up.railway.app'
    : 'ws://localhost:5000'),
  debug: process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV !== 'production',
  version: process.env.REACT_APP_VERSION || '1.0.0'
};

export const getApiUrl = () => {
  if (!config.apiUrl) {
    console.error('API URL is not configured');
    return 'http://localhost:5000';
  }
  return config.apiUrl;
};

export const getWsUrl = () => {
  if (!config.wsUrl) {
    console.error('WebSocket URL is not configured');
    return 'ws://localhost:5000';
  }
  return config.wsUrl;
};

export default config;