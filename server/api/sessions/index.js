/**
 * Created by sojharo on 16/10/2017.
 */
'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./sessions.controller')
const auth = require('../../auth/auth.service')

router.post('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.index)

router.get('/markread/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.markread)

router.get('/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.show)

module.exports = router
