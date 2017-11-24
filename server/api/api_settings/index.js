/**
 * Created by sojharo on 24/11/2017.
 */
const express = require('express')

const router = express.Router()

const controller = require('./api_settings.controller')
const auth = require('../../auth/auth.service')

router.post('/enable', auth.isAuthenticated(), controller.enable)
router.post('/disable', auth.isAuthenticated(), controller.disable)

module.exports = router
