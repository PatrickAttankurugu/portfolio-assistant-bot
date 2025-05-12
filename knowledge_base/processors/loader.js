const fs = require('fs').promises;
const path = require('path');
const { Document } = require('langchain/document');
const markdown = require('markdown-it')();
const logger = require('../../utils/logger');

// Load all portfolio documents
async function loadPortfolioDocuments() {
  try {
    const dataDirectory = path.join(__dirname, '../data');
    const files = await fs.readdir(dataDirectory);
    
    const documents = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dataDirectory, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Create metadata for the document
        const metadata = {
          source: file,
          type: file.split('.')[0], // resume, projects, skills, etc.
          created: new Date().toISOString(),
        };
        
        // Create document
        const document = new Document({
          pageContent: content,
          metadata: metadata,
        });
        
        documents.push(document);
        logger.info(`Loaded document: ${file}`);
      }
    }
    
    return documents;
  } catch (error) {
    logger.error('Error loading portfolio documents:', error);
    throw error;
  }
}

// Load a specific document by filename
async function loadDocument(filename) {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Parse markdown content
    const htmlContent = markdown.render(content);
    
    return {
      filename,
      content,
      html: htmlContent,
    };
  } catch (error) {
    logger.error(`Error loading document ${filename}:`, error);
    return null;
  }
}

// Get all document filenames
async function getDocumentList() {
  try {
    const dataDirectory = path.join(__dirname, '../data');
    const files = await fs.readdir(dataDirectory);
    return files.filter(file => file.endsWith('.md'));
  } catch (error) {
    logger.error('Error getting document list:', error);
    return [];
  }
}

module.exports = {
  loadPortfolioDocuments,
  loadDocument,
  getDocumentList
};