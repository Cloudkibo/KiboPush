'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');

var Users = require('../../models/Users').Users;

const TAG = 'api/thing/index.js';

router.get('/', function (req, res) {
  logger.serverLog(TAG, 'going to serve landing page');
  Users.create({
    firstName: 'John',
    lastName: 'Hancock',
    email: 'what@email.com'
  }).then(function(task) {
    logger.serverLog(TAG, 'created a sample user');
  });
  res.json(200, { status: 'success' });
});

router.get('/fetch', function (req, res) {
  logger.serverLog(TAG, 'going to serve landing page');
  Users.findOne({
    where: {
      firstName: 'Johns'
    },
    attributes: ['email']
  }).then(function(data){
    res.json(200, { status: 'success', data: data });
  });
});

module.exports = router;
