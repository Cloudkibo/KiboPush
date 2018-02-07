'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./polls.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.index)

router.post('/create',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.create)

router.post('/report',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.report)

router.post('/send',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.send)

router.get('/responses/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.getresponses)

// below endpoint is for testing only
// router.get('/submitresponse/', controller.submitresponses)

module.exports = router
