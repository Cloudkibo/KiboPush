const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./permissions.controller')

router.post('/create',
  auth.isAuthenticated(),
  validate({body: validationSchema.create}),
  controller.create)

router.post('/update',
  auth.isAuthenticated(),
  validate({body: validationSchema.update}),
  controller.update)

router.post('/updatePermissions',
    auth.isAuthenticated(),
    validate({body: validationSchema.updatePermissions}),
    auth.hasRole('buyer'),
    controller.updatePermissions)

router.get('/:role',
        auth.isAuthenticated(),
        controller.index)

router.get('/fetchPermissions',
    auth.isAuthenticated(),
    controller.fetchPermissions)

module.exports = router
