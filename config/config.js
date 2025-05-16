// Application configuration settings
require('dotenv').config();

module.exports = {
  // Vector database configuration
  COLLECTION_NAME: 'portfolio_knowledge',
  // We're using in-memory vector store, so no URL is needed
  
  // Chunking configuration
  CHUNK_SIZE: 500,
  CHUNK_OVERLAP: 100,
  
  // Retrieval configuration
  MAX_RETRIEVAL_RESULTS: 5,
  
  // WhatsApp configuration
  MAX_MESSAGE_LENGTH: 4096,
  
  // Session configuration
  SESSION_TTL: 3600, // 1 hour in seconds
  
  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Application mode
  NODE_ENV: process.env.NODE_ENV || 'development',
};