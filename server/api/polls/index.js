'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');
var controller = require('./polls.controller');
var auth = require('../../auth/auth.service');
const TAG = 'api/polls/index.js';



router.get('/', controller.index);
router.post('/create', controller.create);
router.post('/report', controller.report);
router.post('/send', controller.send);

/* Seed Pages */
router.get('/seed', controller.seed);


module.exports = router;
