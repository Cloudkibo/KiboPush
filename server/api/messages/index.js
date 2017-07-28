/**
 * Created by sojharo on 20/07/2017.
 */

'use strict';

var express = require('express');

var router = express.Router();

var auth = require('../../auth/auth.service');
var controller = require('./messages.controller');

var logger = require('../../components/logger');

const TAG = 'api/messages/index.js';

// TODO, we should follow the code conventions, either use router.route
// or use router.post. The following two lines are not similar

router.route('/chatwebhook').post(controller.getfbMessage);
router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;
