const express = require('express');

const anthropic = require('../../providers/anthropic-client');

const chefFreddieRoutes = express.Router();

// Ask Chef Freddie AI Route
chefFreddieRoutes.post('/chef-freddie/ask', async (req, res) => {
  try {
    const { query, recipe } = req.body;
    
    if (!query || !recipe) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Format prompt for Claude
    const prompt = `
      You are Chef Freddie, a friendly and helpful cooking assistant.
      
      A user is cooking the following recipe:
      
      Recipe: ${recipe.name}
      Description: ${recipe.description}
      Ingredients: ${JSON.stringify(recipe.ingredients)}
      Steps: ${recipe.steps.join('\n')}
      Cook Time: ${recipe.cook_time}
      Servings: ${recipe.servings}
      
      The user has asked: "${query}"
      
      Please provide a helpful, personable response as Chef Freddie. Keep your answer conversational, 
      friendly, and focused on the specific recipe. Provide practical cooking advice,
      substitution options, or tips to improve the dish.
      
      Your response should be in plain text, without any formatting.
    `;
    
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
    
    // Extract and return Claude's response
    const chefResponse = response.content[0].text;
    
    // Generate some contextual quick replies
    let quickReplies = [];
    
    if (query.toLowerCase().includes('substitute') || query.toLowerCase().includes('replacement')) {
      quickReplies = [
        "What if I'm missing the main ingredient?",
        "Can I make this vegetarian?",
        "Thanks!"
      ];
    } else if (query.toLowerCase().includes('done') || query.toLowerCase().includes('ready')) {
      quickReplies = [
        "I don't have a thermometer",
        "How do I check without cutting into it?",
        "Thanks!"
      ];
    } else {
      quickReplies = [
        "Any tips for making this better?",
        "What side dishes go well with this?",
        "Thanks for the help!"
      ];
    }
    
    res.status(200).json({ response: chefResponse, quickReplies });
  } catch (error) {
    console.error('Error with Claude AI:', error);
    res.status(500).json({ 
      error: 'Chef Freddie is a bit stumped right now. Try asking something else!',
      quickReplies: ["How do I know when it's done?", "Can I substitute ingredients?", "What goes well with this?"]
    });
  }
});

module.exports = chefFreddieRoutes;
