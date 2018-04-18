'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./broadcasts.controller')
const controller2 = require('./broadcasts2.controller')
const auth = require('../../auth/auth.service')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('broadcasts'),
  auth.doesRolePermitsThisAction('broadcastPermission'),
  controller.index)

router.post('/webhook', controller.getfbMessage)
router.get('/webhook', controller.verifyhook)

router.post('/sendConversation',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('broadcasts'),
  auth.doesRolePermitsThisAction('broadcastPermission'),
  multipartyMiddleware,
  controller2.sendConversation)

router.post('/upload',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('broadcasts'),
  auth.doesRolePermitsThisAction('broadcastPermission'),
  multipartyMiddleware,
  controller2.upload)

router.get('/download/:id', controller2.download) //
router.get('/delete/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('broadcasts'),
  auth.doesRolePermitsThisAction('broadcastPermission'),
  controller2.delete) //

router.get('/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('broadcasts'),
  auth.doesRolePermitsThisAction('broadcastPermission'),
  controller.show)

module.exports = router
