const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./permissions_plan.controller')

router.post('/create',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.create}),
  controller.create)

router.post('/update',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.update}),
  controller.update)

router.get('/:id',
    auth.isAuthorizedSuperUser(),
    controller.index)

module.exports = router
