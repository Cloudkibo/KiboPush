'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./subscribers.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)

/* Seed Pages */
router.get('/seed', controller.seed)

module.exports = router
