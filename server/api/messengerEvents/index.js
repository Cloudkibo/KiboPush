'use strict'

const express = require('express')
const router = express.Router()
const seenController = require('./seen.controller')
const pollController = require('./pollResponse.controller')
const surveyController = require('./surveyResponse.controller')

router.post('/seen', seenController.seen)
router.post('/pollResponse', pollController.pollResponse)
router.post('/surveyResponse', surveyController.surveyResponse)

module.exports = router
