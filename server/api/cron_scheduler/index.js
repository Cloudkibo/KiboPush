'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./cron_scheduler.controller')
const auth = require('../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.post('/create',
  auth.isAuthenticated(),
  controller.Create)

router.post('/edit',
  auth.isAuthenticated(),
  controller.Edit)

router.post('/delete',
  auth.isAuthenticated(),
  controller.Delete)

module.exports = router
