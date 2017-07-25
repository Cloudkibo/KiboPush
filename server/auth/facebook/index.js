/**
 * Created by sojharo on 24/07/2017.
 */

'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

// TODO add more scopes here specially for pages
router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'public_profile', 'pages_show_list', 'pages_messaging_subscriptions'],
    failureRedirect: '/register',
    session: false
  }))

  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/register',
    session: false
  }), auth.setTokenCookie);

module.exports = router;
