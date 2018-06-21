'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./bots.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.index)

router.get('/waitingReply',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.waitingReply)

router.post('/create',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.create)

router.post('/edit',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.edit)

router.post('/updateStatus',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.status)

router.post('/updateStatus',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.status)

router.post('/botDetails',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.details)

router.post('/delete',
  auth.isAuthenticated(),
  // auth.doesPlanPermitsThisAction('workflows'),
  // auth.doesRolePermitsThisAction('workflowPermission'),
  controller.delete)

router.post('/savePendingSubscribersQueue',
    auth.isAuthenticated(),
    // auth.doesPlanPermitsThisAction('workflows'),
    // auth.doesRolePermitsThisAction('workflowPermission'),
    controller.savePendingSubscribersQueue)

// router.post('/report', controller.report);
// router.post('/send', controller.send);

module.exports = router
