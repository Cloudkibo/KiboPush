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

module.exports = router
