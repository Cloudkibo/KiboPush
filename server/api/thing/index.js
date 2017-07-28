'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');

var Users = require('../user/user.model').Users;

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

  User
    .findOrCreate({ where: { fbId: resp.body.id }, defaults: payload })
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
  Users.findAll().then(function(data){
    res.status(200).json({ status: 'success', data: data });
  });
});

module.exports = router;
