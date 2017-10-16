'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./livechat.controller')
const auth = require('../../auth/auth.service')

router.post('/geturlmeta', auth.isAuthenticated(), controller.geturlmeta)

module.exports = router
