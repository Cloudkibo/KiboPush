const express = require('express')
const router = express.Router()

const controller = require('./webhooks.controller')

router.get('/', controller.verifyHook)
router.post('/', controller.webhook)

module.exports = router
