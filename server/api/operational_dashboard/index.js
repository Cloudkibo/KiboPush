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
router.get('/pagewise/ranged', page.ranged)
router.get('/pagewise/onePage', page.onePage)
router.get('/pagewise/onePage/ranged', page.onePageRanged)
router.get('/pagewise/topPages', page.topPages)

// Autoposting Data
router.get('/autoposting/platformwise', autoposting.index)
router.get('/autoposting/platformwise/ranged', autoposting.ranged)
router.get('/autoposting/userwise', autoposting.userwise)
router.get('/autoposting/userwise/ranged', autoposting.userwiseRanged)

module.exports = router
