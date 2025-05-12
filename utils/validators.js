// Input validation functions

// Validate if a string is not empty
function isNotEmpty(str) {
    return typeof str === 'string' && str.trim().length > 0;
  }
  
  // Validate if a string is a valid email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate if a string is a valid URL
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Validate if a command is recognized
  function isValidCommand(command, validCommands) {
    return validCommands.includes(command.toLowerCase());
  }
  
  // Validate if a date string is valid
  function isValidDate(dateStr) {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
  
  // Sanitize string input
  function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Remove any potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML-like tags
      .replace(/(\r\n|\n|\r)/gm, ' ') // Replace newlines with spaces
      .trim();
  }
  
  module.exports = {
    isNotEmpty,
    isValidEmail,
    isValidUrl,
    isValidCommand,
    isValidDate,
    sanitizeInput
  };