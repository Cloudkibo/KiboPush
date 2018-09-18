/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()
const auth = require('../../auth/auth.service')
const controller = require('./shopify.controller')
const webhook = require('./webhook.controller')

router.post('/',
  auth.isAuthenticated(),
  controller.index) // this id will be userid

router.get('/callback',
  controller.callback) // this id will be userid

router.post('/checkout-create',
  webhook.handleCheckout) // this id will be userid

router.post('/cart-create',
  webhook.handleCart) // this id will be userid

router.post('/order-create',
  webhook.handleOrder) // this id will be userid

router.post('/app-uninstall',
  webhook.handleAppUninstall) // this id will be userid

router.post('/theme-publish',
  webhook.handleThemePublish) // this id will be userid

router.get('/serveScript',
  webhook.serveScript) // this id will be userid

router.get('/clickCount',
  webhook.clickCount) // this id will be userid

module.exports = router
