const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./usage.controller')

router.get('/:id', auth.isAuthorizedSuperUser(), controller.index)

router.post('/update',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.editPayload}),
  controller.update)

router.post('/create',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.editPayload}),
  controller.create)

module.exports = router
