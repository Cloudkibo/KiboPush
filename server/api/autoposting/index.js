'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./autopostings.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/edit', auth.isAuthenticated(), controller.edit)
router.delete('/:id', auth.isAuthenticated(), controller.destroy)

router.post('/twitter', controller.twitterwebhook)
router.get('/twitter', controller.twitterverify)

module.exports = router
