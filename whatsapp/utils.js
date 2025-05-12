// Utility functions for WhatsApp interaction

// Split long message into multiple messages if it exceeds WhatsApp's limit
function splitMessage(message, maxLength = 4096) {
    if (message.length <= maxLength) {
      return [message];
    }
    
    const parts = [];
    let currentPart = '';
    
    // Split by paragraphs first
    const paragraphs = message.split('\n\n');
    
    for (const paragraph of paragraphs) {
      // If adding this paragraph exceeds the limit, push the current part and start a new one
      if (currentPart.length + paragraph.length + 2 > maxLength) {
        parts.push(currentPart.trim());
        currentPart = paragraph + '\n\n';
      } else {
        currentPart += paragraph + '\n\n';
      }
    }
    
    // Add the last part if it's not empty
    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }
    
    return parts;
  }
  
  // Format a response for WhatsApp (handle markdown, etc.)
  function formatResponse(text) {
    // Convert markdown to WhatsApp formatting
    // Bold: *text* -> *text*
    // Italic: _text_ -> _text_
    // Code: `text` -> ```text```
    // Links: [text](url) -> text (url)
    
    let formatted = text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)') // Convert markdown links
      .replace(/```([\s\S]*?)```/g, '```$1```') // Keep code blocks
      .trim();
    
    return formatted;
  }
  
  module.exports = {
    splitMessage,
    formatResponse
  };