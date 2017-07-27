/**
 * Created by sojharo on 20/07/2017.
 */

'use strict';

var express = require('express');

var router = express.Router();

var auth = require('../../auth/auth.service');
var controller = require('./user.controller');

var logger = require('../../components/logger');

const TAG = 'api/user/index.js';

router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;
