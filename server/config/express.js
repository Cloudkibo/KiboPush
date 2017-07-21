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
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var helmet = require('helmet');
//var passport = require('passport');

var config = require('./index');

module.exports = function(app) {
  var env = app.get('env');

  /**
   * middleware to compress response body to optimize app
   * (it is better done on nginx proxy level)
   */

  app.use(compression());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(config.root, 'client/public')));
  app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));

  // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
  app.use(methodOverride());

  // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser());

  // app.use(passport.initialize());

  if (env === 'production') {

    /**
     * Helmet can help protect your app from some
     * well-known web vulnerabilities by setting
     * HTTP headers appropriately.
     */

    app.use(helmet());

  }

  if (env === 'development' || env === 'test') {

    /**
     * HTTP request logger
     */

    app.use(morgan('dev'));

    /**
     * Development-only error handler middleware.
     */

    app.use(errorHandler()); // Error handler - has to be last
  }
};
