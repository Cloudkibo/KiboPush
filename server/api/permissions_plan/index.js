/**
 * Created by sojharo on 28/12/2017.
 */
'use strict'

var express = require('express')
var controller = require('./permissions_plan.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

// router.get('/', auth.isAuthenticated(), controller.index)
// router.get('/fetch', auth.isAuthenticated(), controller.fetch)
// router.post('/updatecompanyprofile', auth.isAuthenticated(), controller.updatecompanyprofile)
// router.get('/:id', auth.isAuthenticated(), controller.show)
// router.post('/', auth.isAuthenticated(), controller.create)
// router.put('/:id', auth.isAuthenticated(), controller.update)
// router.patch('/:id', controller.update)
// router.delete('/:id', controller.destroy)

module.exports = router
