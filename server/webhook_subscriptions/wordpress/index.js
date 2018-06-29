const express = require('express')

const router = express.Router()

const controller = require('./wordpress.controller')

router.post('/webhook', controller.postPublish)

module.exports = router
