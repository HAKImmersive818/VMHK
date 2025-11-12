/**
 * Test script for RAG system and Anthropic API
 * Run with: node test-rag-api.js
 */

import { retrieveRelevantKnowledge } from './src/data/medicalKnowledge.js';
import { getAIResponse } from './server/anthropic-api.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Testing RAG System and Anthropic API...\n');

// Test 1: RAG Retrieval
console.log('=== TEST 1: RAG Retrieval ===');
const testQueries = [
  'What services do you offer?',
  'I have a headache',
  'How do I schedule an appointment?',
  'I feel anxious and stressed'
];

testQueries.forEach(query => {
  console.log(`\n📝 Query: "${query}"`);
  const knowledge = retrieveRelevantKnowledge(query, 3);
  console.log(`✅ Retrieved ${knowledge.length} relevant items:`);
  knowledge.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ${item.topic} (${item.category}) - Score: ${item.score}`);
  });
});

// Test 2: API Call with RAG
console.log('\n\n=== TEST 2: Anthropic API Call with RAG ===');

const testMessage = 'What services does your clinic offer?';
console.log(`\n💬 User Message: "${testMessage}"`);

// Retrieve RAG knowledge
const relevantKnowledge = retrieveRelevantKnowledge(testMessage, 3);
console.log(`\n📚 RAG Retrieved ${relevantKnowledge.length} items for context`);

// Check API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ERROR: ANTHROPIC_API_KEY not found in .env file');
  console.log('Please add your Anthropic API key to the .env file');
  process.exit(1);
}

console.log('✅ API Key found');
console.log(`🔑 Key preview: ${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...`);

// Make API call
console.log('\n⏳ Calling Anthropic API...');

try {
  const response = await getAIResponse(testMessage, [], relevantKnowledge);
  console.log('\n✅ API CALL SUCCESSFUL!');
  console.log('\n🤖 Dr. Aisha Response:');
  console.log('─'.repeat(60));
  console.log(response);
  console.log('─'.repeat(60));
  console.log('\n✨ RAG + API Integration Working Perfectly!\n');
} catch (error) {
  console.error('\n❌ API CALL FAILED:');
  console.error('Error:', error.message);
  console.error('\nFull error:', error);
  
  if (error.message.includes('401') || error.message.includes('authentication')) {
    console.log('\n💡 Check: Is your API key valid?');
  } else if (error.message.includes('404') || error.message.includes('not_found')) {
    console.log('\n💡 Check: Model name might be incorrect');
  } else if (error.message.includes('rate_limit')) {
    console.log('\n💡 Check: You may have hit rate limits');
  }
  
  process.exit(1);
}
