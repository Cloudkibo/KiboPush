/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./abandoned_carts.controller')

router.get('/',
  auth.isAuthenticated(),
  controller.index) // this id will be userid

router.post('/saveStoreInfo',
  controller.saveStoreInfo) // this id will be userid

module.exports = router
