'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./teams.controller')
const auth = require('../../auth/auth.service')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/create', auth.isAuthenticated(), controller.createTeam)
router.post('/update', auth.isAuthenticated(), controller.updateTeam)
router.delete('/delete/:id', auth.isAuthenticated(), controller.deleteTeam)
router.post('/addAgent', auth.isAuthenticated(), controller.addAgent)
router.post('/addPage', auth.isAuthenticated(), controller.addPage)
router.post('/removeAgent', auth.isAuthenticated(), controller.removeAgent)
router.post('/removePage', auth.isAuthenticated(), controller.removePage)

module.exports = router
