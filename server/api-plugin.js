import { getAIResponse } from './anthropic-api.js';

/**
 * Vite plugin to handle API requests during development
 */
export function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Handle POST requests to /api/chat
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', async () => {
            try {
              const { message, conversationHistory, relevantKnowledge } = JSON.parse(body);
              
              if (!message) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Message is required' }));
                return;
              }
              
              // Call Anthropic API with RAG knowledge
              const aiResponse = await getAIResponse(message, conversationHistory, relevantKnowledge);
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ response: aiResponse }));
              
            } catch (error) {
              console.error('API Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'Failed to process request',
                details: error.message 
              }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}
