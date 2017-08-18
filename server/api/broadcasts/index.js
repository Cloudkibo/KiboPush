'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./broadcasts.controller')
const auth = require('../../auth/auth.service')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.create)
router.post('/edit', auth.isAuthenticated(), controller.edit)
router.post('/send', auth.isAuthenticated(), controller.send)
router.post('/webhook', controller.getfbMessage)
router.get('/webhook', controller.verifyhook)
router.post('/uploadfile', auth.isAuthenticated(), multipartyMiddleware, controller.uploadfile)
router.get('/downloadfile/:id', controller.download)
router.get('/:id', controller.show)

/* Seed Pages */
router.get('/seed', controller.seed)

module.exports = router
