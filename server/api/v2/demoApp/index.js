const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./demoApp.controller')

router.post('/uploadCustomerInfo',
  auth.isAuthenticated(),
  validate({body: validationSchema.payload}),
  controller.uploadCustomerInfo)

module.exports = router
