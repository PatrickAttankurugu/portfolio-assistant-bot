const { createConversationChain } = require('../langchain/chain');
const { getSessionId, getSessionData, setSessionData, clearSession } = require('../services/session_service');
const { constants } = require('../config/constants');
const { splitMessage, formatResponse } = require('./utils');
const logger = require('../utils/logger');

const INTRO_MESSAGE = constants.GREETING_MESSAGE;
const ERROR_MESSAGE = constants.ERROR_MESSAGE;
const FALLBACK_MESSAGE = constants.FALLBACK_MESSAGE;
const COMMANDS = constants.COMMANDS;

// Session storage (in-memory for simplicity)
const sessions = new Map();

/**
 * Handle incoming WhatsApp messages with robust error handling
 * @param {Object} client - WhatsApp Web.js client
 * @param {Object} message - Message object 
 */
async function handleMessage(client, message) {
  // Skip processing if message is undefined or null
  if (!message || !message.body) {
    logger.warn('Received empty or invalid message');
    return;
  }

  let sessionId;
  
  try {
    // Extract session ID and log the incoming message
    sessionId = getSessionId(message.from);
    logger.info(`⬇️ RECEIVED MESSAGE | From: ${message.from} | Body: ${message.body.substring(0, 100)}${message.body.length > 100 ? '...' : ''}`);
    
    // Process commands if present
    if (message.body.startsWith('/')) {
      const commandResult = await processCommand(client, message);
      if (commandResult) {
        logger.info(`Command processed: ${message.body}`);
        return;
      }
    }
    
    // Initialize session if needed
    if (!sessions.has(sessionId)) {
      try {
        logger.info(`Creating new session: ${sessionId}`);
        const chain = await createConversationChain(sessionId);
        sessions.set(sessionId, {
          chain,
          lastActivity: Date.now()
        });
        
        // Send welcome message
        await sendMessage(client, message.from, INTRO_MESSAGE);
        
        // If it's just a greeting, don't process further
        if (isGreeting(message.body)) {
          logger.info(`Greeting detected, skipping further processing: ${message.body}`);
          return;
        }
      } catch (sessionError) {
        logger.error(`Failed to initialize session: ${sessionError.message}`, {
          error: sessionError,
          sessionId
        });
        await sendMessage(client, message.from, ERROR_MESSAGE);
        return;
      }
    }
    
    // Update session activity timestamp
    const session = sessions.get(sessionId);
    session.lastActivity = Date.now();
    
    // Process the user's query
    const userQuery = message.body.trim();
    logger.info(`Processing query | SessionID: ${sessionId} | Query: ${userQuery}`);
    
    try {
      // Send typing indicator
      await sendTypingIndicator(client, message.from);
      
      // Generate response using LangChain
      logger.info(`Generating response with LangChain | SessionID: ${sessionId}`);
      const startTime = Date.now();
      
      const response = await session.chain.call({ 
        input: userQuery,
        sessionId: sessionId
      });
      
      const responseTime = Date.now() - startTime;
      logger.info(`LangChain response generated in ${responseTime}ms | SessionID: ${sessionId}`);
      
      // Format and send the response
      const responseText = formatResponse(response.response || response.text || FALLBACK_MESSAGE);
      
      // Split long messages if needed
      const chunks = splitMessage(responseText);
      logger.info(`Sending response (${chunks.length} chunks) | To: ${message.from}`);
      
      for (const chunk of chunks) {
        await sendMessage(client, message.from, chunk);
      }
      
      logger.info(`✅ Response sent successfully | To: ${message.from} | SessionID: ${sessionId}`);
    } catch (processingError) {
      logger.error(`Error processing query: ${processingError.message}`, { 
        error: processingError,
        query: userQuery,
        sessionId
      });
      
      // Try to send error message
      await sendMessage(client, message.from, ERROR_MESSAGE);
    }
  } catch (globalError) {
    const errorDetails = {
      error: globalError,
      message: globalError.message,
      stack: globalError.stack,
      messageId: message?.id,
      from: message?.from
    };
    
    logger.error(`CRITICAL ERROR in message handler: ${globalError.message}`, errorDetails);
    
    // Try to send error message if we have message.from
    if (message && message.from) {
      try {
        await sendMessage(client, message.from, ERROR_MESSAGE);
      } catch (sendError) {
        logger.error(`Failed to send error message: ${sendError.message}`);
      }
    }
  }
}

/**
 * Process commands (messages starting with /)
 * @param {Object} client - WhatsApp client
 * @param {Object} message - Message object
 * @returns {Boolean} - True if command was processed
 */
