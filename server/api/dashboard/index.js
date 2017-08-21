/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./dashboard.controller')

// todo this is also coded very badly
router.get('/otherPages', auth.isAuthenticated(), controller.otherPages)
// todo remove this, this is not being used, discuss
router.post('/enable', auth.isAuthenticated(), controller.enable)
// todo remove this /disable, this is coded badly discuss with dayem
// router.post('/disable', auth.isAuthenticated(), controller.disable);
router.get('/stats', auth.isAuthenticated(), controller.stats)
// todo remove this, after discuss - this id will be userid, this is bad code
router.get('/:id', auth.isAuthenticated(), controller.index)

module.exports = router
