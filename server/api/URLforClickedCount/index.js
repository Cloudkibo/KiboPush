'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./URL.controller')

router.get('/:id', controller.index)
router.get('/broadcast/:id', controller.broadcast)

module.exports = router
