/**
 * Test the Netlify function locally before deploying
 * Run with: node test-function-locally.js
 */

const chatHandler = require('./netlify/functions/chat.js').handler;

async function testFunction() {
  console.log('🧪 Testing Netlify function locally...\n');

  // Simulate a Netlify function event
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({
      message: 'Hello, what is VisiMedica?',
      conversationHistory: [],
      relevantKnowledge: []
    }),
    headers: {
      'content-type': 'application/json'
    }
  };

  const context = {};

  try {
    console.log('📤 Sending request...');
    const response = await chatHandler(event, context);
    
    console.log('\n📥 Response received:');
    console.log('Status:', response.statusCode);
    console.log('Headers:', response.headers);
    console.log('\nBody:');
    
    const body = JSON.parse(response.body);
    console.log(JSON.stringify(body, null, 2));
    
    if (response.statusCode === 200) {
      console.log('\n✅ Function works correctly!');
    } else {
      console.log('\n❌ Function returned an error');
    }
  } catch (error) {
    console.error('\n❌ Function failed with error:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  }
}

testFunction();
