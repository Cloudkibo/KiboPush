'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../../components/logger');
const controller = require('./subscribers.controller');
const auth = require('../../auth/auth.service');
const TAG = 'api/subscribers/index.js';


router.get('/', controller.index);

/* Seed Pages */
router.get('/seed', controller.seed);


module.exports = router;
