// Configuration settings for the application

module.exports = {
  // Vector database configuration
  COLLECTION_NAME: 'portfolio_knowledge',
  CHROMA_URL: process.env.CHROMA_URL || 'http://localhost:8000',
  
  // Chunking configuration
  CHUNK_SIZE: 500,
  CHUNK_OVERLAP: 100,
  
  // Retrieval configuration
  MAX_RETRIEVAL_RESULTS: 5,
  
  // WhatsApp configuration
  MAX_MESSAGE_LENGTH: 4096,
  
  // Session configuration
  SESSION_TTL: 3600, // 1 hour in seconds
};
