/**
 * Created by sojharo on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict';

var path = require('path');
var config = require('./config/environment/index');
var logger = require('./components/logger');

const TAG = 'routes.js';

module.exports = function(app) {

  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/broadcasts', require('./api/broadcasts'));
  app.use('/api/workflows', require('./api/workflows'));
  app.use('/api/subscribers', require('./api/subscribers'));

  app.use('/auth', require('./auth'));

  app.get('/', function(req, res){
    logger.serverLog(TAG, 'going to serve main react app');
    res.sendFile(path.join(config.root, 'client/index.html'));
  });

  app.get('/dashboard2', function(req, res){
    logger.serverLog(TAG, 'going to serve landing page');
    res.sendFile(path.join(config.root, 'client/landing.html'));
  });

  app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });
};
