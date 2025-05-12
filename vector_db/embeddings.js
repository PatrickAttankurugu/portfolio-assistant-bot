// Embedding generation functions
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const logger = require('../utils/logger');

// Create embeddings model
function createEmbeddingsModel() {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "embedding-001",
    });
    
    return embeddings;
  } catch (error) {
    logger.error('Error creating embeddings model:', error);
    throw error;
  }
}

// Generate embeddings for a text
async function generateEmbeddings(text) {
  try {
    const embeddings = createEmbeddingsModel();
    const result = await embeddings.embedQuery(text);
    return result;
  } catch (error) {
    logger.error('Error generating embeddings:', error);
    throw error;
  }
}

module.exports = {
  createEmbeddingsModel,
  generateEmbeddings
};