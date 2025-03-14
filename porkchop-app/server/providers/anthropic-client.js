const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude AI client
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// Export the initialized client
module.exports = anthropic;
