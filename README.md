# Portfolio Assistant WhatsApp Chatbot

A WhatsApp chatbot powered by Google's Gemini 2.0 and LangChain that answers questions about Patrick Attankurugu's professional portfolio. The bot leverages vector search and RAG (Retrieval Augmented Generation) to provide accurate information about skills, experience and projects.
## Features

- **WhatsApp Integration**: Uses whatsapp-web.js for messaging
- **LLM Integration**: Powered by Google's Gemini 2.0
- **Conversational Memory**: Maintains context across conversation turns
- **Vector Search**: Uses ChromaDB to find relevant portfolio information
- **RAG Architecture**: Retrieves relevant context before generating responses
- **Professional Portfolio**: Includes resume, skills, projects, and work experience

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Google Gemini API key
- WhatsApp account


1. Install dependencies:
npm install

1. Create a `.env` file in the root directory with the following content:
GEMINI_API_KEY=your_gemini_api_key
CHROMA_URL=http://localhost:8000
LOG_LEVEL=info
NODE_ENV=development

1. Populate the knowledge base with your portfolio information:
- Edit files in `knowledge_base/data/` with your information
- Format as markdown for easy reading and updating

1. Initialize the vector database:
npm run setup

## Usage

1. Start the application:
npm start

2. Scan the QR code with WhatsApp (using the "Link a Device" option)

3. The bot is now active and will respond to messages

### Available Commands

- `/help` - Show available commands
- `/resume` - Get a resume overview
- `/projects` - Learn about projects
- `/skills` - See technical skills
- `/experience` - View work experience
- `/contact` - Get contact information
- `/clear` - Clear conversation history

You can also ask natural questions like:
- "What experience does Patrick have with AI?"
- "Tell me about Patrick's background"
- "What are Patrick's skills in machine learning?"
- "Is Patrick available for remote work?"

## Testing

Run the test scripts to verify functionality:
Test vector database retrieval
node scripts/test_queries.js
Test conversation flows
node tests/conversation_tests.js
Test LangChain components
node tests/langchain_tests.js
Test retrieval accuracy
node tests/retrieval_tests.js

## Project Structure

- `app.js` - Main application entry point
- `whatsapp/` - WhatsApp integration
- `langchain/` - LLM and conversation chain
- `vector_db/` - Vector database integration
- `knowledge_base/` - Portfolio data and processors
- `services/` - Supporting services
- `utils/` - Helper utilities
- `scripts/` - Setup and maintenance scripts
- `tests/` - Test scripts
- `config/` - Configuration files
- `middleware/` - Error handling and rate limiting

## Customization

To adapt this chatbot for your own portfolio:

1. Update the knowledge base files in `knowledge_base/data/`
2. Edit system prompts in `langchain/prompts.js`
3. Update message templates in `config/constants.js`
4. Reinitialize the vector database with `npm run setup`
