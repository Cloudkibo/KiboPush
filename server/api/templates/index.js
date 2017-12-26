'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./templates.controller')
const auth = require('../../auth/auth.service')

router.get('/allPolls', auth.isAuthenticated(), controller.allPolls)
router.post('/createPoll', auth.isAuthenticated(), controller.createPoll)
router.post('/createSurvey', auth.isAuthenticated(), controller.createSurvey)
router.get('/allSurveys', auth.isAuthenticated(), controller.allSurveys)

module.exports = router
