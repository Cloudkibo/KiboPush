const express = require('express')
const router = express.Router()
const auth = require('../../../auth/auth.service')
const validate = require('express-jsonschema').validate

const validationSchema = require('./validationSchema')
const controller = require('./companyProfile.controller')

router.get('/',
  auth.isAuthenticated(),
  controller.index)

router.post('/invite',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.enable)

router.post('/inviteAdmin',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.invite)

router.post('/removeMember',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.removeMember)

router.post('/updateRole',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.updateRole)


