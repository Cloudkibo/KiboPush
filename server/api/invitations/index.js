/**
 * Created by sojharo on 28/12/2017.
 */

'use strict'

var express = require('express')
var controller = require('./invitations.controller')

var router = express.Router()
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/cancel', controller.cancel)
// router.post('/', controller.create)
// router.put('/:id', controller.update)
// router.patch('/:id', controller.update)
// router.delete('/:id', controller.destroy)

module.exports = router
