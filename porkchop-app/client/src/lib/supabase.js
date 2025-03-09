// client/src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helper functions with mocked data for development
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    console.error('Error in signUp:', err);
    // For development only - return mock successful signup
    return { 
      data: { user: { id: 'mock-user-id', email } },
      error: null
    };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    console.error('Error in signIn:', err);
    // For development only - return mock successful login
    return { 
      data: { user: { id: 'mock-user-id', email } },
      error: null
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Error in signOut:', err);
    return { error: null };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user || { id: 'mock-user-id', email: 'dev@example.com' }; // Return mock user if none exists
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return { id: 'mock-user-id', email: 'dev@example.com' };
  }
};

// Other functions with try/catch blocks
export const saveUserPreferences = async (userId, preferences) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...preferences });
    return { data, error };
  } catch (err) {
    console.error('Error in saveUserPreferences:', err);
    return { data: null, error: null };
  }
};

export const getRecipesByCriteria = async (criteria) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .match(criteria);
    return { data: data || [], error };
  } catch (err) {
    console.error('Error in getRecipesByCriteria:', err);
    return { data: [], error: null };
  }
};

export const logRecipeCooked = async (userId, recipeId) => {
  try {
    const { data, error } = await supabase
      .from('recipe_analytics')
      .insert({ user_id: userId, recipe_id: recipeId, cooked_at: new Date() });
    return { data, error };
  } catch (err) {
    console.error('Error in logRecipeCooked:', err);
    return { data: null, error: null };
  }
};

export const getMostCookedRecipes = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('recipe_analytics')
      .select('recipe_id, count(*)')
      .group('recipe_id')
      .order('count', { ascending: false })
      .limit(limit);
    return { data: data || [], error };
  } catch (err) {
    console.error('Error in getMostCookedRecipes:', err);
    return { data: [], error: null };
  }
};