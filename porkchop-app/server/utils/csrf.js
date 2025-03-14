const Tokens = require('csrf');

const csrfTokens = new Tokens();

exports.createCsrfSecret = function () {
  return csrfTokens.secretSync();
};

exports.isCsrfTokenValid = function (req) {
  return csrfTokens.verify(req.session.csrfSecret, req.headers['x-xsrf-token']);
};

// Set a 30 minute CSRF cookie expiration in order to match the session cookie expiration.
// NOTE: If deploying your own app to production, do not disable secure cookies!!
exports.updateCsrfTokenAndCookie = function (req, res) {
  const csrfToken = csrfTokens.create(req.session.csrfSecret);
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false, // Must be set to false.
    maxAge: process.env.SESSION_MAX_AGE * 1000, // Express expects millisecond values here.
    path: '/',
    sameSite: 'Lax', // May need to set this to 'Lax' if dealing with CORS in your environment
    secure: process.env.DANGEROUSLY_DISABLE_SECURE_COOKIES !== "true", // IMPORTANT: set to true for production environments!!
  });
};
