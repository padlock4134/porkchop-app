// server/routes/auth/auth-routes.js
const express = require('express');
const { CallbackResultType } = require('@wristband/express-auth');

const wristband = require('../../providers/wristband-client');
const supabase = require('../../providers/supabase-client');
const { createCsrfSecret, updateCsrfTokenAndCookie } = require('../../utils/csrf');

const authRoutes = express.Router();

// Login route
authRoutes.get('/login', async (req, res, next) => {
  try {
    // This will redirect to the Wristband Authorize Endpoint to start the login process.
    await wristband.login(req, res, { defaultTenantDomainName: 'global' });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Register route - for direct API registration without Wristband
authRoutes.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Add user to users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: email,
        created_at: new Date(),
        updated_at: new Date(),
        is_new_user: true, // Flag to identify new users for pricing page
        subscription_plan: 'free' // Default plan
      });
    
    if (userError) {
      console.error('Error creating user record:', userError);
    }
    
    // Create session for new user
    req.session.isAuthenticated = true;
    req.session.userId = data.user.id;
    req.session.tenantId = data.user?.app_metadata?.tenant_id || 'default';
    req.session.csrfSecret = createCsrfSecret();
    
    await req.session.save();
    
    updateCsrfTokenAndCookie(req, res);
    
    // Return success with redirect flag to pricing page
    return res.status(201).json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email 
      },
      isNewUser: true,
      redirectTo: '/pricing'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Auth callback route
authRoutes.get('/callback', async (req, res, next) => {
  try {
    // After the user authenticates, exchange the incoming authorization code for tokens and also retrieve userinfo.
    const callbackResult = await wristband.callback(req, res);
    const { callbackData, result } = callbackResult;

    // The SDK will have already invoked the redirect() function, so we just stop execution here.
    if (result === CallbackResultType.REDIRECT_REQUIRED) {
      return;
    }

    // Otherwise, we save any necessary data for the user's app session into a session cookie.
    req.session.isAuthenticated = true;
    req.session.accessToken = callbackData.accessToken;
    // Convert the "expiresIn" seconds into an expiration date with the format of milliseconds from the epoch.
    req.session.expiresAt = Date.now() + callbackData.expiresIn * 1000;
    req.session.refreshToken = callbackData.refreshToken;
    req.session.userId = callbackData.userinfo.sub;
    req.session.tenantId = callbackData.userinfo.tnt_id;
    req.session.identityProviderName = callbackData.userinfo.idp_name;
    req.session.tenantDomainName = callbackData.tenantDomainName;
    req.session.csrfSecret = createCsrfSecret();

    await req.session.save();

    updateCsrfTokenAndCookie(req, res);

    // Check if this is a new user
    const { data: userData } = await supabase
      .from('users')
      .select('is_new_user')
      .eq('id', callbackData.userinfo.sub)
      .single();

    // If new user or no user data found (indicating new user), redirect to pricing page
    if (!userData || userData.is_new_user) {
      // If user doesn't exist in our database yet, create them
      if (!userData) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: callbackData.userinfo.sub,
            email: callbackData.userinfo.email,
            created_at: new Date(),
            updated_at: new Date(),
            is_new_user: true,
            subscription_plan: 'free'
          });
          
        if (userError) {
          console.error('Error creating user record:', userError);
        }
      }
      
      // Send the user to pricing page
      return res.redirect(`${process.env.REACT_APP_DOMAIN_URL}/pricing`);
    }

    // Send existing users back into the main application.
    res.redirect(callbackData.returnUrl || `${process.env.REACT_APP_DOMAIN_URL}/dashboard`);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Logout route
authRoutes.get('/logout', async (req, res, next) => {
  const { session } = req;
  const { refreshToken } = session;

  // Always clear the session and CSRF cookies.
  res.clearCookie('session');
  res.clearCookie('XSRF-TOKEN');
  session.destroy();

  try {
    // This will redirect to Wristband's Logout Endpoint, which will ultimately land them on the Login Page.
    return await wristband.logout(req, res, { tenantDomainName: 'global', refreshToken });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = authRoutes;