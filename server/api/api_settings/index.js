/**
 * Created by sojharo on 24/11/2017.
 */
const express = require('express')

const router = express.Router()

const controller = require('./api_settings.controller')
const auth = require('../../auth/auth.service')

router.post('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('api'),
  auth.doesRolePermitsThisAction('apiPermission'),
  controller.index)

router.post('/enable',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('api'),
  auth.doesRolePermitsThisAction('apiPermission'),
  controller.enable)

router.post('/disable',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('api'),
  auth.doesRolePermitsThisAction('apiPermission'),
  controller.disable)

router.post('/reset',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('api'),
  auth.doesRolePermitsThisAction('apiPermission'),
  controller.reset)

module.exports = router
