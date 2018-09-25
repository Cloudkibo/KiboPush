'use strict'

const express = require('express')
const router = express.Router()
const autopostingController = require('./autoposting.controller')
const commentController = require('./comment.controller')

router.post('/autoposting', autopostingController.autoposting)
router.post('/comment', commentController.sendCommentReply)

module.exports = router
