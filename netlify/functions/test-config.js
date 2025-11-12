/**
 * Simple test endpoint to verify environment configuration
 * Access at: /.netlify/functions/test-config or /api/test-config
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

  const raw = process.env.ANTHROPIC_API_KEY || '';
  const apiKeyPresent = !!raw;
  const trimmed = raw.trim();
  const apiKeyPrefix = apiKeyPresent ? trimmed.substring(0, 7) + '...' : 'NOT SET';
  const apiKeySuffix = apiKeyPresent && trimmed.length >= 4 ? '...' + trimmed.slice(-4) : '';
  const hasLeadingOrTrailingWhitespace = apiKeyPresent && raw !== trimmed;
  const containsWhitespaceChars = apiKeyPresent && /\s/.test(raw);
  const startsWithSkAnt = apiKeyPresent && trimmed.startsWith('sk-ant-');

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.CONTEXT || 'unknown',
    nodeVersion: process.version,
    apiKeyConfigured: apiKeyPresent,
    apiKeyPrefix: apiKeyPrefix,
    apiKeySuffix: apiKeySuffix,
    apiKeyLength: apiKeyPresent ? trimmed.length : 0,
    startsWithSkAnt: startsWithSkAnt,
    hasLeadingOrTrailingWhitespace: hasLeadingOrTrailingWhitespace,
    containsWhitespaceChars: containsWhitespaceChars,
    expectedKeyFormat: 'sk-ant-...',
    allEnvVars: Object.keys(process.env).filter(k => 
      !k.includes('SECRET') && 
      !k.includes('TOKEN') && 
      !k.includes('KEY') &&
      !k.includes('PASSWORD')
    ).sort()
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(diagnostics, null, 2)
  };
};
