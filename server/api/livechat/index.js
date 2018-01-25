'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./livechat.controller')
const auth = require('../../auth/auth.service')

router.post('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.create)

router.post('/updateUrl',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.update)

router.post('/getUrlMeta',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.geturlmeta)

router.get('/:session_id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('live_chat'),
  auth.doesRolePermitsThisAction('livechatPermission'),
  controller.index)

module.exports = router
