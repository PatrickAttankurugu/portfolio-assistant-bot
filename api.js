// api.js
const express = require('express');
const cors = require('cors');
const { createConversationChain } = require('./langchain/chain');
const logger = require('./utils/logger');
const { initializeVectorDB } = require('./vector_db/init_db');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Store conversation chains for different sessions
const sessions = new Map();

// Initialize the vector database
async function initialize() {
  try {
    logger.info('Initializing vector database...');
    await initializeVectorDB();
    logger.info('Vector database initialization complete');
  } catch (error) {
    logger.error('Failed to initialize vector database:', error);
    process.exit(1);
  }
}

// API endpoints
app.get('/', (req, res) => {
  res.send('Portfolio Assistant API is running');
});

// Endpoint to get a response from the assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    logger.info(`Received message: ${message} (sessionId: ${sessionId})`);
    
    // Get or create conversation chain for this session
    if (!sessions.has(sessionId)) {
      logger.info(`Creating new conversation chain for session: ${sessionId}`);
      sessions.set(sessionId, await createConversationChain(sessionId));
    }
    
    const chain = sessions.get(sessionId);
    
    // Generate response
    const startTime = Date.now();
    const response = await chain.call({
      input: message,
      sessionId: sessionId
    });
    const responseTime = Date.now() - startTime;
    
    logger.info(`Generated response in ${responseTime}ms`);
    
    // Return the response
    res.json({
      response: response.response || response.text,
      sessionId
    });
  } catch (error) {
    logger.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Start the server after initializing the vector database
initialize().then(() => {
  app.listen(PORT, () => {
    logger.info(`Portfolio Assistant API running on port ${PORT}`);
  });
});