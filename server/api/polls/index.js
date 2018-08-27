'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./polls.controller')
const auth = require('../../auth/auth.service')

router.post('/allPolls',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.allPolls)

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

router.post('/sendPollDirectly',
    auth.isAuthenticated(),
    auth.doesPlanPermitsThisAction('polls'),
    auth.doesRolePermitsThisAction('pollsPermission'),
    controller.sendPoll)

router.get('/responses/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.getresponses)

router.get('/allResponses',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.getAllResponses)

router.delete('/deletePoll/:id',
    auth.isAuthenticated(),
    auth.doesPlanPermitsThisAction('polls'),
    auth.doesRolePermitsThisAction('pollsPermission'),
    controller.deletePoll)
// below endpoint is for testing only
// router.get('/submitresponse/', controller.submitresponses)

module.exports = router
