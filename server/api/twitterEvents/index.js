'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./twitter.controller')

router.post('/twitter', controller.twitterwebhook)
router.get('/twitter', controller.twitterverify)

module.exports = router
