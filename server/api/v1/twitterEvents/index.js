'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./twitter.controller')
const auth = require('../../../auth/auth.service')

router.post('/twitterAutoposting', auth.isItWebhookServer(), controller.twitterwebhook)
router.get('/findAutoposting', auth.isItWebhookServer(), controller.findAutoposting)

module.exports = router
