'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./bots.controller')
// const auth = require('../../auth/auth.service')

router.get('/',
  // auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.index)

router.post('/create',
  // auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.create)

// router.post('/report', controller.report);
// router.post('/send', controller.send);

module.exports = router
