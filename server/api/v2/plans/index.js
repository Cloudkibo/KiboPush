const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./plans.controller')

router.post('/create',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.create}),
  controller.create)

router.post('/update',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.update}),
  controller.update)

router.post('/changeDefaultPlan',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.changeDefaultPlan}),
  controller.changeDefaultPlan)

router.post('/migrateCompanies',
  auth.isAuthorizedSuperUser(),
  validate({body: validationSchema.migrateCompanies}),
  controller.migrateCompanies)

router.get('/', auth.isAuthorizedSuperUser(), controller.index)

router.delete('/delete/:id', auth.isAuthorizedSuperUser(), controller.delete)

module.exports = router
