// Vector store retrieval setup
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const config = require('../config/config');
const logger = require('../utils/logger');

async function createPortfolioRetriever() {
  try {
    // If we already have a global vector store, use it
    if (global.vectorStore) {
      logger.info('Using existing in-memory vector store for retrieval');
      
      // Create retriever
      const retriever = global.vectorStore.asRetriever({
        k: config.MAX_RETRIEVAL_RESULTS, // Number of documents to retrieve
      });
      
      return retriever;
    }
    
    // If no vector store exists, return a dummy retriever
    logger.warn('No vector store available. Vector DB initialization may not have completed.');
    return {
      getRelevantDocuments: async (query) => {
        logger.warn(`No vector store available. Unable to perform search for: ${query}`);
        return [];
      }
    };
  } catch (error) {
    logger.error('Error creating portfolio retriever:', error);
    // Return a simple retriever that returns no documents
    return {
      getRelevantDocuments: async () => {
        logger.warn('Using fallback empty retriever due to error');
        return [];
      }
    };
  }
}

module.exports = { createPortfolioRetriever };