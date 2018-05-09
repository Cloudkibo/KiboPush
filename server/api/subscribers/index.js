'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./subscribers.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('manage_subscribers'),
  auth.doesRolePermitsThisAction('subscriberPermission'),
  controller.index)

router.get('/allSubscribers',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('manage_subscribers'),
  auth.doesRolePermitsThisAction('subscriberPermission'),
  controller.allSubscribers)

router.post('/getAll',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('manage_subscribers'),
  auth.doesRolePermitsThisAction('subscriberPermission'),
  controller.getAll)

router.get('/subscribeBack/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('manage_subscribers'),
  auth.doesRolePermitsThisAction('subscriberPermission'),
  controller.subscribeBack)

module.exports = router
