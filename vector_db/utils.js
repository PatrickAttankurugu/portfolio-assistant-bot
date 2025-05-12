// Vector database utility functions
const { createEmbeddingsModel } = require('./embeddings');
const logger = require('../utils/logger');

// Get vector store client
async function getVectorStore() {
  try {
    // Use the global vector store if available
    if (global.vectorStore) {
      return global.vectorStore;
    }
    
    logger.error('Vector store not initialized');
    throw new Error('Vector store not initialized. Run setup first.');
  } catch (error) {
    logger.error('Error getting vector store:', error);
    throw error;
  }
}

// Search for similar documents
async function searchSimilarDocuments(query, k = 5) {
  try {
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(query, k);
    return results;
  } catch (error) {
    logger.error('Error searching similar documents:', error);
    return [];
  }
}

// Add document to vector store
async function addDocumentToVectorStore(document) {
  try {
    const vectorStore = await getVectorStore();
    await vectorStore.addDocuments([document]);
    logger.info('Document added to vector store');
    return true;
  } catch (error) {
    logger.error('Error adding document to vector store:', error);
    return false;
  }
}

module.exports = {
  getVectorStore,
  searchSimilarDocuments,
  addDocumentToVectorStore
};