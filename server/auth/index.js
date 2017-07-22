/**
 * Created by sojharo on 20/07/2017.
 */
'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../components/logger');

const TAG = 'auth/index.js';

router.get('/', function (req, res) {
  logger.serverLog(TAG, 'going to serve landing page');
  res.json(200, { status: 'success' });
});

module.exports = router;
