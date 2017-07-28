'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');

var Users = require('../user/user.model').Users;
var Pages = require('../pages/pages.model').Pages;

var auth = require('../../auth/auth.service');

const TAG = 'api/thing/index.js';

router.get('/', function (req, res) {
  logger.serverLog(TAG, 'things api is working');
  var payload = {
    name: 'sojharo',
    locale: 'en',
    gender: 'male',
    provider: 'facebook',
    timezone: '5',
    profilePic: 'url',
    email: 'sojharo@live.com'
  };

  Users
    .findOrCreate({ where: { id: 1 }, defaults: payload })
    .spread((user, created) => {
      logger.serverLog(TAG, 'User created: ' + created);
      res.status(200).json({ status: 'success', payload: user });
    });
});

router.get('/fetch', function (req, res) {
  logger.serverLog(TAG, 'things api is working');
  Users.findAll().then(function(data){
    res.status(200).json({ status: 'success', data: data });
  });
});

router.get('/update', function (req, res) {
  logger.serverLog(TAG, 'things api is working');
  Users.update({
    name: 'mangi'
  }, {
    where: {
      id: 1
    }
  }).then(function (pages) {
    logger.serverLog(TAG, pages);
    if (!pages) {
      return res.status(404).json({ status: 'failed', description: 'Some error occurred' });
    }
    logger.serverLog(TAG, 'user object sent to client');
    res.status(200).json({ status: 'success', payload: pages });
  });
});

router.get('/associate', function (req, res) {
  // NOTE: this is for local side testing of creating associations
  // run the first route for creating user
  Pages
    .findOrCreate({
      where: {id: 1},
      defaults: {
        pageId: 1,
        pageName: 'page sojharo',
        accessToken: 'access token',
        user: 1
      }
    })
    .spread((page, created) => {
      logger.serverLog(TAG, page);
      logger.serverLog(TAG, 'Page created: ' + created);
      res.status(200).json({ status: 'success', payload: page });
    });
});

module.exports = router;
