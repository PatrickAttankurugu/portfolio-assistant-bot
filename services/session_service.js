const logger = require('../utils/logger');
const config = require('../config/config');

// In-memory storage for simplicity
const sessions = new Map();

// Get a session ID from a WhatsApp number
function getSessionId(phoneNumber) {
  return `session_${phoneNumber}`;
}

// Get session data
function getSessionData(sessionId) {
  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    // Update last activity
    session.lastActivity = Date.now();
    return session.data;
  }
  
  // Create new session if it doesn't exist
  const newSession = {
    data: {},
    lastActivity: Date.now(),
    createdAt: Date.now()
  };
  
  sessions.set(sessionId, newSession);
  logger.info(`Created new session: ${sessionId}`);
  return newSession.data;
}

// Set session data
function setSessionData(sessionId, data) {
  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    session.data = { ...session.data, ...data };
    session.lastActivity = Date.now();
  } else {
    sessions.set(sessionId, {
      data,
      lastActivity: Date.now(),
      createdAt: Date.now()
    });
    logger.info(`Created new session with data: ${sessionId}`);
  }
  return true;
}

// Clear a session
function clearSession(sessionId) {
  if (sessions.has(sessionId)) {
    sessions.delete(sessionId);
    logger.info(`Cleared session: ${sessionId}`);
    return true;
  }
  return false;
}

// Periodically clean up inactive sessions
setInterval(() => {
  const now = Date.now();
  const sessionTimeout = config.SESSION_TTL * 1000; // Convert to milliseconds
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > sessionTimeout) {
      sessions.delete(sessionId);
      logger.info(`Cleaned up inactive session: ${sessionId}`);
    }
  }
}, 15 * 60 * 1000); // Run every 15 minutes

module.exports = {
  getSessionId,
  getSessionData,
  setSessionData,
  clearSession
};