'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./broadcasts.controller')
const controller2 = require('./broadcasts2.controller')
const auth = require('../../auth/auth.service')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/webhook', controller.getfbMessage)
router.get('/webhook', controller.verifyhook)
router.post('/pubsub/webhook', controller.pubsubhook)

router.post('/sendConversation', auth.isAuthenticated(), multipartyMiddleware, controller2.sendConversation)
router.post('/upload', auth.isAuthenticated(), multipartyMiddleware, controller2.upload)
router.get('/download/:id', controller2.download)
router.get('/delete/:id', auth.isAuthenticated(), controller2.delete)
router.get('/:id', controller.show)
module.exports = router
