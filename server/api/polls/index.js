'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./polls.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/report', auth.isAuthenticated(), controller.report)
router.post('/send', auth.isAuthenticated(), controller.send)
router.get('/responses/:id', auth.isAuthenticated(), controller.getresponses)
// below endpoint is for testing only
router.get('/submitresponse/', controller.submitresponses)

module.exports = router
