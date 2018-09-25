'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./migrations.controller')

router.get('/createLinks',
  controller.createLinks)

router.get('/migrate/:id',
  controller.migrate)

router.post('/start',
  controller.start)

module.exports = router
