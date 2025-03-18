// server/routes/v1/session-routes.js
const express = require('express');
const supabase = require('../../providers/supabase-client');

const router = express.Router();

// Get Session Route
router.get('/session', async (req, res, next) => {
  try {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
  
    // Get basic session data
    const { isAuthenticated, tenantId, userId } = req.session;
    
    if (!isAuthenticated || !userId) {
      return res.status(200).json({ isAuthenticated: false });
    }
    
    // Get user details including subscription plan and new user status
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, subscription_plan, is_new_user')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return res.status(200).json({ 
        isAuthenticated, 
        tenantId, 
        userId,
        subscription: 'free',
        isNewUser: false
      });
    }
    
    // Get subscription details if user exists
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Return session data with user and subscription info
    return res.status(200).json({ 
      isAuthenticated, 
      tenantId, 
      userId,
      email: userData?.email,
      subscription: userData?.subscription_plan || 'free',
      isNewUser: userData?.is_new_user || false,
      subscriptionDetails: subscriptionError ? null : subscriptionData
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Mark User As Not New
router.post('/session/mark-not-new', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }
    
    // Update user record to mark as not new
    const { error } = await supabase
      .from('users')
      .update({
        is_new_user: false,
        updated_at: new Date()
      })
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;