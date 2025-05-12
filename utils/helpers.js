// General helper functions
const path = require('path');

// Format date to readable string
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Create a delay promise
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract file extension
function getFileExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase();
}

// Truncate a string to a certain length
function truncateString(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

// Split text into sentences
function splitIntoSentences(text) {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
}

// Convert markdown to plain text
function markdownToPlainText(markdown) {
  return markdown
    .replace(/#+\s+/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Convert links to text
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\n{2,}/g, '\n\n') // Normalize line breaks
    .trim();
}

module.exports = {
  formatDate,
  generateId,
  delay,
  getFileExtension,
  truncateString,
  splitIntoSentences,
  markdownToPlainText
};