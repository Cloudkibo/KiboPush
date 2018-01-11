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
router.get('/surveyDetails/:surveyid', auth.isAuthenticated(), controller.surveyDetails)
router.get('/pollDetails/:pollid', auth.isAuthenticated(), controller.pollDetails)
router.delete('/deletePoll/:id', auth.isAuthorizedSuperUser(), controller.deletePoll)
router.delete('/deleteSurvey/:id', auth.isAuthorizedSuperUser(), controller.deleteSurvey)
router.delete('/deleteCategory/:id', auth.isAuthorizedSuperUser(), controller.deleteCategory)
router.post('/editPoll', auth.isAuthorizedSuperUser(), controller.editPoll)
router.post('/editSurvey', auth.isAuthorizedSuperUser(), controller.editSurvey)
router.post('/createBroadcast', auth.isAuthorizedSuperUser(), controller.createBroadcast)
router.get('/allBroadcasts', auth.isAuthenticated(), controller.allBroadcasts)
router.post('/editBroadcast', auth.isAuthorizedSuperUser(), controller.editBroadcast)
router.delete('/deleteBroadcast/:id', auth.isAuthorizedSuperUser(), controller.deleteBroadcast)
router.get('/broadcastDetails/:broadcastid', auth.isAuthenticated(), controller.broadcastDetails)

module.exports = router
