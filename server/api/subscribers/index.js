'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');
var controller = require('./subscribers.controller');
var auth = require('../../auth/auth.service');
const TAG = 'api/subscribers/index.js';



router.get('/', controller.index);

/* Seed Pages */
router.get('/seed', controller.seed);


module.exports = router;
