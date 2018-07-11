'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./plans.controller')

router.get('/populatePlans', controller.populatePlan)

module.exports = router
