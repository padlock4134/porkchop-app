// server/routes/v1/subscription-routes.js
const express = require('express');

const supabase = require('../../providers/supabase-client');

const subscriptionRoutes = express.Router();

// Create or update user subscription
subscriptionRoutes.post('/subscription', async (req, res) => {
  try {
    const { userId, planId } = req.body;
    
    if (!userId || !planId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (userError || !userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user already has a subscription
    const { data: existingSubscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    let result;
    
    // Determine pricing based on plan
    let price = 0;
    let features = [];
    
    switch(planId) {
      case 'pro':
        price = 7.99;
        features = [
          'Advanced recipe suggestions',
          'Unlimited favorite recipes',
          'Extended ingredients database',
          'Advanced meal planning',
          'Shopping list generation',
          'Nutritional information'
        ];
        break;
      case 'family':
        price = 12.99;
        features = [
          'Everything in Pro plan',
          'Up to 5 family accounts',
          'Family meal preferences',
          'Shared shopping lists',
          'Cook together mode',
          'Priority chef assistance'
        ];
        break;
      default: // free plan
        price = 0;
        features = [
          'Basic recipe suggestions',
          'Save up to 5 favorite recipes',
          'Standard ingredients database',
          'Basic meal planning'
        ];
    }
    
    // If subscription exists, update it
    if (existingSubscription) {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          plan_id: planId,
          price: price,
          features: features,
          updated_at: new Date()
        })
        .eq('user_id', userId);
      
      if (updateError) {
        throw updateError;
      }
      
      result = { message: 'Subscription updated successfully' };
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          price: price,
          features: features,
          status: 'active',
          start_date: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        });
      
      if (insertError) {
        throw insertError;
      }
      
      result = { message: 'Subscription created successfully' };
    }
    
    // Also update user's subscription info
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        subscription_plan: planId,
        updated_at: new Date()
      })
      .eq('id', userId);
    
    if (userUpdateError) {
      console.warn('Warning: User record not updated with subscription info', userUpdateError);
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error handling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user subscription info
subscriptionRoutes.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }
    
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no subscription found, return a default free plan
      if (error.code === 'PGRST116') {
        return res.status(200).json({
          user_id: userId,
          plan_id: 'free',
          price: 0,
          features: [
            'Basic recipe suggestions',
            'Save up to 5 favorite recipes',
            'Standard ingredients database',
            'Basic meal planning'
          ],
          status: 'active'
        });
      }
      throw error;
    }
    
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = subscriptionRoutes;