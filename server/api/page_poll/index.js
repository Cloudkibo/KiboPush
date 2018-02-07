/**
 * Created by sojharo on 01/08/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./page_poll.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.index)

router.get('/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('polls'),
  auth.doesRolePermitsThisAction('pollsPermission'),
  controller.show)

module.exports = router
