const Anthropic = require('@anthropic-ai/sdk');

// Simple text similarity function for RAG
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

// Medical knowledge base
const medicalKnowledgeBase = [
  {
    id: 1,
    category: "VisiMedica Core",
    topic: "Digital Twin",
    content: "VisiMedica's Digital Twin is a comprehensive, dynamic virtual model of your biology. It integrates data from genomic sequencing, advanced diagnostics, real-time wearable inputs, and physiological monitoring to create a high-fidelity representation of your health. The AI engine analyzes this data to predict health trajectories, identify risks before they become problems, and generate personalized optimization strategies for longevity and peak performance."
  },
  {
    id: 2,
    category: "VisiMedica Core",
    topic: "5-Stage Journey",
    content: "Building your Digital Twin involves 5 comprehensive stages: 1) Personal Profile (tablet-guided with AI Companion, covering supplements, medications, exercise, diet), 2) Mind Assessment (cognitive function, stress biomarkers, mental wellbeing), 3) Body Composition (advanced imaging for muscle, fat, bone density), 4) Blood Analysis (metabolic panels, hormones, nutrients, inflammatory markers), 5) Genetic Blueprint (genomic sequencing for predispositions and optimization). Each stage is supported by Dr. Chowdhury and the clinical team."
  },
  // Add more knowledge base entries as needed
];

function retrieveRelevantContext(query) {
  const scoredArticles = medicalKnowledgeBase.map(article => ({
    ...article,
    score: calculateSimilarity(query, article.topic + ' ' + article.content)
  }));
  
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter(article => article.score > 0.1);
}

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { message, conversationHistory = [], relevantKnowledge = [] } = body;

    console.log('Function called with message:', message?.substring(0, 50));
    console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
    console.log('Environment:', process.env.CONTEXT || 'unknown');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Message is required',
          errorType: 'VALIDATION_ERROR'
        })
      };
    }

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      console.error('Available env vars:', Object.keys(process.env).filter(k => !k.includes('SECRET')));
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API key not configured. Please set ANTHROPIC_API_KEY in Netlify environment variables.',
          errorType: 'MISSING_API_KEY',
          details: 'Go to Netlify Dashboard > Site Settings > Environment Variables to add ANTHROPIC_API_KEY'
        })
      };
    }

    // Initialize Anthropic client
    console.log('Initializing Anthropic client...');
    let anthropic;
    try {
      const rawKey = process.env.ANTHROPIC_API_KEY || '';
      const apiKey = rawKey.trim();
      anthropic = new Anthropic({
        apiKey,
      });
      console.log('Anthropic client initialized successfully');
    } catch (initError) {
      console.error('Failed to initialize Anthropic client:', initError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to initialize AI client: ' + initError.message,
          errorType: 'INIT_ERROR',
          details: initError.stack
        })
      };
    }

    // Use RAG knowledge from frontend if available, otherwise retrieve here
    let contextSection = '';
    if (relevantKnowledge && relevantKnowledge.length > 0) {
      contextSection = `\n\nRelevant VisiMedica Information:\n${relevantKnowledge.map(item => 
        `- ${item.topic}: ${item.content}`
      ).join('\n')}`;
    } else {
      const relevantArticles = retrieveRelevantContext(message);
      if (relevantArticles.length > 0) {
        contextSection = `\n\nRelevant VisiMedica Information:\n${relevantArticles.map(article => 
          `- ${article.topic}: ${article.content}`
        ).join('\n')}`;
      }
    }

    // System prompt with VisiMedica context
    const systemPrompt = `You are Dr. Chowdhury, the AI-powered physician assistant for VisiMedica, a precision longevity medicine platform. 

VisiMedica Core Philosophy:
- Transform healthcare from reactive to predictive and proactive
- Build comprehensive Digital Twins of patient biology
- Maximize healthspan, not just lifespan
- Combine cutting-edge diagnostics, genomics, and AI-driven insights

The VisiMedica Digital Twin Journey has 5 stages:
1. Personal Profile - Tablet-guided with AI Companion assistance
2. Mind Assessment - Cognitive and mental health evaluation
3. Body Composition - Advanced imaging and metabolic analysis
4. Blood Analysis - Comprehensive biomarker panels
5. Genetic Blueprint - Genomic sequencing and personalized insights

Your role:
- Provide compassionate, evidence-based medical guidance
- Reference the Digital Twin concept and 5-stage journey when relevant
- Explain complex medical information in accessible terms
- Guide patients through their VisiMedica journey
- Emphasize preventive care and optimization
- Be warm, professional, and supportive

${contextSection}

Keep responses concise (2-3 sentences) and conversational.`;

    // Call Anthropic API
    console.log('Calling Anthropic API with model: claude-3-5-sonnet-20241022');
    console.log('Message length:', message.length, 'System prompt length:', systemPrompt.length);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: message
      }],
      system: systemPrompt
    });

    const aiResponse = response.content[0].text;

    console.log('Successfully got AI response, length:', aiResponse.length);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: aiResponse })
    };

  } catch (error) {
    console.error('Error in chat function:', error);
    console.error('Error details:', error.message, error.stack);
    
    // Provide specific error messages for common issues
    let errorMessage = 'Failed to process request';
    let errorType = 'UNKNOWN_ERROR';
    
    if (error.status === 401 || error.message?.toLowerCase().includes('invalid x-api-key') || error.message?.toLowerCase().includes('api key')) {
      errorMessage = 'Invalid API key. Please check your ANTHROPIC_API_KEY in Netlify environment variables.';
      errorType = 'INVALID_API_KEY';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'API rate limit exceeded. Please try again in a moment.';
      errorType = 'RATE_LIMIT';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network error connecting to Anthropic API. Please check your internet connection.';
      errorType = 'NETWORK_ERROR';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        errorType: errorType,
        details: error.message 
      })
    };
  }
};
