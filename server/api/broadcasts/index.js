'use strict';

var express = require('express');

var router = express.Router();

var auth = require('../../auth/auth.service');
var controller = require('./broadcasts.controller');

var logger = require('../../components/logger');

const TAG = 'api/thing/index.js';

router.post('/', auth.isAuthenticated(), controller.index);

router.get('/fetch', function (req, res) {
  logger.serverLog(TAG, 'things api is working');
  // Users.findAll().then(function(data){
  //   res.status(200).json({ status: 'success', data: data });
  // });
  res.status(200).json({hello: 'Hi There'});
});

module.exports = router;
