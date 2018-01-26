'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./workflows.controller')
// const auth = require('../../auth/auth.service')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('workflows'),
  auth.doesRolePermitsThisAction('workflowPermission'),
  controller.index)

router.post('/create',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('workflows'),
  auth.doesRolePermitsThisAction('workflowPermission'),
  controller.create)

router.post('/edit',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('workflows'),
  auth.doesRolePermitsThisAction('workflowPermission'),
  controller.edit)

router.post('/enable',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('workflows'),
  auth.doesRolePermitsThisAction('workflowPermission'),
  controller.enable)

router.post('/disable',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('workflows'),
  auth.doesRolePermitsThisAction('workflowPermission'),
  controller.disable)
// router.post('/report', controller.report);
// router.post('/send', controller.send);

module.exports = router
