/**
 * Created by sojharo on 24/11/2017.
 */
const express = require('express')

const router = express.Router()

const controller = require('./api_settings.controller')
const auth = require('../../../auth/auth.service')

const validate = require('express-jsonschema').validate
const validationSchema = require('./validationSchema')

router.post('/',
  auth.isAuthenticated(),
  validate({body: validationSchema.indexPayload}),
  controller.index)

router.post('/enable',
  auth.isAuthenticated(),
  validate({body: validationSchema.indexPayload}),
  controller.enable)

router.post('/disable',
  auth.isAuthenticated(),
  validate({body: validationSchema.indexPayload}),
  controller.disable)

router.post('/reset',
  auth.isAuthenticated(),
  validate({body: validationSchema.indexPayload}),
  controller.reset)

module.exports = router
