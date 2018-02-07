'use strict'

var express = require('express')
var controller = require('./verificationtoken.controller')

var router = express.Router()
const auth = require('../../auth/auth.service')

router.get('/verify/:id', controller.verify)
router.get('/resend', auth.isAuthenticated(), controller.resend)

module.exports = router
