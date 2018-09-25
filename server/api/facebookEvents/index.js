'use strict'

const express = require('express')
const router = express.Router()
const autopostingController = require('./autoposting.controller')
const commentController = require('./comment.controller')
const changePageNameController = require('./changePageName.controller')

router.post('/autoposting', autopostingController.autoposting)
router.post('/comment', commentController.sendCommentReply)
router.post('/changePageName', changePageNameController.changePageName)

module.exports = router
