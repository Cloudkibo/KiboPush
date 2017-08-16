'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./workflows.controller')
// const auth = require('../../auth/auth.service')

router.get('/', controller.index)
router.post('/create', controller.create)
router.post('/edit', controller.edit)
router.post('/active', controller.create)
// router.post('/report', controller.report);
// router.post('/send', controller.send);

/* Seed Pages */
router.get('/seed', controller.seed)

module.exports = router
