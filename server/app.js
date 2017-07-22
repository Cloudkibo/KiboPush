/**
 * Created by sojharo on 20/07/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production

var express = require('express'),
  app = express(),
  path = require('path'),
  config = require('./config'),
  logger = require('./components/logger');

require('./config/express')(app);
require('./routes')(app);

app.listen(config.port);

logger.serverLog('app.js', 'KiboPush server STARTED on ' + config.port + ' in ' + config.env + ' mode');

if (config.env === 'production') {
  console.log('KiboPush server STARTED on %s in %s mode', config.port, config.env);
}
