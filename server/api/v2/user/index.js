const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./user.controller')

router.get('/updateChecks',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.updateChecks)

router.get('/updateSkipConnect',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.updateSkipConnect)

router.post('/updateMode',
    auth.isAuthenticated(),
    validate({body: ''}),
    controller.updateMode)

router.get('/fbAppId',
    auth.isAuthenticated(),
    validate({body: ''},
    controller.fbAppId))

router.post('/authenticatePassword',
    auth.isAuthenticated(),
    validate({body: ''}),
    controller.authenticatePassword)

router.get('/addAccountType',
    auth.isAuthenticated(),
    validate({body: ''}),
    controller.addAccountType)

router.get('/enableDelete',
    auth.isAuthenticated(),
    validate({body: ''}),
    controller.enableDelete)

router.get('/cancelDeletion',
    auth.isAuthenticated(),
    validate({body: ''}),
    controller.cancelDeletion)
