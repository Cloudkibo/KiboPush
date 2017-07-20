/**
 * Created by sojharo on 20/07/2017.
 */

'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
  res.json(200, { status: 'success' });
});

module.exports = router;
