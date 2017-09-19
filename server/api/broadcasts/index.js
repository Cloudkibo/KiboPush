'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./broadcasts.controller')
const controller2 = require('./broadcasts2.controller')
const auth = require('../../auth/auth.service')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/sendConversation', auth.isAuthenticated(), multipartyMiddleware, controller2.sendConversation)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/webhook', controller.getfbMessage)
router.get('/webhook', controller.verifyhook)
router.post('/pubsub/webhook', controller.pubsubhook)
router.post('/uploadfile', auth.isAuthenticated(), multipartyMiddleware, controller.uploadfile)
router.get('/downloadfile/:id', controller.download)
router.post('/deletefile', auth.isAuthenticated(), controller.deletefile)
router.get('/:id', controller.show)
module.exports = router
