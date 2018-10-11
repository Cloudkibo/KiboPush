const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./commentCapture.controller')

router.get('/',
  controller.index)

router.get('/:id',
  auth.isAuthenticated(),
  controller.viewPost)

router.post('/create',
  validate({body: validationSchema.postPayload}),
  controller.create)

router.post('/edit',
  auth.isAuthenticated(),
  validate({body: validationSchema.postUpdatePayload}),
  controller.edit)

router.delete('/delete/:id',
    auth.isAuthenticated(),
    controller.delete)

module.exports = router
