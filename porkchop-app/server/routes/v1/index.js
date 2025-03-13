const express = require('express');

const analyticsRoutes = require('./analytics-routes');
const chefFreddieRoutes = require('./chef-freddie-routes');
const recipeRoutes = require('./recipes-routes');
const sessionRoutes = require('./session-routes');

const protectedRoutes = express.Router();

protectedRoutes.use(analyticsRoutes);
protectedRoutes.use(chefFreddieRoutes);
protectedRoutes.use(recipeRoutes);
protectedRoutes.use(sessionRoutes);

module.exports = protectedRoutes;
