// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { AnthropicApi } = require('@anthropic-ai/sdk');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Claude AI client
const anthropic = new AnthropicApi({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PorkChop API is running' });
});

// Recipe routes
app.get('/api/recipes', async (req, res) => {
  try {
    const { data, error } = await supabase.from('recipes').select('*');
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recipes/match', async (req, res) => {
  try {
    const { proteins, veggies, herbs, cookware } = req.query;
    
    // Convert comma-separated string to arrays
    const proteinArray = proteins ? proteins.split(',') : [];
    const veggieArray = veggies ? veggies.split(',') : [];
    const herbArray = herbs ? herbs.split(',') : [];
    const cookwareArray = cookware ? cookware.split(',') : [];
    
    // Get all recipes
    const { data: allRecipes, error } = await supabase.from('recipes').select('*');
    
    if (error) throw error;
    
    // Calculate match score for each recipe
    const matchedRecipes = allRecipes.map(recipe => {
      let matchScore = 0;
      let totalPossibleScore = 0;
      
      // Check protein matches
      if (proteinArray.length > 0) {
        totalPossibleScore += 40; // Proteins are important
        const proteinMatches = recipe.protein_tags.filter(tag => 
          proteinArray.includes(tag)).length;
        matchScore += (proteinMatches / recipe.protein_tags.length) * 40;
      }
      
      // Check veggie matches
      if (veggieArray.length > 0) {
        totalPossibleScore += 30;
        const veggieMatches = recipe.veggie_tags.filter(tag => 
          veggieArray.includes(tag)).length;
        matchScore += (veggieMatches / recipe.veggie_tags.length) * 30;
      }
      
      // Check herb matches
      if (herbArray.length > 0) {
        totalPossibleScore += 15;
        const herbMatches = recipe.herb_tags.filter(tag => 
          herbArray.includes(tag)).length;
        matchScore += (herbMatches / recipe.herb_tags.length) * 15;
      }
      
      // Check cookware matches
      if (cookwareArray.length > 0) {
        totalPossibleScore += 15;
        const cookwareMatches = recipe.required_cookware.filter(item => 
          cookwareArray.includes(item)).length;
        matchScore += (cookwareMatches / recipe.required_cookware.length) * 15;
      }
      
      // Calculate percentage match
      const matchPercentage = totalPossibleScore > 0 
        ? Math.round((matchScore / totalPossibleScore) * 100) 
        : 0;
      
      return {
        ...recipe,
        match: matchPercentage
      };
    });
    
    // Sort by match score (highest first) and filter out low matches
    const sortedRecipes = matchedRecipes
      .filter(recipe => recipe.match > 40) // Only return recipes with at least 40% match
      .sort((a, b) => b.match - a.match);
    
    res.status(200).json(sortedRecipes);
  } catch (error) {
    console.error('Error matching recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics routes
app.post('/api/analytics/recipe-cooked', async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;
    
    if (!user_id || !recipe_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const { data, error } = await supabase
      .from('recipe_analytics')
      .insert({ user_id, recipe_id });
    
    if (error) throw error;
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error logging recipe cook:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/most-cooked', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const { data, error } = await supabase
      .rpc('get_most_cooked_recipes', { limit_num: parseInt(limit) });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting most cooked recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chef Freddie AI routes
app.post('/api/chef-freddie/ask', async (req, res) => {
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
    
    res.status(200).json({ 
      response: chefResponse,
      quickReplies
    });
  } catch (error) {
    console.error('Error with Claude AI:', error);
    res.status(500).json({ 
      error: 'Chef Freddie is a bit stumped right now. Try asking something else!',
      quickReplies: ["How do I know when it's done?", "Can I substitute ingredients?", "What goes well with this?"]
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PorkChop API running on port ${PORT}`);
});

// Export for testing
module.exports = app;