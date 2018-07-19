/**
 * Created by sojharo on 25/09/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./dash.controller')
// const auth = require('../../auth/auth.service')

router.get('/', controller.platformWiseData)
router.post('/getPlatformData', controller.platformWiseData)
router.post('/getPageData', controller.pageWiseData) // pagination
router.post('/getCompanyData', controller.userWiseData)

module.exports = router
