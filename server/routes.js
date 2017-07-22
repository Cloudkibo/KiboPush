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

const TAG = 'routes.js';

module.exports = function(app) {

  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.get('/dashboard', function(req, res){
    logger.serverLog(TAG, 'going to serve main react app');
    res.sendFile(path.join(config.root, 'client/index.html'));
  });

  app.get('/', function(req, res){
    logger.serverLog(TAG, 'going to serve landing page');
    res.sendFile(path.join(config.root, 'client/landing.html'));
  });

  app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });
};
