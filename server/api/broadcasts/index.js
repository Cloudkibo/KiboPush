'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../../components/logger');
const controller = require('./broadcasts.controller');
const auth = require('../../auth/auth.service');
const TAG = 'api/broadcasts/index.js';


router.get('/', controller.index);
router.post('/create', controller.create);
router.post('/edit', controller.edit);
router.post('/send', controller.send);
router.get('/:id', controller.show);

/* Seed Pages */
router.get('/seed', controller.seed);


module.exports = router;
