const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./menu.controller')

router.get('/',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('menu'),
  auth.doesRolePermitsThisAction('menuPermission'),
  controller.index)

router.get('/indexByPage/:id',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('menu'),
  auth.doesRolePermitsThisAction('menuPermission'),
  controller.indexByPage)

router.post('/create',
  auth.isAuthenticated(),
  auth.doesPlanPermitsThisAction('menu'),
  auth.doesRolePermitsThisAction('menuPermission'),
  validate({body: validationSchema.menuPayload}),
  controller.create)

module.exports = router
