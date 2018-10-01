const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/pollResponse.controller.js'
const Subscribers = require('../subscribers/Subscribers.model')
const mongoose = require('mongoose')
const Webhooks = require(
  './../webhooks/webhooks.model')
const PollResponse = require('../polls/pollresponse.model')
const needle = require('needle')
const webhookUtility = require('./../webhooks/webhooks.utility')
const sequenceController = require('./../sequenceMessaging/sequence.controller')

var array = []

exports.pollResponse = function (req, res) {
  logger.serverLog(TAG, `in pollResponse ${JSON.stringify(req.body)}`)
  let resp = JSON.parse(
    req.body.entry[0].messaging[0].message.quick_reply.payload)
  savepoll(req.body.entry[0].messaging[0], resp)
  Subscribers.findOne({ senderId: req.body.entry[0].messaging[0].sender.id }, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber ${JSON.stringify(
          err)}`)
    }
    if (subscriber) {
      logger.serverLog(TAG, `Subscriber Responeds to Poll ${JSON.stringify(subscriber)} ${resp.poll_id}`)
      sequenceController.setSequenceTrigger(subscriber.companyId, subscriber._id, { event: 'responds_to_poll', value: resp.poll_id })
    }
  })
}
function savepoll (req, resp) {
  // find subscriber from sender id
  // var resp = JSON.parse(req.postback.payload)
  var temp = true
  Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber ${JSON.stringify(
          err)}`)
    }
    if (!subscriber || subscriber._id === null) {
      return
    }
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        if (mongoose.Types.ObjectId(array[i].pollId) ===
          mongoose.Types.ObjectId(resp.poll_id) &&
          mongoose.Types.ObjectId(array[i].subscriberId) ===
          mongoose.Types.ObjectId(subscriber._id)) {
          temp = false
          break
        }
      }
    }
    const pollbody = {
      response: resp.option, // response submitted by subscriber
      pollId: resp.poll_id,
      subscriberId: subscriber._id

    }
    Webhooks.findOne({ pageId: req.recipient.id }).populate('userId').exec((err, webhook) => {
      logger.serverLog(TAG, `webhook ${webhook}`)
      if (err) logger.serverLog(TAG, err)
      if (webhook && webhook.isEnabled) {
        needle.get(webhook.webhook_url, (err, r) => {
          if (err) {
            logger.serverLog(TAG, err)
            logger.serverLog(TAG, `response ${r.statusCode}`)
          } else if (r.statusCode === 200) {
            if (webhook && webhook.optIn.POLL_RESPONSE) {
              var data = {
                subscription_type: 'POLL_RESPONSE',
                payload: JSON.stringify({ sender: req.sender, recipient: req.recipient, timestamp: req.timestamp, message: req.message })
              }
              logger.serverLog(TAG, `data for poll response ${data}`)
              needle.post(webhook.webhook_url, data,
                (error, response) => {
                  if (error) logger.serverLog(TAG, err)
                })
            }
          } else {
            webhookUtility.saveNotification(webhook)
          }
        })
      }
    })
    if (temp === true) {
      PollResponse.create(pollbody, (err, pollresponse) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        } else {
          array.push(pollbody)
        }
      })
    }
  })
}
