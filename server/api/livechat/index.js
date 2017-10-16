'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./livechat.controller')
const auth = require('../../auth/auth.service')

router.post('/', auth.isAuthenticated(), controller.create)
router.post('/updateUrl', auth.isAuthenticated(), controller.update)
router.post('/getUrlMeta', auth.isAuthenticated(), controller.geturlmeta)
router.get('/:session_id', auth.isAuthenticated(), controller.index)

module.exports = router
