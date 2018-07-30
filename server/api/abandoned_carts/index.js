/**
 * Created by sojharo on 27/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()
const validationSchema = require('./validationSchema')
const auth = require('../../auth/auth.service')
const controller = require('./abandoned_carts.controller')
const validate = require('express-jsonschema').validate

router.get('/getStores',
  auth.isAuthenticated(),
  controller.index) // this id will be userid

router.get('/abandonedCheckouts',
  auth.isAuthenticated(),
  controller.abandonedCheckouts) // this id will be userid

router.post('/saveStoreInfo',
  auth.isAuthenticated(),
  validate({body: validationSchema.storeInfoSchema}),
  controller.saveStoreInfo)

router.post('/saveCartInfo',
  auth.isAuthenticated(),
  validate({body: validationSchema.cartInfoSchema}),
  controller.saveCartInfo)

router.post('/saveCheckoutInfo',
  auth.isAuthenticated(),
  validate({body: validationSchema.checkoutInfoSchema}),
  controller.saveCheckoutInfo)

module.exports = router
