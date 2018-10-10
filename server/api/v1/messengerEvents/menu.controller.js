const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/menu.controller.js'
const Subscribers = require('../subscribers/Subscribers.model')
const utility = require('../broadcasts/broadcasts.utility')
const Pages = require('../pages/Pages.model')
const { sendBroadcast } = require('../broadcasts/broadcasts2.controller')

exports.menu = function (req, res) {
  res.status(200).json({
    status: 'success',
    description: `received the payload`
  })
  logger.serverLog(TAG, `in menu ${JSON.stringify(req.body)}`)
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    sendMenuReply(event)
  }
}

function sendMenuReply (req) {
  let parsedData = JSON.parse(req.postback.payload)
  Subscribers.findOne({ senderId: req.sender.id }).exec((err, subscriber) => {
    if (err) {
      return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
    }
    Pages.findOne({ pageId: req.recipient.id, connected: true }, (err, page) => {
      if (err) {
        return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      }
       // sending last parameter because to incorporate the changed getBatchData method
      utility.getBatchData(parsedData, subscriber.senderId, page, sendBroadcast, subscriber.firstName, subscriber.lastName, 'menu')
    })
  })
}
