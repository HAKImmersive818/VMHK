import { retrieveRelevantKnowledge } from '../data/medicalKnowledge';

/**
 * Client-side service to interact with the Anthropic AI API with RAG
 */

/**
 * Send a message to the AI doctor and get a response with RAG
 * @param {string} message - The user's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI's response
 */
export async function sendMessageToAI(message, conversationHistory = []) {
  try {
    // Retrieve relevant knowledge from RAG system
    const relevantKnowledge = retrieveRelevantKnowledge(message, 3);
    
    console.log('RAG Retrieved:', relevantKnowledge.length, 'relevant items');
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory: conversationHistory.slice(-10), // Only send last 10 messages for context
        relevantKnowledge: relevantKnowledge // Send RAG knowledge
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || 'Failed to get AI response';
      const errorType = errorData.errorType || 'UNKNOWN_ERROR';
      
      console.error('API Error:', errorType, '-', errorMessage);
      if (errorData.details) {
        console.error('Details:', errorData.details);
      }
      
      const error = new Error(errorMessage);
      error.type = errorType;
      error.details = errorData.details;
      throw error;
    }

    const data = await response.json();
    return data.response;
    
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Add more context to network errors
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      error.message = 'Network error: Unable to reach the API. Check your internet connection or Netlify function deployment.';
      error.type = 'NETWORK_ERROR';
    }
    
    throw error;
  }
}
