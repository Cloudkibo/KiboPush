/**
 * Created by sojharo on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../../auth/auth.service')
const controller = require('./webhooks.controller')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/edit', auth.isAuthenticated(), controller.edit)
router.post('/enabled', auth.isAuthenticated(), controller.enabled)

module.exports = router
