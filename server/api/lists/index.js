/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./lists.controller')

router.get('/allLists',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('customer_matching'),
  auth.doesRolePermitsThisAction('customerMatchingPermission'),
  controller.allLists)
// todo this is also coded very badly
//  router.get('/otherPages', auth.isAuthenticated(), controller.otherPages)
// todo remove this, this is not being used, discuss
router.post('/createList',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('customer_matching'),
  auth.doesRolePermitsThisAction('customerMatchingPermission'),
  controller.createList)
module.exports = router
