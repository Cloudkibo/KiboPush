'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./permissions_plan.controller')

router.get('/populatePlanPermissions', controller.populatePlanPermissions)

module.exports = router
