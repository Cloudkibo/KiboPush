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

module.exports = router
