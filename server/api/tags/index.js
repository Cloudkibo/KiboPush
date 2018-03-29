/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./tags.controller')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.post('/',
  auth.isAuthenticated(),
  controller.create)

router.post('/rename',
  auth.isAuthenticated(),
  controller.rename)

router.post('/delete',
  auth.isAuthenticated(),
  controller.delete)

router.post('/assign',
  auth.isAuthenticated(),
  controller.assign)

router.post('/unassign',
  auth.isAuthenticated(),
  controller.unassign)

module.exports = router
