/**
 * Created by sojharo on 02/02/2018.
 */

const express = require('express')

const router = express.Router()

const controller = require('./messenger.controller')

router.post('/webhook', controller.getHook)
router.get('/webhook', controller.verifyHook)

module.exports = router
