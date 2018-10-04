'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./automation_queue.controller')
const auth = require('../../../auth/auth.service')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

module.exports = router
