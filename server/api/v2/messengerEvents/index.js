'use strict'

const express = require('express')
const router = express.Router()
const seenController = require('./seen.controller')
const pollController = require('./pollResponse.controller')
const surveyController = require('./surveyResponse.controller')
const subscriberController = require('./subscriber.controller')
const shopifyController = require('./shopify.controller')
const unsubscribeController = require('./Unsubscribe.controller')
const subscribeToSequenceController = require('./subscribeToSequence.controller')
const unsubscribeFromSequenceController = require('./unsubscribeFromSequence.controller')
const menuController = require('./menu.controller')
const auth = require('../../../auth/auth.service')

router.post('/seen', auth.isItWebhookServer(), seenController.seen)
router.post('/pollResponse', auth.isItWebhookServer(), pollController.pollResponse)
router.post('/surveyResponse', auth.isItWebhookServer(), surveyController.surveyResponse)
router.post('/subscriber', auth.isItWebhookServer(), subscriberController.subscriber)
router.post('/shopify', auth.isItWebhookServer(), shopifyController.shopify)
router.post('/unsubscribe', auth.isItWebhookServer(), unsubscribeController.unsubscribe)
router.post('/subscribeToSequence', auth.isItWebhookServer(), subscribeToSequenceController.subscribeToSequence)
router.post('/unsubscribeFromSequence', auth.isItWebhookServer(), unsubscribeFromSequenceController.unsubscribeFromSequence)
router.post('/menu', auth.isItWebhookServer(), menuController.menu)

module.exports = router
