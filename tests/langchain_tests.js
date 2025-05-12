// Tests for LangChain implementation
require('dotenv').config();
const { createConversationChain } = require('../langchain/chain');
const { getConversationMemory, clearMemory } = require('../langchain/memory');
const { createPortfolioRetriever } = require('../langchain/retriever');
const logger = require('../utils/logger');

async function testLangChainComponents() {
  try {
    logger.info('Testing LangChain components...');
    
    // Test 1: Test memory
    logger.info('Testing conversation memory...');
    const memory = getConversationMemory('test_session');
    
    await memory.saveContext(
      { input: "What is Patrick's background?" },
      { response: "Patrick is an AI/ML Engineer with 4+ years of experience specializing in Computer Vision and Deep Learning." }
    );
    
    const memoryVariables = await memory.loadMemoryVariables({});
    logger.info('Memory variables:', memoryVariables);
    
    // Clear memory
    clearMemory('test_session');
    logger.info('Memory cleared');
    
    // Test 2: Test retriever
    logger.info('Testing portfolio retriever...');
    const retriever = await createPortfolioRetriever();
    
    const results = await retriever.getRelevantDocuments("What are Patrick's skills in AI?");
    logger.info(`Retrieved ${results.length} documents`);
    
    // Log a snippet of each result
    results.forEach((doc, i) => {
      logger.info(`Result ${i+1} (source: ${doc.metadata?.source || 'unknown'}):`);
      logger.info(doc.pageContent.substring(0, 150) + '...');
    });
    
    // Test 3: Test conversation chain
    logger.info('Testing conversation chain...');
    const chain = await createConversationChain('test_chain');
    
    const response = await chain.call({
      input: "What experience does Patrick have with machine learning?",
      sessionId: 'test_chain'
    });
    
    logger.info('Chain response:', response.response || response.text);
    
    logger.info('LangChain components tests completed successfully!');
  } catch (error) {
    logger.error('Error testing LangChain components:', error);
    throw error;
  }
}

// Run the test
testLangChainComponents().then(() => {
  logger.info('All LangChain tests complete');
  process.exit(0);
}).catch(error => {
  logger.error('Test execution failed:', error);
  process.exit(1);
});