const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/unsubscribe.controller.js'
const Subscribers = require('../../v1/subscribers/Subscribers.model')
const needle = require('needle')
const CompanyUsage = require('../../v1/featureUsage/companyUsage.model')

exports.unsubscribe = function (req, res) {
  res.status(200).json({
    status: 'success',
    description: `received the payload`
  })
  logger.serverLog(TAG, `in unsubscribe ${JSON.stringify(req.body)}`)
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    let resp = JSON.parse(event.postback.payload)
    handleUnsubscribe(resp, event)
  }
}
function handleUnsubscribe (resp, req) {
  let messageData = {}
  if (resp.action === 'yes') {
    messageData = {
      text: 'You have unsubscribed from our broadcasts. Send "start" to subscribe again.'
    }
    Subscribers.update({ senderId: req.sender.id },
      { isSubscribed: false }, (err) => {
        if (err) {
          logger.serverLog(TAG,
            `Subscribers update subscription: ${JSON.stringify(
              err)}`)
        }
        Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
          if (err) {
            logger.serverLog(TAG,
              `Subscribers update subscription: ${JSON.stringify(
                err)}`)
          }
          CompanyUsage.update({companyId: subscriber.companyId},
            { $inc: { subscribers: -1 } }, (err, updated) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
            })
        })
      })
  } else {
    messageData = {
      text: 'You can unsubscribe anytime by saying stop.'
    }
  }
  needle.get(
    `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
    (err3, response) => {
      if (err3) {
        logger.serverLog(TAG,
          `Page token error from graph api ${JSON.stringify(err3)}`)
      }
      const data = {
        messaging_type: 'RESPONSE',
        recipient: { id: req.sender.id }, // this is the subscriber id
        message: messageData
      }
      needle.post(
        `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
        data, (err4, respp) => {
          logger.serverLog(TAG,
            `Sending unsubscribe confirmation response to subscriber  ${JSON.stringify(
              respp.body)}`)
        })
    })
}
