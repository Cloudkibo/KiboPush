/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./pages.controller')

router.get('/', auth.isAuthenticated(), controller.index) // this id will be userid
router.get('/allpages', auth.isAuthenticated(), controller.allpages)
router.get('/otherPages', auth.isAuthenticated(), controller.otherPages)
router.post('/enable', auth.isAuthenticated(), controller.enable)
router.post('/disable', auth.isAuthenticated(), controller.disable)
router.get('/addpages', auth.isAuthenticated(), controller.addPages)
router.post('/createWelcomeMessage', auth.isAuthenticated(), controller.createWelcomeMessage)
router.post('/isWelcomeMessageEnabled', auth.isAuthenticated(), controller.isWelcomeMessageEnabled)
module.exports = router
