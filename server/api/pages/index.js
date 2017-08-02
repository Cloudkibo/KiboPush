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

router.get('/',auth.isAuthenticated(), controller.index); //this id will be userid
router.get('/otherPages', auth.isAuthenticated(),controller.otherPages);
router.post('/enable',auth.isAuthenticated(),controller.enable);
router.post('/disable',auth.isAuthenticated(),controller.disable);
router.post('/addpages',auth.isAuthenticated(),controller.addPages);


/* Seed Pages */
router.get('/seed', controller.seed);

module.exports = router;
