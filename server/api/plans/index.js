'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./plans.controller')
const auth = require('../../auth/auth.service')

router.get('/populatePlans', controller.populatePlan)
router.get('/', auth.isAuthorizedSuperUser(), controller.index)
router.post('/create', auth.isAuthorizedSuperUser(), controller.create)
router.post('/update', auth.isAuthorizedSuperUser(), controller.update)
router.delete('/delete/:id', auth.isAuthorizedSuperUser(), controller.delete)

module.exports = router
