const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://generous-curiosity-production.up.railway.app'
    : 'http://localhost:8080',
  environment: process.env.NODE_ENV || 'development'
};

export default config;