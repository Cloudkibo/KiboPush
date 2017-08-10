'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../../components/logger');
const controller = require('./polls.controller');
const auth = require('../../auth/auth.service');
const TAG = 'api/polls/index.js';

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/create', auth.isAuthenticated(), controller.create);
router.post('/report', auth.isAuthenticated(), controller.report);
router.post('/send', auth.isAuthenticated(), controller.send);
router.get('/responses/:id', controller.getresponses);
router.get('/submitresponse/', controller.submitresponses);
/* Seed Pages */
router.get('/seed', controller.seed);

module.exports = router;
