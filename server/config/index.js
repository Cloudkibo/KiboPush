/**
 * Created by sojharo on 20/07/2017.
 */

var path = require('path');
var _ = require('lodash');

module.exports = {

  env: process.env.NODE_ENV,

  // Project root path
  root: path.normalize(__dirname + '/../..'),

  // Server port
  port: process.env.PORT || 3000,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  facebook: {
    clientID:     process.env.FACEBOOK_ID || '456637644436523',
    clientSecret: process.env.FACEBOOK_SECRET || 'f46495b908b408bc8e4f5b259b18e952',
    callbackURL:  (process.env.DOMAIN || 'https://api.cloudkibo.com') + '/auth/facebook/callback'
  }
};
