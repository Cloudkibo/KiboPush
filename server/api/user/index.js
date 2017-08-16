/**
 * Created by sojharo on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./user.controller')

router.get('/', auth.isAuthenticated(), controller.index)

router.get('/logout', controller.logout)

module.exports = router
