const express = require('express');
const { CallbackResultType } = require('@wristband/express-auth');

const wristband = require('../../providers/wristband-client');
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

    // Send the user back into the React application.
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
