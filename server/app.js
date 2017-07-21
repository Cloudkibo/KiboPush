/**
 * Created by sojharo on 20/07/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  path = require('path'),
  config = require('./config');

require('./config/express')(app);
require('./routes')(app);

// TODO move this to routes module
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(config.port);

console.log('RESTful API server started on %s in %s mode', config.port, app.get('env'));
