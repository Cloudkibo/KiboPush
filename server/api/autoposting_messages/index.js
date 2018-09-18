'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./autoposting_messages.controller')
const auth = require('../../auth/auth.service')

router.post('/getMessages/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('autoposting'),
  auth.doesRolePermitsThisAction('autopostingPermission'),
  controller.getMessages)

module.exports = router
