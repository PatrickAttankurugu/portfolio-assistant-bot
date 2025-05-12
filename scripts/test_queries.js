// Script to test retrieval with sample queries
require('dotenv').config();
const { searchSimilarDocuments } = require('../vector_db/utils');
const logger = require('../utils/logger');

const TEST_QUERIES = [
  "What are Patrick's skills?",
  "What experience does Patrick have with machine learning?",
  "Tell me about Patrick's work at Agregar Tech",
  "What projects has Patrick worked on?",
  "What is Patrick's educational background?",
  "What is Patrick's experience with LLMs?",
  "Is Patrick available for remote work?"
];

async function testQueries() {
  try {
    logger.info('Starting retrieval tests with sample queries...');
    
    for (const query of TEST_QUERIES) {
      logger.info(`Testing query: "${query}"`);
      
      const results = await searchSimilarDocuments(query, 3);
      
      logger.info(`Found ${results.length} relevant documents:`);
      
      for (const doc of results) {
        logger.info(`- Source: ${doc.metadata.source}`);
        logger.info(`  Snippet: ${doc.pageContent.substring(0, 100)}...`);
      }
      
      logger.info('-------------------');
    }
    
    logger.info('Query testing completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error testing queries:', error);
    process.exit(1);
  }
}

// Run tests
testQueries();