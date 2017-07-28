/**
 * Created by sojharo on 27/07/2017.
 */

'use strict';

var express = require('express');

var router = express.Router();

var auth = require('../../auth/auth.service');
var controller = require('./pages.controller');

var logger = require('../../components/logger');

const TAG = 'api/pages/index.js';

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/enable', auth.isAuthenticated(), controller.enable);
router.post('/disable', auth.isAuthenticated(), controller.disable);

module.exports = router;
