/**
 * Created by sojharo on 20/07/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production

var express = require('express'),
  app = express(),
  httpapp = express(),
  path = require('path'),
  config = require('./config/environment/index'),
  logger = require('./components/logger'),
  fs = require('fs'),
  mongoose = require('mongoose');


const TAG = 'app.js';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// TODO refactor this file for https code... testing now

var options = {
  cert: ''
};

if(process.env.NODE_ENV === 'production'){
  options.cert = fs.readFileSync('/etc/letsencrypt/live/app.kibopush.com/fullchain.pem');
}

var server = require('http').createServer(httpapp);
var httpsServer = require('https').createServer(options, app);

httpapp.get('*', (req, res) => {
 res.redirect('https://app.kibopush.com' + req.url);
});

require('./config/express')(app);
require('./routes')(app);

//app.listen(config.port);

server.listen(config.port, config.ip, function () {
  logger.serverLog(TAG, 'KiboPush server STARTED on ' + config.port + ' in ' + config.env + ' mode');
});

httpsServer.listen(config.secure_port, function(){
  logger.serverLog(TAG, 'KiboPush server STARTED on ' + config.secure_port + ' in ' + config.env + ' mode');
});

if (config.env === 'production') {
  console.log('KiboPush server STARTED on %s in %s mode', config.port, config.env);
}
