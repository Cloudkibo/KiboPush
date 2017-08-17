'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./workflows.controller')
// const auth = require('../../auth/auth.service')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/edit', auth.isAuthenticated(), controller.edit)
router.post('/enable', auth.isAuthenticated(), controller.enable)
router.post('/disable', auth.isAuthenticated(), controller.disable)
// router.post('/report', controller.report);
// router.post('/send', controller.send);

/* Seed Pages */
router.get('/seed', controller.seed)

module.exports = router
