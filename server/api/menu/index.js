/**
 * Created by sojharo on 23/10/2017.
 */
'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./menu.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)

module.exports = router
