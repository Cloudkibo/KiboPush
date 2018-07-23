/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./pages.controller')

router.get('/',
  auth.isAuthenticated(),
  controller.index) // this id will be userid

module.exports = router
