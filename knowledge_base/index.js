const { loadPortfolioDocuments, loadDocument, getDocumentList } = require('./processors/loader');
const { updateDocument, addDocument, deleteDocument } = require('./processors/updater');
const { DocumentProcessor } = require('./processors/chunker');
const logger = require('../utils/logger');

// Main knowledge base interface
class KnowledgeBase {
  constructor() {
    this.processor = new DocumentProcessor();
  }
  
  // Load all documents
  async loadAllDocuments() {
    try {
      return await loadPortfolioDocuments();
    } catch (error) {
      logger.error('Error in KnowledgeBase.loadAllDocuments:', error);
      return [];
    }
  }
  
  // Get list of all documents
  async getDocuments() {
    try {
      return await getDocumentList();
    } catch (error) {
      logger.error('Error in KnowledgeBase.getDocuments:', error);
      return [];
    }
  }
  
  // Get a specific document
  async getDocument(filename) {
    try {
      return await loadDocument(filename);
    } catch (error) {
      logger.error(`Error in KnowledgeBase.getDocument(${filename}):`, error);
      return null;
    }
  }
  
  // Update a document
  async updateDocument(filename, content) {
    try {
      return await updateDocument(filename, content);
    } catch (error) {
      logger.error(`Error in KnowledgeBase.updateDocument(${filename}):`, error);
      return false;
    }
  }
  
  // Add a new document
  async addDocument(filename, content) {
    try {
      return await addDocument(filename, content);
    } catch (error) {
      logger.error(`Error in KnowledgeBase.addDocument(${filename}):`, error);
      return false;
    }
  }
  
  // Delete a document
  async deleteDocument(filename) {
    try {
      return await deleteDocument(filename);
    } catch (error) {
      logger.error(`Error in KnowledgeBase.deleteDocument(${filename}):`, error);
      return false;
    }
  }
  
  // Process documents into chunks
  async processDocuments(documents) {
    try {
      return await this.processor.processDocuments(documents);
    } catch (error) {
      logger.error('Error in KnowledgeBase.processDocuments:', error);
      return [];
    }
  }
}

// Export a singleton instance
const knowledgeBase = new KnowledgeBase();
module.exports = knowledgeBase;