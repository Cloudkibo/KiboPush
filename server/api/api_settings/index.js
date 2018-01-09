/**
 * Created by sojharo on 24/11/2017.
 */
const express = require('express')

const router = express.Router()

const controller = require('./api_settings.controller')
const auth = require('../../auth/auth.service')

router.post('/', auth.isAuthenticated(), controller.index)
router.post('/enable', auth.isAuthenticated(), controller.enable)
router.post('/disable', auth.isAuthenticated(), controller.disable)
router.post('/reset', auth.isAuthenticated(), controller.reset)

module.exports = router
