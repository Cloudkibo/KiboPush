/**
 * Created by sojharo on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict';

const path = require('path');
const config = require('./config/environment/index');
const logger = require('./components/logger');

const TAG = 'routes.js';

module.exports = function (app) {
  app.use('/api/dashboard', require('./api/dashboard'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/broadcasts', require('./api/broadcasts'));
  app.use('/api/polls', require('./api/polls'));
  app.use('/api/workflows', require('./api/workflows'));
  app.use('/api/subscribers', require('./api/subscribers'));
  app.use('/api/pages', require('./api/pages'));
  app.use('/api/surveys', require('./api/surveys'));

  app.use('/auth', require('./auth'));

  app.get('/', (req, res) => {
    logger.serverLog(TAG, 'going to serve main react app');
    res.sendFile(path.join(config.root, 'client/index.html'));
  });

  app.get('/dashboard2', (req, res) => {
    logger.serverLog(TAG, 'going to serve landing page');
    res.sendFile(path.join(config.root, 'client/landing.html'));
  });

  app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
  });
};
