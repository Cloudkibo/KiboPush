/**
 * Created by sojharo on 20/07/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production
process.env.MIGRATION = process.env.MIGRATION || 'false';

var express = require('express'),
  app = express(),
  path = require('path'),
  config = require('./config/environment/index'),
  logger = require('./components/logger');

const TAG = 'app.js';

if(process.env.MIGRATION === 'true') {
  require('./config/migrations');
  return ;
}

require('./config/express')(app);
require('./routes')(app);

app.listen(config.port);

logger.serverLog(TAG, 'KiboPush server STARTED on ' + config.port + ' in ' + config.env + ' mode');

if (config.env === 'production') {
  console.log('KiboPush server STARTED on %s in %s mode', config.port, config.env);
}
