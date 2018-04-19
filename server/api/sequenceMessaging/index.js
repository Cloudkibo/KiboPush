'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./sequence.controller')
const auth = require('../../auth/auth.service')

router.get('/allMessages',
  auth.isAuthenticated(),
  controller.allMessages)

router.post('/createMessage',
  auth.isAuthenticated(),
  controller.createMessage)

router.post('/editMessage',
  auth.isAuthenticated(),
  controller.editMessage)

router.post('/createSequence',
  auth.isAuthenticated(),
  controller.createSequence)

router.post('/editSequence',
  auth.isAuthenticated(),
  controller.editSequence)

router.get('/allSequences',
  auth.isAuthenticated(),
  controller.allSequences)

router.get('/subscribeToSequence',
  auth.isAuthenticated(),
  controller.subscribeToSequence)

router.get('/unsubscribeToSequence',
  auth.isAuthenticated(),
  controller.unsubscribeToSequence)

router.post('/testScheduler',
  controller.testScheduler)

module.exports = router
