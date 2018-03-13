/**
 * Created by sojharo on 25/09/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./backdoor.controller')
const auth = require('../../auth/auth.service')

router.get('/alluser', auth.isAuthorizedSuperUser(), controller.index)
router.get('/allpages/:userid', auth.isAuthorizedSuperUser(), controller.allpages)
router.get('/allsubscribers/:pageid', auth.isAuthorizedSuperUser(), controller.allsubscribers)
router.get('/allbroadcasts/:userid', auth.isAuthorizedSuperUser(), controller.allbroadcasts)
router.get('/allpolls/:userid', auth.isAuthorizedSuperUser(), controller.allpolls)
router.get('/allsurveys/:userid', auth.isAuthorizedSuperUser(), controller.allsurveys)
router.get('/toppages', auth.isAuthorizedSuperUser(), controller.toppages)
router.get('/datacount/:userid', auth.isAuthorizedSuperUser(), controller.datacount)
router.get('/uploadFile', auth.isAuthorizedSuperUser(), controller.uploadFile)
router.get('/polls/:pollid', auth.isAuthorizedSuperUser(), controller.poll)
router.get('/surveyDetails/:surveyid', auth.isAuthorizedSuperUser(), controller.surveyDetails)
router.get('/broadcastsGraph/:days', auth.isAuthorizedSuperUser(), controller.broadcastsGraph)
router.get('/pollsGraph/:days', auth.isAuthorizedSuperUser(), controller.pollsGraph)
router.get('/surveysGraph/:days', auth.isAuthorizedSuperUser(), controller.surveysGraph)
router.get('/sessionsGraph/:days', auth.isAuthorizedSuperUser(), controller.sessionsGraph)
router.get('/broadcastsByDays/:days', auth.isAuthorizedSuperUser(), controller.broadcastsByDays)
router.get('/surveysByDays/:days', auth.isAuthorizedSuperUser(), controller.surveysByDays)
router.get('/pollsByDays/:days', auth.isAuthorizedSuperUser(), controller.pollsByDays)

module.exports = router
