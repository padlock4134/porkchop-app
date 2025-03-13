const express = require('express');

const router = express.Router();

// Get Session Route
router.get('/session', async (req, res, next) => {
  try {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
  
    // Return any initial session data needed by React in here.
    const { isAuthenticated, tenantId, userId } = req.session;
    return res.status(200).json({ isAuthenticated, tenantId, userId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
