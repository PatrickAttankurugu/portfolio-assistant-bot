// Main conversation chain setup
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ConversationChain } = require('langchain/chains');
const { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } = require('langchain/prompts');
const { getConversationMemory } = require('./memory');
const { createPortfolioRetriever } = require('./retriever');
const { SYSTEM_TEMPLATE, HUMAN_TEMPLATE } = require('./prompts');
const config = require('../config/config');
const logger = require('../utils/logger');

async function createConversationChain(sessionId) {
  try {
    // Initialize Google Generative AI
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: 'gemini-pro',
      maxOutputTokens: 1024,
      temperature: 0.2,
    });
    
    // Create memory for this conversation
    const memory = getConversationMemory(sessionId);
    
    // Create retriever to fetch relevant portfolio information
    const retriever = await createPortfolioRetriever();
    
    // Create chat prompt template
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate(HUMAN_TEMPLATE)
    ]);
    
    // Create the conversation chain
    const chain = new ConversationChain({
      llm: model,
      memory: memory,
      prompt: chatPrompt,
      verbose: process.env.NODE_ENV === 'development'
    });
    
    // Add custom method to handle retrieval-augmented queries
    chain.call = async ({ input, sessionId }) => {
      // Retrieve relevant documents
      const relevantDocs = await retriever.getRelevantDocuments(input);
      
      // Extract the text from the documents
      const context = relevantDocs
        .map(doc => doc.pageContent)
        .join('\n\n');
      
      logger.info(`Retrieved ${relevantDocs.length} relevant documents for query`);
      
      // Call the chain with the context
      const response = await chain.call({
        input: input,
        context: context || "No specific portfolio information found for this query."
      });
      
      return response;
    };
    
    return chain;
  } catch (error) {
    logger.error('Error creating conversation chain:', error);
    throw error;
  }
}

module.exports = { createConversationChain };