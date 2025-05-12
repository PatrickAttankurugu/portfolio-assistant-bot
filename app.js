// Main application entry point
const { Client } = require('./whatsapp/client');
const logger = require('./utils/logger');
const { initializeVectorDB } = require('./vector_db/init_db');
require('dotenv').config();

async function startApplication() {
  try {
    // Initialize vector database
    logger.info('Initializing vector database...');
    await initializeVectorDB();
    
    // Initialize WhatsApp client
    logger.info('Starting WhatsApp client...');
    const client = new Client();
    await client.initialize();
    
    logger.info('Portfolio Assistant Bot is running!');
    logger.info('Scan the QR code with WhatsApp to start using the bot.');
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

startApplication();