const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const logger = require('../../utils/logger');
const config = require('../../config/config');

class DocumentProcessor {
  constructor(chunkSize = config.CHUNK_SIZE, chunkOverlap = config.CHUNK_OVERLAP) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
  }
  
  // Process documents into chunks
  async processDocuments(documents) {
    try {
      logger.info(`Processing ${documents.length} documents with chunk size ${this.chunkSize} and overlap ${this.chunkOverlap}`);
      
      const chunks = [];
      
      for (const document of documents) {
        const docChunks = await this.splitter.splitDocuments([document]);
        
        // Enrich chunks with source metadata
        for (const chunk of docChunks) {
          // Ensure metadata is preserved and enhanced
          chunk.metadata = {
            ...document.metadata,
            ...chunk.metadata,
            chunk_id: `${document.metadata.source}-${chunks.length + 1}`,
          };
        }
        
        chunks.push(...docChunks);
      }
      
      logger.info(`Created ${chunks.length} chunks from ${documents.length} documents`);
      return chunks;
    } catch (error) {
      logger.error('Error processing documents:', error);
      throw error;
    }
  }
  
  // Process a single document
  async processDocument(document) {
    try {
      return await this.processDocuments([document]);
    } catch (error) {
      logger.error(`Error processing document ${document.metadata?.source}:`, error);
      throw error;
    }
  }
}

module.exports = {
  DocumentProcessor
};