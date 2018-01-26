'use strict'

var express = require('express')
var controller = require('./companyprofile.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

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

router.get('/members',
  auth.isAuthenticated(),
  auth.hasRequiredPlan(['plan_C', 'plan_D']),
  auth.doesPlanPermitsThisAction('team_members_management'),
  auth.doesRolePermitsThisAction('membersPermission'),
  controller.members)

module.exports = router
