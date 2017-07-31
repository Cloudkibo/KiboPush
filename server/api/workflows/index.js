'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../../components/logger');
const controller = require('./workflows.controller');
const auth = require('../../auth/auth.service');
const TAG = 'api/polls/index.js';


router.get('/', controller.index);
router.post('/create', controller.create);
// router.post('/report', controller.report);
// router.post('/send', controller.send);

/* Seed Pages */
router.get('/seed', controller.seed);


module.exports = router;
