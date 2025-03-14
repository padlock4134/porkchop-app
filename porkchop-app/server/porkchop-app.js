// server/porkchop-app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { getIronSession } = require('iron-session');

const errorMiddleware = require('./middleware/error-middleware');
const apiRoutes = require('./routes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.REACT_APP_DOMAIN_URL,
  credentials: true // Required for cookies, authorization headers, etc.
}));

// Initialize Iron Session middleware for cookie-based app sessions.
app.use(async (req, res, next) => {
  req.session = await getIronSession(req, res, {
    cookieName: 'session',
    password: process.env.SESSION_COOKIE_SECRET,
    cookieOptions: {
      httpOnly: true,
      maxAge: process.env.SESSION_MAX_AGE,
      path: '/',
      sameSite: 'Lax', // May need to set this to 'Lax' if dealing with CORS in your environment
      secure: process.env.DANGEROUSLY_DISABLE_SECURE_COOKIES !== "true", // IMPORTANT: set to true for production environments!!
    },
  });
  next();
});

// Defined routes for all API endpoints
app.use('/api', apiRoutes);

// Catch-all for any unexpected server-side errors.
app.use(errorMiddleware);

module.exports = app;
