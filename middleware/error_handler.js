const logger = require('../utils/logger');
const { constants } = require('../config/constants');

// Central error handling middleware
function errorHandler(error, operation) {
  // Log the error
  logger.error(`Error during ${operation}:`, {
    message: error.message,
    stack: error.stack,
    operation
  });
  
  // Determine appropriate response based on error type
  let responseMessage = constants.ERROR_MESSAGE;
  
  // Check for specific error types and customize message
  if (error.name === 'TimeoutError') {
    responseMessage = "I'm taking too long to process your request. Please try again with a simpler question.";
  } else if (error.name === 'AuthenticationError') {
    responseMessage = "There's an issue with my connection to WhatsApp. Please try again later.";
  } else if (error.name === 'APIError') {
    responseMessage = "I'm having trouble accessing some information right now. Please try again later.";
  }
  
  return {
    success: false,
    message: responseMessage,
    error: error.message
  };
}

// Function to wrap async handlers with error handling
function asyncErrorHandler(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      return errorHandler(error, fn.name);
    }
  };
}

module.exports = {
  errorHandler,
  asyncErrorHandler
};