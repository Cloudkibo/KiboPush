'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./templates.controller')
const auth = require('../../auth/auth.service')

router.get('/allPolls', auth.isAuthenticated(), controller.allPolls)
router.post('/createPoll', auth.isAuthorizedSuperUser(), controller.createPoll)
router.post('/createSurvey', auth.isAuthorizedSuperUser(), controller.createSurvey)
router.get('/allSurveys', auth.isAuthenticated(), controller.allSurveys)
router.post('/createCategory', auth.isAuthenticated(), controller.createCategory)
router.get('/allCategories', auth.isAuthenticated(), controller.allCategories)
router.get('/surveyDetails/:surveyid', auth.isAuthenticated(), controller.surveyDetails)
router.get('/pollDetails/:pollid', auth.isAuthenticated(), controller.pollDetails)
router.delete('/deletePoll/:id', auth.isAuthorizedSuperUser(), controller.deletePoll)
router.delete('/deleteSurvey/:id', auth.isAuthorizedSuperUser(), controller.deleteSurvey)
router.delete('/deleteCategory/:id', auth.isAuthenticated(), controller.deleteCategory)
router.post('/editCategory', auth.isAuthenticated(), controller.editCategory)
router.post('/editPoll', auth.isAuthorizedSuperUser(), controller.editPoll)
router.post('/editSurvey', auth.isAuthorizedSuperUser(), controller.editSurvey)

router.post('/createBroadcast', auth.isAuthenticated(), controller.createBroadcast)
router.get('/allBroadcasts', auth.isAuthenticated(), controller.allBroadcasts)
router.get('/getAllBroadcasts', auth.isAuthenticated(), controller.getAllBroadcasts) // pagination
router.post('/editBroadcast', auth.isAuthenticated(), controller.editBroadcast)
router.delete('/deleteBroadcast/:id', auth.isAuthenticated(), controller.deleteBroadcast)
router.get('/broadcastDetails/:broadcastid', auth.isAuthenticated(), controller.broadcastDetails)

router.post('/createBot', auth.isAuthenticated(), controller.createBotTemplate)
router.get('/allBots', auth.isAuthenticated(), controller.allBots)
router.post('/editBot', auth.isAuthenticated(), controller.editBot)
router.delete('/deleteBot/:id', auth.isAuthenticated(), controller.deleteBot)
router.get('/botDetails/:botid', auth.isAuthenticated(), controller.botDetails)

// todo this is temporary template for DNC, this would be made data driven using above routes
router.get('/getPoliticsBotTemplate', auth.isAuthenticated(), controller.getPoliticsBotTemplate)

module.exports = router
