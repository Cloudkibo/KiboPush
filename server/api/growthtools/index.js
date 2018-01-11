'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./growthTools.controller')
const auth = require('../../auth/auth.service')

const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/upload', auth.isAuthenticated(), multipartyMiddleware, controller.upload)
router.post('/sendNumbers', auth.isAuthenticated(), controller.sendNumbers)

module.exports = router
