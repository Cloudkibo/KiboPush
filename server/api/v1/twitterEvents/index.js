'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./twitter.controller')

router.post('/twitterAutoposting', controller.twitterwebhook)

module.exports = router
