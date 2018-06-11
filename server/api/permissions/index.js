'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./permissions.controller')
const auth = require('../../auth/auth.service')

router.get('/fetchPermissions',
    auth.isAuthenticated(),
    // auth.doesPlanPermitsThisAction('polls'),
    // auth.doesRolePermitsThisAction('pollsPermission'),
    controller.fetchPermissions)

module.exports = router
