// Conversation memory implementation
const { ConversationSummaryMemory } = require('langchain/memory');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const logger = require('../utils/logger');

// In-memory storage for simplicity
const memoryStore = new Map();

function getConversationMemory(sessionId) {
  // Check if memory already exists for this session
  if (memoryStore.has(sessionId)) {
    return memoryStore.get(sessionId);
  }
  
  // Create a new memory instance
  try {
    const memory = new ConversationSummaryMemory({
      memoryKey: "chat_history",
      llm: new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: 'gemini-pro',
        maxOutputTokens: 256,
        temperature: 0.2,
      }),
      returnMessages: true,
      inputKey: "input", // The key for the input message
      outputKey: "response", // The key for the output message
    });
    
    // Store in memory store
    memoryStore.set(sessionId, memory);
    logger.info(`Created new memory for session: ${sessionId}`);
    
    return memory;
  } catch (error) {
    logger.error(`Error creating memory for session ${sessionId}:`, error);
    // Fallback to a simpler memory if needed
    const simpleMemory = { chatHistory: [], saveContext: () => {}, loadMemoryVariables: () => ({ chat_history: [] }) };
    memoryStore.set(sessionId, simpleMemory);
    return simpleMemory;
  }
}

// Clear memory for a session
function clearMemory(sessionId) {
  if (memoryStore.has(sessionId)) {
    memoryStore.delete(sessionId);
    logger.info(`Cleared memory for session: ${sessionId}`);
    return true;
  }
  return false;
}

module.exports = {
  getConversationMemory,
  clearMemory
};