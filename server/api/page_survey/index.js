/**
 * Created by sojharo on 01/08/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./page_survey.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('surveys'),
  auth.doesRolePermitsThisAction('surveyPermission'),
  controller.index)

router.get('/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('surveys'),
  auth.doesRolePermitsThisAction('surveyPermission'),
  controller.show)

module.exports = router
