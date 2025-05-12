// Script to update the knowledge base
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const knowledgeBase = require('../knowledge_base');
const { initializeVectorDB } = require('../vector_db/init_db');
const logger = require('../utils/logger');

async function updateKnowledgeBase() {
  try {
    logger.info('Starting knowledge base update...');
    
    // Option 1: Reinitialize the entire vector database
    await initializeVectorDB();
    logger.info('Knowledge base updated by reinitializing the vector database');
    
    // Option 2: Update specific documents (commented out, use if needed)
    /*
    const documents = await knowledgeBase.getDocuments();
    
    for (const filename of documents) {
      const filePath = path.join(__dirname, '../knowledge_base/data', filename);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Update document in vector store
      await knowledgeBase.updateDocument(filename, content);
      logger.info(`Updated document: ${filename}`);
    }
    */
    
    logger.info('Knowledge base update completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error updating knowledge base:', error);
    process.exit(1);
  }
}

// Run update
updateKnowledgeBase();