/**
 * Created by sojharo on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict';

var path = require('path');
var config = require('./config');
var logger = require('./components/logger');

module.exports = function(app) {

  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.get('/login', function(req, res){
    logger.serverLog('routes.js', 'going to serve main react app');
    res.sendFile(path.join(config.root, 'client/index.html'));
  });

  app.get('/', function(req, res){
    logger.serverLog('routes.js', 'going to serve landing page');
    res.sendFile(path.join(config.root, 'client/landing.html'));
  });
};
