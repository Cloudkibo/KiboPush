/**
 * Created by sojharo on 28/12/2017.
 */

'use strict'

var express = require('express')
var controller = require('./ipcountry.controller')
var cors = require('cors')

var router = express.Router()
const auth = require('../../auth/auth.service')

router.post('/findIp',
  cors(),
  controller.findIp)

module.exports = router
