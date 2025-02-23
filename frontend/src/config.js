const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://generous-curiosity-production.up.railway.app'
    : 'http://localhost:8080',
  wsUrl: process.env.NODE_ENV === 'production'
    ? 'wss://generous-curiosity-production.up.railway.app'
    : 'ws://localhost:8080'
};

export default config;