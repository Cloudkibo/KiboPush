const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/menu.controller.js'
const utility = require('../../v1/broadcasts/broadcasts.utility')
const { sendBroadcast } = require('../../v1/broadcasts/broadcasts2.controller')
const callApi = require('../utility')

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
  callApi.callApi(`subscribers/query`, 'post', { senderId: req.sender.id }, req.headers.authorization)
  .then(subscriber => {
    callApi.callApi(`pages/query`, 'post', { pageId: req.recipient.id, connected: true }, req.headers.authorization)
    .then(page => {
      utility.getBatchData(parsedData, subscriber.senderId, page, sendBroadcast, subscriber.firstName, subscriber.lastName, 'menu')
    })
    .catch(err => {
      return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
    })
  })
  .catch(err => {
    return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
  })
}
