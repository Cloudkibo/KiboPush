'use strict'

var express = require('express')
var controller = require('./companyprofile.controller')
var auth = require('../../auth/auth.service')
var config = require('../../config/environment/index')
var StripeWebhook = require('stripe-webhook-middleware')
var stripeEvents = require('./stripeEvents')
var router = express.Router()

var stripeWebhook = new StripeWebhook({
  stripeApiKey: config.stripeOptions.apiKey,
  respond: true
})

router.get('/',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('companyPermission'),
  controller.index)

router.post('/invite',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('inviteAgentPermission'),
  controller.invite)

// todo WORK ON THIS
router.post('/inviteAdmin',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('inviteAdminPermission'),
  controller.invite)

router.post('/removeMember',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('deleteAgentPermission'),
  controller.removeMember)

// todo WORK ON THIS
router.post('/removeMemberAdmin',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('deleteAdminPermission'),
  controller.removeMember)

router.post('/updateRole',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('updateRolePermission'),
  controller.updateRole)

router.post('/updateAutomatedOptions',
  auth.isAuthenticated(),
  auth.hasRole('buyer'),
  controller.updateAutomatedOptions)

router.get('/members',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('membersPermission'),
  controller.members)

router.post('/setCard', auth.isAuthenticated(), controller.setCard)
router.post('/updatePlan', auth.isAuthenticated(), controller.updatePlan)
router.get('/getKeys', auth.isAuthenticated(), controller.getKeys)

  // use this url to receive stripe webhook events
router.post('/stripe/events',
  stripeWebhook.middleware,
  stripeEvents
)

module.exports = router
