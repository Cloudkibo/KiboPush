'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./autopostings.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/edit', auth.isAuthenticated(), controller.edit)
router.delete('/:id', auth.isAuthenticated(), controller.destroy)

module.exports = router
