'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');

router.get('/', function (req, res) {
  logger.serverLog('api/thing/index.js', 'going to serve landing page');
  res.json(200, { status: 'success' });
});

module.exports = router;
