/**
 * Created by sojharo on 27/07/2017.
 */

'use strict';

const express = require('express');

const router = express.Router();

const auth = require('../../auth/auth.service');
const controller = require('./pages.controller');

const logger = require('../../components/logger');

const TAG = 'api/pages/index.js';

router.get('/', controller.index);
router.get('/otherPages', controller.otherPages);
router.post('/enable', controller.enable);
router.post('/disable', controller.disable);


/* Seed Pages */
router.get('/seed', controller.seed);

module.exports = router;
