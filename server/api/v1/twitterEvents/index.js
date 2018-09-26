'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./twitter.controller')

router.post('/twitterAutoposting', controller.twitterwebhook)
router.get('/findAutoposting', controller.findAutoposting)

module.exports = router
