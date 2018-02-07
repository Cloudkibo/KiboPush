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
router.post('/signup', controller.create)
router.post('/joinCompany', controller.joinCompany)
router.get('/fbAppId', auth.isAuthenticated(), controller.fbAppId)

module.exports = router
