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
  controller.invite)

router.post('/inviteAdmin',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.invite)

router.post('/removeMember',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.removeMember)

// To Do was in the previous file 
router.post('/removeMemberAdmin',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.removeMember)

router.put('/updateRole',
  auth.isAuthenticated(),
  validate({body: ''}),
  controller.updateRole)

router.post('/updateAutomatedOptions',
  auth.isAuthenticated(),
  auth.hasRole('buyer'),
  controller.updateAutomatedOptions)

router.get('/getAutomatedOptions',
  auth.isAuthenticated(),
  auth.hasRole('buyer'),
  controller.getAutomatedOptions)

router.get('/members',
  auth.isAuthenticated(),
  controller.members)// no diference between get automated options and this 


