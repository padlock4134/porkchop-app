const express = require('express');

const authRoutes = require('./auth/auth-routes');
const protectedRoutes = require('./v1');
const authMiddleware = require('../middleware/auth-middleware');
const csrfMiddleware = require('../middleware/csrf-middleware');

const apiRoutes = express.Router();

/* UNPROTECTED ROUTES */

// All APIs that can be called while unauthenticated.
apiRoutes.use('/auth', authRoutes);
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PorkChop API is running' });
});

/* PROTECTED ROUTES */

// The middlewares here ensure an authenticated user's session and tokens exist and are valid.
apiRoutes.use('/v1', [authMiddleware, csrfMiddleware], protectedRoutes);

module.exports = apiRoutes;
