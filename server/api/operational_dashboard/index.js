/**
 * Created by sojharo on 25/09/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./operational.controller')
const platform = require('./platform.controller')
const user = require('./user.controller')
const page = require('./page.controller')
const autoposting = require('./autoposting.controller')
// const auth = require('../../auth/auth.service')

router.get('/', controller.index)

// Platformwise Data
router.get('/platformwise', platform.index)
router.post('/platformwise/ranged', platform.ranged)

// Userwise Data
router.get('/userwise', user.index)
router.post('/userwise/ranged', user.ranged)
router.post('/userwise/oneUser', user.oneUser)
router.post('/userwise/oneUser/ranged', user.oneUserRanged)

// Pagewise Data
router.get('/pagewise', page.index)
router.post('/pagewise/ranged', page.ranged)
router.post('/pagewise/onePage', page.onePage)
router.post('/pagewise/onePage/ranged', page.onePageRanged)
router.post('/pagewise/topPages', page.topPages)

// Autoposting Data
router.get('/autoposting/platformwise', autoposting.index)
router.post('/autoposting/platformwise/ranged', autoposting.ranged)
router.post('/autoposting/userwise', autoposting.userwise)
router.post('/autoposting/userwise/ranged', autoposting.userwiseRanged)

module.exports = router
