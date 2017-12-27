'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./templates.controller')
const auth = require('../../auth/auth.service')

router.get('/allPolls', auth.isAuthenticated(), controller.allPolls)
router.post('/createPoll', auth.isAuthorizedSuperUser(), controller.createPoll)
router.post('/createSurvey', auth.isAuthorizedSuperUser(), controller.createSurvey)
router.get('/allSurveys', auth.isAuthenticated(), controller.allSurveys)
router.post('/createCategory', auth.isAuthorizedSuperUser(), controller.createCategory)
router.get('/allCategories', auth.isAuthenticated(), controller.allCategories)
router.get('/surveyDetails/:surveyid', auth.isAuthorizedSuperUser(), controller.surveyDetails)
router.get('/pollDetails/:pollid', auth.isAuthorizedSuperUser(), controller.pollDetails)

module.exports = router
