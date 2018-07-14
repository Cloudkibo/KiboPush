'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./permissions_plan.controller')
const auth = require('../../auth/auth.service')

router.get('/populatePlanPermissions', controller.populatePlanPermissions)
router.get('/:id', auth.isAuthorizedSuperUser(), controller.index)
router.post('/update', auth.isAuthorizedSuperUser(), controller.update)
router.post('/create', auth.isAuthorizedSuperUser(), controller.create)

module.exports = router
