// Vector database initialization
const { HNSWLib } = require('@langchain/hnswlib'); 
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { loadPortfolioDocuments } = require('../knowledge_base/processors/loader');
const { DocumentProcessor } = require('../knowledge_base/processors/chunker');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const logger = require('../utils/logger');

// Directory for storing the vector DB
const VECTOR_STORE_DIR = path.join(__dirname, '../vector_store_data');

async function initializeVectorDB() {
  try {
    logger.info('Starting vector database initialization...');
    
    // Initialize embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "embedding-001",
    });
    
    // Load documents
    const documents = await loadPortfolioDocuments();
    logger.info(`Loaded ${documents.length} documents`);
    
    // Process documents (splitting into chunks)
    const documentProcessor = new DocumentProcessor();
    const chunks = await documentProcessor.processDocuments(documents);
    logger.info(`Created ${chunks.length} chunks from documents`);
    
    // Ensure the directory exists
    if (!fs.existsSync(VECTOR_STORE_DIR)) {
      fs.mkdirSync(VECTOR_STORE_DIR, { recursive: true });
    }
    
    // Create new vector store with chunks
    const vectorStore = await HNSWLib.fromDocuments(
      chunks,
      embeddings,
      {
        space: 'cosine',
        numDimensions: 768, // Standard for many embedding models
      }
    );
    
    // Save the vector store to disk
    await vectorStore.save(VECTOR_STORE_DIR);
    
    logger.info(`Vector database initialized successfully with ${chunks.length} entries`);
    
    // Store the vector store in a global variable for later use
    global.vectorStore = vectorStore;
    
    return vectorStore;
  } catch (error) {
    logger.error('Error initializing vector database:', error);
    throw error;
  }
}

module.exports = { initializeVectorDB };