async function processCommand(client, message) {
  const command = message.body.split(' ')[0].toLowerCase();
  
  try {
    switch (command) {
      case COMMANDS.HELP:
        await sendMessage(client, message.from, constants.HELP_MESSAGE);
        return true;
        
      case COMMANDS.RESUME:
        const resumeResponse = "Here's a summary of Patrick's resume:\n\nPatrick Attankurugu is an AI/ML Engineer with 4+ years of experience specializing in computer vision, deep learning, and Generative AI. He currently works at Agregar Tech as a Senior AI/ML & Backend Engineer, where he develops AI-driven systems for automated client onboarding and fraud prevention. His technical skills include Python, PyTorch, TensorFlow, OpenCV, and NLP with Transformers.";
        await sendMessage(client, message.from, resumeResponse);
        return true;
        
      case COMMANDS.SKILLS:
        const skillsResponse = "Patrick's key technical skills include:\n• Python (Expert-level, 4+ years)\n• Deep Learning (PyTorch, TensorFlow)\n• Computer Vision (OpenCV)\n• Natural Language Processing\n• Machine Learning & AI Development\n• Cloud Platforms (Azure, AWS)\n• API Development (FastAPI)\n• Data Engineering & Processing";
        await sendMessage(client, message.from, skillsResponse);
        return true;
        
      case COMMANDS.PROJECTS:
        const projectsResponse = "Patrick has worked on several AI projects including:\n• AI-Powered Identity Verification System\n• Deepfake Detection System for Fraud Prevention\n• Predictive Surveillance Platform\n• Automated Background Check System\n• Crowd Monitoring System\n\nFor more details on any project, just ask!";
        await sendMessage(client, message.from, projectsResponse);
        return true;
        
      case COMMANDS.EXPERIENCE:
        const experienceResponse = "Patrick's work experience includes:\n• Agregar Tech - Senior AI/ML & Backend Engineer (Aug 2024 - Present)\n• Ghana Digital Centres Limited - AI Developer (Nov 2022 - Jul 2024)\n• Sema Technologies Inc. - Chief Executive Officer (Part-time, Dec 2023 - Present)";
        await sendMessage(client, message.from, experienceResponse);
        return true;
        
      case COMMANDS.CONTACT:
        await sendMessage(client, message.from, constants.CONTACT_INFO);
        return true;
        
      case COMMANDS.CLEAR:
        // Clear conversation memory
        clearSession(getSessionId(message.from));
        if (sessions.has(getSessionId(message.from))) {
          sessions.delete(getSessionId(message.from));
        }
        await sendMessage(client, message.from, "Conversation history cleared. What would you like to know about Patrick?");
        return true;
    }
  } catch (commandError) {
    logger.error(`Error processing command: ${commandError.message}`, {
      error: commandError,
      command,
      from: message.from
    });
    await sendMessage(client, message.from, "Sorry, I couldn't process that command. Try /help to see available commands.");
    return true;
  }
  
  return false;
}

/**
 * Send a message with error handling
 * @param {Object} client - WhatsApp client
 * @param {String} to - Recipient ID
 * @param {String} text - Message text
 */
async function sendMessage(client, to, text) {
  try {
    // Retry logic for sending messages
    let attempts = 0;
    const maxAttempts = 3;
    let sent = false;
    
    while (!sent && attempts < maxAttempts) {
      try {
        attempts++;
        await client.sendMessage(to, text);
        sent = true;
        logger.info(`Message sent successfully on attempt ${attempts}`);
      } catch (sendError) {
        if (attempts >= maxAttempts) {
          throw sendError;
        }
        logger.warn(`Send attempt ${attempts} failed: ${sendError.message}`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  } catch (error) {
    logger.error(`Failed to send message after multiple attempts: ${error.message}`, {
      error,
      recipient: to
    });
    throw error;
  }
}

/**
 * Send typing indicator
 * @param {Object} client - WhatsApp client
 * @param {String} to - Recipient ID
 */
async function sendTypingIndicator(client, to) {
  try {
    // Check if the method exists before calling it
    if (client.sendPresenceAvailable && typeof client.sendPresenceAvailable === 'function') {
      await client.sendPresenceAvailable();
    }
    
    if (client.sendMessage && typeof client.sendMessage === 'function') {
      // Send a typing indicator (this is the best we can do with whatsapp-web.js)
      await client.sendMessage(to, '...', { sendSeen: true }).catch(() => {
        // Ignore errors with typing indicator, as it's not critical
      });
    }
  } catch (error) {
    logger.warn(`Could not send typing indicator: ${error.message}`);
    // Don't throw error for typing indicators as they're not critical
  }
}

/**
 * Check if a message is a greeting
 * @param {String} message - Message text
 * @returns {Boolean} - True if message is a greeting
 */
function isGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  const cleanMessage = message.toLowerCase().trim();
  
  return greetings.some(greeting => 
    cleanMessage === greeting || 
    cleanMessage.startsWith(`${greeting} `) ||
    cleanMessage.startsWith(`${greeting},`)
  );
}

// Clean up inactive sessions periodically
setInterval(() => {
  const now = Date.now();
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
  let inactiveSessions = 0;
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > sessionTimeout) {
      logger.info(`Cleaning up inactive session: ${sessionId}`);
      sessions.delete(sessionId);
      inactiveSessions++;
    }
  }
  
  if (inactiveSessions > 0) {
    logger.info(`Cleaned up ${inactiveSessions} inactive sessions. Active sessions remaining: ${sessions.size}`);
  }
}, 15 * 60 * 1000); // Run every 15 minutes

module.exports = { handleMessage };