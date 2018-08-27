/**
 * Created by sojharo on 25/09/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./dash.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isKiboDash, controller.platformWiseData)
router.post('/getPlatformData', auth.isKiboDash, controller.platformWiseData)
router.post('/getPageData', auth.isKiboDash, controller.pageWiseData)
router.post('/getCompanyData', auth.isKiboDash, controller.companyWiseData)
router.post('/getFacebookAutoposting', auth.isKiboDash, controller.getFacebookAutoposting)
router.post('/getTwitterAutoposting', auth.isKiboDash, controller.getTwitterAutoposting)
router.post('/getWordpressAutoposting', auth.isKiboDash, controller.getWordpressAutoposting)

module.exports = router
