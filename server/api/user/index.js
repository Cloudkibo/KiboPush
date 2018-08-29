/**
 * Created by sojharo on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./user.controller')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/updateChecks', auth.isAuthenticated(), controller.updateChecks)
router.get('/updateSkipConnect', auth.isAuthenticated(), controller.updateSkipConnect)
router.post('/signup', controller.create)
router.post('/joinCompany', controller.joinCompany)
router.post('/updateMode', controller.updateMode)
router.get('/fbAppId', auth.isAuthenticated(), controller.fbAppId)
router.post('/authenticatePassword', auth.isAuthenticated(), controller.authenticatePassword)
router.get('/movePlan', controller.movePlan)
router.post('/enableDelete', auth.isAuthenticated(), controller.enableDelete)
router.get('/cancelDeletion', auth.isAuthenticated(), controller.cancelDeletion)
router.post('/changeUIMode', auth.isAuthenticated(), controller.changeMode)

module.exports = router
