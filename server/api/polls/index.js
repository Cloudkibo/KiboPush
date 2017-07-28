'use strict';

var express = require('express');

var router = express.Router();

var auth = require('../../auth/auth.service');
var controller = require('./polls.controller');

var logger = require('../../components/logger');

const TAG = 'api/polls/index.js';

router.post('/', auth.isAuthenticated(), controller.index);
router.put('/:id', auth.isAuthenticated(), controller.update);

module.exports = router;
