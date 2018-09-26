const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./pages.controller')

router.get('/enable',
  auth.isAuthenticated(),
  validate({body: validationSchema.pagePayload}),
  controller.enable)

router.get('/disable',
  auth.isAuthenticated(),
  validate({body: validationSchema.pagePayload}),
  controller.disable)

module.exports = router
