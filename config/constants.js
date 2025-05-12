// Application constants and message templates

const constants = {
  // Message templates
  GREETING_MESSAGE: "Hello! I'm Patrick's portfolio assistant. I can tell you about his experience, skills, projects, and qualifications for remote AI/ML roles. How can I help you today?",
  
  ERROR_MESSAGE: "I apologize, but I encountered an error processing your request. Please try again or ask a different question.",
  
  FALLBACK_MESSAGE: "I don't have specific information about that, but I'd be happy to connect you directly with Patrick to discuss further. Would you like his contact information?",
  
  CONTACT_INFO: "You can reach Patrick via email at patricka.azuma@gmail.com or connect with him on LinkedIn at https://www.linkedin.com/in/patrickattankurugu400/",
  
  // Command prefixes
  COMMANDS: {
    HELP: "/help",
    RESUME: "/resume",
    PROJECTS: "/projects",
    SKILLS: "/skills",
    EXPERIENCE: "/experience",
    CONTACT: "/contact",
    CLEAR: "/clear"
  },
  
  // Help message
  HELP_MESSAGE: `
Here are the commands you can use:
/help - Show this help message
/resume - Get Patrick's resume overview
/projects - Learn about Patrick's projects
/skills - See Patrick's technical skills
/experience - View Patrick's work experience
/contact - Get Patrick's contact information
/clear - Clear the conversation history

You can also ask natural questions like:
"What experience does Patrick have with AI?"
"Tell me about Patrick's background"
"What are Patrick's skills in machine learning?"
"Is Patrick available for remote work?"
  `
};

module.exports = { constants };