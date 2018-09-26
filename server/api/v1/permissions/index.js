'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./permissions.controller')
const auth = require('../../../auth/auth.service')

router.get('/fetchPermissions',
    auth.isAuthenticated(),
    controller.fetchPermissions)

router.post('/updatePermissions',
    auth.isAuthenticated(),
    auth.hasRole('buyer'),
    controller.updatePermissions)

router.get('/populateRolePermissions', controller.populateRolePermissions)
router.get('/:role', auth.isAuthenticated(), controller.index)
router.post('/update', auth.isAuthenticated(), controller.update)
router.post('/create', auth.isAuthenticated(), controller.create)

module.exports = router
