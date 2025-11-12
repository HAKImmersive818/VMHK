import Anthropic from '@anthropic-ai/sdk';

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

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { message } = body;

    if (!message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Retrieve relevant context using RAG
    const relevantArticles = retrieveRelevantContext(message);
    const contextSection = relevantArticles.length > 0
      ? `\n\nRelevant VisiMedica Information:\n${relevantArticles.map(article => 
          `- ${article.topic}: ${article.content}`
        ).join('\n')}`
      : '';

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: aiResponse })
    };

  } catch (error) {
    console.error('Error in chat function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message 
      })
    };
  }
}
