/**
 * Created by sojharo on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./webhooks.controller')

router.post('/create', auth.isAuthenticated(), controller.create)

module.exports = router
