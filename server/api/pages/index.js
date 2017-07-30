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

router.get('/', controller.index);
router.get('/otherPages',  controller.otherPages);
router.post('/enable', controller.enable);
router.post('/disable', controller.disable);



/* Seed Pages */
router.get('/seed', controller.seed);

module.exports = router;
