// Tests for vector retrieval
require('dotenv').config();
const { searchSimilarDocuments } = require('../vector_db/utils');
const { generateEmbeddings } = require('../vector_db/embeddings');
const logger = require('../utils/logger');

async function testVectorRetrieval() {
  try {
    logger.info('Testing vector retrieval...');
    
    // Test queries for different categories
    const testQueries = {
      skills: [
        "What are Patrick's technical skills?",
        "What programming languages does Patrick know?",
        "What is Patrick's experience with computer vision?",
        "Does Patrick know how to use TensorFlow?",
        "What ML frameworks is Patrick familiar with?"
      ],
      
      experience: [
        "What is Patrick's work experience?",
        "Where does Patrick currently work?",
        "What did Patrick do at Ghana Digital Centres?",
        "How many years of experience does Patrick have?",
        "What role does Patrick have at Agregar Tech?"
      ],
      
      projects: [
        "What projects has Patrick worked on?",
        "Tell me about Patrick's deepfake detection system",
        "Has Patrick built any security systems?",
        "What was Patrick's final year project?",
        "Has Patrick worked on any identity verification projects?"
      ],
      
      education: [
        "What is Patrick's educational background?",
        "Where did Patrick study?",
        "What degree does Patrick have?",
        "What additional certifications does Patrick have?",
        "Did Patrick study computer science?"
      ]
    };
    
    // Test vector embeddings
    logger.info('Testing embedding generation...');
    const sampleText = "Patrick is an AI engineer with experience in computer vision and deep learning";
    const embedding = await generateEmbeddings(sampleText);
    logger.info(`Generated embedding with ${embedding.length} dimensions`);
    
    // Test retrieval for each category
    for (const [category, queries] of Object.entries(testQueries)) {
      logger.info(`\nTesting ${category} queries...`);
      
      for (const query of queries) {
        logger.info(`\nQuery: "${query}"`);
        
        const results = await searchSimilarDocuments(query, 2);
        
        if (results.length === 0) {
          logger.warn('No results found for this query');
          continue;
        }
        
        logger.info(`Found ${results.length} relevant documents:`);
        
        for (const doc of results) {
          logger.info(`- Source: ${doc.metadata?.source || 'unknown'}`);
          logger.info(`  Snippet: ${doc.pageContent.substring(0, 100)}...`);
          
          // Check if the result is from the expected category
          const source = doc.metadata?.source || '';
          const isFromCategory = source.toLowerCase().includes(category.toLowerCase());
          
          if (isFromCategory) {
            logger.info('  ✅ Result is from expected category');
          } else {
            logger.info('  ⚠️ Result is NOT from expected category');
          }
        }
      }
    }
    
    logger.info('\nVector retrieval tests completed successfully!');
  } catch (error) {
    logger.error('Error testing vector retrieval:', error);
    throw error;
  }
}

// Run the test
testVectorRetrieval().then(() => {
  logger.info('All retrieval tests complete');
  process.exit(0);
}).catch(error => {
  logger.error('Test execution failed:', error);
  process.exit(1);
});