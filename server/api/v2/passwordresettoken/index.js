const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./passwordresettoken.controller')

router.post('/change',
  validate({body: validationSchema.updatePasswordSchema}),
  auth.isAuthenticated(),
  controller.change)

router.post('/forgot',
  validate({body: validationSchema.forgotPasswordSchema}),
  controller.forgot)

router.post('/reset',
  validate({body: validationSchema.updatePasswordSchema}),
  controller.reset)

router.get('/verify/:id', controller.verify)

module.exports = router
