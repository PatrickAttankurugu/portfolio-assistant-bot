const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ChatGoogleGenerativeAI } = require('langchain-google-genai').ChatGoogleGenerativeAI;
const logger = require('../utils/logger');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a Gemini model instance
function createGeminiModel(options = {}) {
  try {
    const defaultOptions = {
      modelName: 'gemini-pro',
      maxOutputTokens: 1024,
      temperature: 0.2,
    };
    
    const modelOptions = { ...defaultOptions, ...options };
    
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      ...modelOptions,
    });
  } catch (error) {
    logger.error('Error creating Gemini model:', error);
    throw error;
  }
}

// Generate text with Gemini directly (without LangChain)
async function generateText(prompt, options = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro', ...options });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    logger.error('Error generating text with Gemini:', error);
    throw error;
  }
}

// Generate chat completion
async function generateChatCompletion(messages, options = {}) {
  try {
    const model = createGeminiModel(options);
    const result = await model.call(messages);
    return result.text;
  } catch (error) {
    logger.error('Error generating chat completion:', error);
    throw error;
  }
}

module.exports = {
  createGeminiModel,
  generateText,
  generateChatCompletion
};