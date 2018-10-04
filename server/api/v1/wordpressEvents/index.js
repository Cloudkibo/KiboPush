const express = require('express')

const router = express.Router()

const controller = require('./wordpress.controller')
const auth = require('../../../auth/auth.service')

router.post('/wordpress', auth.isItWebhookServer(), controller.postPublish)

module.exports = router
