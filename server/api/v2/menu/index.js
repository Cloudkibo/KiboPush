const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./menu.controller')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.post('/indexByPage',
  auth.isAuthenticated(),
  controller.indexByPage)

router.post('/create',
  auth.isAuthenticated(),
  validate({body: validationSchema.menuPayload}),
  controller.create)

module.exports = router
