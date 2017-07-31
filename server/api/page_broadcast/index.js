/**
 * Created by sojharo on 01/08/2017.
 */

'use strict';

const express = require('express');

const router = express.Router();

const controller = require('./page_broadcast.controller');
const auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
