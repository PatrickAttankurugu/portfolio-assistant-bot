const fs = require('fs').promises;
const path = require('path');
const { Document } = require('langchain/document');
const { DocumentProcessor } = require('./chunker');
const { getVectorStore, addDocumentToVectorStore } = require('../../vector_db/utils');
const logger = require('../../utils/logger');

// Update a specific knowledge base document
async function updateDocument(filename, content) {
  try {
    // Write new content to file
    const filePath = path.join(__dirname, '../data', filename);
    await fs.writeFile(filePath, content);
    
    // Create document object
    const document = new Document({
      pageContent: content,
      metadata: {
        source: filename,
        type: filename.split('.')[0],
        updated: new Date().toISOString(),
      },
    });
    
    // Process into chunks
    const processor = new DocumentProcessor();
    const chunks = await processor.processDocument(document);
    
    // Get vector store
    const vectorStore = await getVectorStore();
    
    // Delete existing entries for this document
    await vectorStore.delete({
      filter: { source: filename },
    });
    
    // Add new chunks
    await vectorStore.addDocuments(chunks);
    
    logger.info(`Updated document ${filename} with ${chunks.length} new chunks`);
    return true;
  } catch (error) {
    logger.error(`Error updating document ${filename}:`, error);
    return false;
  }
}

// Add a new document to the knowledge base
async function addDocument(filename, content) {
  try {
    // Check if file already exists
    const filePath = path.join(__dirname, '../data', filename);
    try {
      await fs.access(filePath);
      // File exists
      logger.warn(`Document ${filename} already exists. Use updateDocument instead.`);
      return false;
    } catch {
      // File doesn't exist, continue
    }
    
    // Write content to new file
    await fs.writeFile(filePath, content);
    
    // Create document object
    const document = new Document({
      pageContent: content,
      metadata: {
        source: filename,
        type: filename.split('.')[0],
        created: new Date().toISOString(),
      },
    });
    
    // Process into chunks
    const processor = new DocumentProcessor();
    const chunks = await processor.processDocument(document);
    
    // Add to vector store
    const vectorStore = await getVectorStore();
    await vectorStore.addDocuments(chunks);
    
    logger.info(`Added new document ${filename} with ${chunks.length} chunks`);
    return true;
  } catch (error) {
    logger.error(`Error adding document ${filename}:`, error);
    return false;
  }
}

// Delete a document from the knowledge base
async function deleteDocument(filename) {
  try {
    // Delete file
    const filePath = path.join(__dirname, '../data', filename);
    await fs.unlink(filePath);
    
    // Delete from vector store
    const vectorStore = await getVectorStore();
    await vectorStore.delete({
      filter: { source: filename },
    });
    
    logger.info(`Deleted document ${filename}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting document ${filename}:`, error);
    return false;
  }
}

module.exports = {
  updateDocument,
  addDocument,
  deleteDocument
};