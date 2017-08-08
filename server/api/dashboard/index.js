/**
 * Created by sojharo on 27/07/2017.
 */

'use strict';

const express = require('express');

const router = express.Router();

const auth = require('../../auth/auth.service');
const controller = require('./dashboard.controller');

const logger = require('../../components/logger');

const TAG = 'api/pages/index.js';

router.get('/otherPages', auth.isAuthenticated(), controller.otherPages);
router.post('/enable', auth.isAuthenticated(), controller.enable);
router.post('/disable', auth.isAuthenticated(), controller.disable);
router.get('/stats', auth.isAuthenticated(), controller.stats);
router.get('/:id', auth.isAuthenticated(), controller.index); // todo remove this, after discuss - this id will be userid


/* Seed Pages */
router.get('/seed', controller.seed);

module.exports = router;
