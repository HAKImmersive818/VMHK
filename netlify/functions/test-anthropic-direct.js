/**
 * Direct test of Anthropic API to isolate the issue
 * Bypasses the SDK to see exactly what's being sent
 */

exports.handler = async function(event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const rawKey = process.env.ANTHROPIC_API_KEY || '';
  const trimmedKey = rawKey.trim();
  
  // Extract clean key if needed
  let apiKey = trimmedKey;
  if (!trimmedKey.startsWith('sk-ant-')) {
    const m = trimmedKey.match(/sk-ant-[A-Za-z0-9_-]+/);
    if (m && m[0]) {
      apiKey = m[0];
    }
  }

  const diagnostics = {
    keyPresent: !!rawKey,
    keyLength: apiKey.length,
    keyPrefix: apiKey.substring(0, 10) + '...',
    keySuffix: '...' + apiKey.slice(-6),
    startsCorrectly: apiKey.startsWith('sk-ant-api03-'),
    rawKeyLength: rawKey.length,
    trimmedKeyLength: trimmedKey.length,
    keysDifferent: rawKey !== trimmedKey
  };

  // Try a direct fetch to Anthropic
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: 'Say "test successful" if you can read this.'
        }]
      })
    });

    const responseData = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: response.ok,
        status: response.status,
        diagnostics,
        anthropicResponse: responseData
      }, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        diagnostics
      }, null, 2)
    };
  }
};
