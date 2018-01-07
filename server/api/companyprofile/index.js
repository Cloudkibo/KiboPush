'use strict'

var express = require('express')
var controller = require('./companyprofile.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/invite', auth.isAuthenticated(), controller.invite)
router.post('/removeMember', auth.isAuthenticated(), controller.removeMember)
router.post('/updateRole', auth.isAuthenticated(), controller.updateRole)
router.get('/members', auth.isAuthenticated(), controller.members)
// router.post('/updatecompanyprofile', auth.isAuthenticated(), controller.updatecompanyprofile)
// router.get('/:id', auth.isAuthenticated(), controller.show)
// router.post('/', auth.isAuthenticated(), controller.create)
// router.put('/:id', auth.isAuthenticated(), controller.update)
// router.patch('/:id', controller.update)
// router.delete('/:id', controller.destroy)

module.exports = router
