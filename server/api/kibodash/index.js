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
router.post('/getPageData', controller.pageWiseData)
router.post('/getCompanyData', controller.companyWiseData)
router.get('/getFacebookAutoposting', controller.getFacebookAutoposting)
router.get('/getTwitterAutoposting', controller.getTwitterAutoposting)
router.get('/getWordpressAutoposting', controller.getWordpressAutoposting)

module.exports = router
