const express = require('express');

const supabase = require('../../providers/supabase-client');

const recipeRoutes = express.Router();

// Get All Recipes Route
recipeRoutes.get('/recipes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Matched Recipes Route
recipeRoutes.get('/recipes/match', async (req, res) => {
  try {
    const { proteins, veggies, herbs, cookware } = req.query;
    
    // Convert comma-separated string to arrays
    const proteinArray = proteins ? proteins.split(',') : [];
    const veggieArray = veggies ? veggies.split(',') : [];
    const herbArray = herbs ? herbs.split(',') : [];
    const cookwareArray = cookware ? cookware.split(',') : [];
    
    // Get all recipes
    const { data: allRecipes, error } = await supabase
      .from('recipes')
      .select('*');
    
    if (error) {
      throw error;
    }
    
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
      
      return { ...recipe, match: matchPercentage };
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

module.exports = recipeRoutes;
