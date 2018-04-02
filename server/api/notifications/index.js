'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./notifications.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)

module.exports = router
