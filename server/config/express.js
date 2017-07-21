/**
 * Created by sojharo on 21/07/2017.
 */

/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var cookieParser = require('cookie-parser');
//var errorHandler = require('errorhandler');
var path = require('path');
//var passport = require('passport');
var helmet = require('helmet');

var config = require('./index');

module.exports = function(app) {
  var env = app.get('env');


  app.use(compression()); // middleware to compress response body to optimize app
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(config.root, 'client/public')));
  app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  app.use(methodOverride());
  // app.use(cookieParser());
  // app.use(passport.initialize());

  if ('production' === env) {

    /**
     * Helmet can help protect your app from some
     * well-known web vulnerabilities by setting
     * HTTP headers appropriately.
     */

    app.use(helmet());

  }

  if ('development' === env || 'test' === env) {

    /**
     * HTTP request logger
     */

    app.use(morgan('dev'));

    // app.use(require('connect-livereload')());
    //app.use(errorHandler()); // Error handler - has to be last
  }
};
