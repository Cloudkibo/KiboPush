'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');
var controller = require('./broadcasts.controller');
var auth = require('../../auth/auth.service');
const TAG = 'api/thing/index.js';



router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/edit', controller.edit);
router.post('/send', controller.send);

/* Seed Pages */
router.get('/seed', controller.seed);


module.exports = router;
