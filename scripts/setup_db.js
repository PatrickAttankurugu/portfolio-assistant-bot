// Script to initialize and populate the vector database
require('dotenv').config();
const { initializeVectorDB } = require('../vector_db/init_db');
const logger = require('../utils/logger');

async function setupDatabase() {
  try {
    logger.info('Starting database setup...');
    
    // Initialize vector database
    await initializeVectorDB();
    
    logger.info('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();