const express = require('express');

const supabase = require('../../providers/supabase-client');

const analyticsRoutes = express.Router();

// Recipe Cooked Analytics Route
analyticsRoutes.post('/analytics/recipe-cooked', async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;
    
    if (!user_id || !recipe_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const { data, error } = await supabase
      .from('recipe_analytics')
      .insert({ user_id, recipe_id });
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error logging recipe cook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Most Cooked Recipes Analytics Route
analyticsRoutes.get('/analytics/most-cooked', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const { data, error } = await supabase.rpc('get_most_cooked_recipes', {
      limit_num: parseInt(limit)
    });
    
    if (error) {
      throw error;
    } 
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting most cooked recipes:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = analyticsRoutes;
