/**
 * Created by sojharo on 25/09/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./dash.controller')
// const auth = require('../../auth/auth.service')

router.get('/', controller.platformWiseData)
router.get('/getPlatformData', controller.platformWiseData)
router.get('/getPageData', controller.pageWiseData) // pagination
router.get('/getCompanyData', controller.userWiseData)

module.exports = router
