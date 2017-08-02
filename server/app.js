/**
 * Created by sojharo on 20/07/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production

var express = require('express'),
  app = express(),
  path = require('path'),
  config = require('./config/environment/index'),
  logger = require('./components/logger'),
  mongoose = require('mongoose');
  const router = express.Router();
var subdomain = require('express-subdomain');

const TAG = 'app.js';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

require('./config/express')(app);
require('./routes')(app);

app.use(subdomain('app', router));
app.listen(config.port);

logger.serverLog(TAG, 'KiboPush server STARTED on ' + config.port + ' in ' + config.env + ' mode');

if (config.env === 'production') {
  console.log('KiboPush server STARTED on %s in %s mode', config.port, config.env);
}
