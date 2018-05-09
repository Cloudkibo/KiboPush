'use strict'

const express = require('express')

const router = express.Router()

const controller = require('./sequence.controller')
const auth = require('../../auth/auth.service')

router.get('/allMessages/:id',
  auth.isAuthenticated(),
  controller.allMessages)

router.post('/createMessage',
  auth.isAuthenticated(),
  controller.createMessage)

router.post('/editMessage',
  auth.isAuthenticated(),
  controller.editMessage)

router.post('/setSchedule',
  auth.isAuthenticated(),
  controller.setSchedule)

router.post('/setStatus',
  auth.isAuthenticated(),
  controller.setStatus)

router.delete('/deleteSequence/:id',
  auth.isAuthenticated(),
  controller.deleteSequence)

router.delete('/deleteMessage/:id',
  auth.isAuthenticated(),
  controller.deleteMessage)

router.post('/createSequence',
  auth.isAuthenticated(),
  controller.createSequence)

router.post('/editSequence',
  auth.isAuthenticated(),
  controller.editSequence)

router.get('/allSequences',
  auth.isAuthenticated(),
  controller.allSequences)

router.get('/getAll',
  auth.isAuthenticated(),
  controller.getAll)

router.get('/subscriberSequences/:id',
  auth.isAuthenticated(),
  controller.subscriberSequences)

router.post('/subscribeToSequence',
  auth.isAuthenticated(),
  controller.subscribeToSequence)

router.post('/unsubscribeToSequence',
  auth.isAuthenticated(),
  controller.unsubscribeToSequence)

router.post('/testScheduler',
  controller.testScheduler)

module.exports = router
