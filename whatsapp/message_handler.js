const { createConversationChain } = require('../langchain/chain');
const { getSessionId, getSessionData, setSessionData } = require('../services/session_service');
const { constants } = require('../config/constants');
const logger = require('../utils/logger');

const INTRO_MESSAGE = constants.GREETING_MESSAGE;
const ERROR_MESSAGE = constants.ERROR_MESSAGE;

// Session storage (in-memory for simplicity)
const sessions = new Map();

// Handle incoming WhatsApp messages
async function handleMessage(client, message) {
  try {
    const sessionId = getSessionId(message.from);
    logger.info(`Received message from ${message.from}: ${message.body}`);
    
    // Check if this is a new conversation
    if (!sessions.has(sessionId)) {
      logger.info(`New session started: ${sessionId}`);
      sessions.set(sessionId, {
        chain: await createConversationChain(sessionId),
        lastActivity: Date.now()
      });
      
      // Send welcome message
      await message.reply(INTRO_MESSAGE);
      
      // If it's just a greeting, don't process further
      if (isGreeting(message.body)) {
        return;
      }
    }
    
    // Update session activity time
    const session = sessions.get(sessionId);
    session.lastActivity = Date.now();
    
    // Process user query
    const userQuery = message.body;
    logger.info(`Processing query from ${sessionId}: ${userQuery}`);
    
    // Show "typing..." indicator
    await simulateTyping(client, message.from);
    
    // Get response from LangChain
    const response = await session.chain.call({ 
      input: userQuery,
      sessionId: sessionId
    });
    
    // Send response back to user
    await message.reply(response.response || response.text);
    logger.info(`Sent response to ${sessionId}`);
    
  } catch (error) {
    logger.error('Error in message handler:', error);
    await message.reply(ERROR_MESSAGE);
  }
}

// Simulate typing indicator
async function simulateTyping(client, chatId) {
  await client.sendPresenceAvailable();
  await client.sendMessage(chatId, '...', { sendSeen: true });
}

// Check if message is just a greeting
function isGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some(greeting => 
    message.toLowerCase().includes(greeting)
  );
}

// Periodically clean up inactive sessions (run every 30 minutes)
setInterval(() => {
  const now = Date.now();
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > sessionTimeout) {
      logger.info(`Cleaning up inactive session: ${sessionId}`);
      sessions.delete(sessionId);
    }
  }
}, 30 * 60 * 1000);

module.exports = { handleMessage };