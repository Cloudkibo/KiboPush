'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./usage.controller')
const auth = require('../../../auth/auth.service')

router.get('/populatePlanUsage', controller.populatePlanUsage)
router.get('/populateCompanyUsage', controller.populateCompanyUsage)
router.get('/:id', auth.isAuthorizedSuperUser(), controller.index)
router.post('/update', auth.isAuthorizedSuperUser(), controller.update)
router.post('/create', auth.isAuthorizedSuperUser(), controller.create)

module.exports = router
