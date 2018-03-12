'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./autoposting_messages.controller')
const auth = require('../../auth/auth.service')

router.get('/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('autoposting'),
  auth.doesRolePermitsThisAction('autopostingPermission'),
  controller.index)

module.exports = router
