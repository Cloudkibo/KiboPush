'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./autopostings.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('autoposting'),
  auth.doesRolePermitsThisAction('autopostingPermission'),
  controller.index)

router.post('/create',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('autoposting'),
  auth.doesRolePermitsThisAction('autopostingPermission'),
  controller.create)

router.post('/edit',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('autoposting'),
  auth.doesRolePermitsThisAction('autopostingPermission'),
  controller.edit)

router.delete('/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('autoposting'),
  auth.doesRolePermitsThisAction('autopostingPermission'),
  controller.destroy)

router.post('/twitter', controller.twitterwebhook)
router.get('/twitter', controller.twitterverify)

router.post('/pubsub/webhook', controller.pubsubhookPost)
router.get('/pubsub/webhook', controller.pubsubhook)

module.exports = router
