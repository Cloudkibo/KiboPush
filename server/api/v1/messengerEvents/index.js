'use strict'

const express = require('express')
const router = express.Router()
const seenController = require('./seen.controller')
const pollController = require('./pollResponse.controller')
const surveyController = require('./surveyResponse.controller')
const subscriberController = require('./subscriber.controller')
const shopifyController = require('./shopify.controller')
const unsubscribeController = require('./unsubscribe.controller')
const subscribeToSequenceController = require('./subscribeToSequence.controller')
const unsubscribeFromSequenceController = require('./unsubscribeFromSequence.controller')
const menuController = require('./menu.controller')

router.post('/seen', seenController.seen)
router.post('/pollResponse', pollController.pollResponse)
router.post('/surveyResponse', surveyController.surveyResponse)
router.post('/subscriber', subscriberController.subscriber)
router.post('/shopify', shopifyController.shopify)
router.post('/unsubscribe', unsubscribeController.unsubscribe)
router.post('/subscribeToSequence', subscribeToSequenceController.subscribeToSequence)
router.post('/unsubscribeFromSequence', unsubscribeFromSequenceController.unsubscribeFromSequence)
router.post('/menu', menuController.menu)

module.exports = router
