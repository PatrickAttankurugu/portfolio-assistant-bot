// Tests for conversation flows
require('dotenv').config();
const { createConversationChain } = require('../langchain/chain');
const logger = require('../utils/logger');

async function testConversationFlow() {
  try {
    logger.info('Testing conversation flow...');
    
    // Create a conversation chain
    const chain = await createConversationChain('test_session');
    
    // Define a conversation flow to test
    const conversation = [
      "Tell me about Patrick's background",
      "What are his skills in AI?",
      "What projects has he worked on?",
      "Is he looking for remote work?",
      "What is his experience with LLMs?"
    ];
    
    // Process each message in sequence
    for (const message of conversation) {
      logger.info(`User: ${message}`);
      
      const response = await chain.call({ 
        input: message,
        sessionId: 'test_session'
      });
      
      logger.info(`Assistant: ${response.response || response.text}`);
      logger.info('-------------------');
    }
    
    logger.info('Conversation flow test completed successfully!');
  } catch (error) {
    logger.error('Error testing conversation flow:', error);
  }
}

// Run the test
testConversationFlow().then(() => {
  logger.info('All conversation tests complete');
  process.exit(0);
}).catch(error => {
  logger.error('Test execution failed:', error);
  process.exit(1);
});