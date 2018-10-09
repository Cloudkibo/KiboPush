const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/unsubscribeFromSequence.controller.js'
const Sequences = require('../../v1/sequenceMessaging/sequence.model')
const SequenceSubscribers = require('../../v1/sequenceMessaging/sequenceSubscribers.model')
const SequenceMessageQueue = require('../../v1/SequenceMessageQueue/SequenceMessageQueue.model')
const {callApi} = require('../utility')

exports.unsubscribeFromSequence = function (req, res) {
  res.status(200).json({
    status: 'success',
    description: `received the payload`
  })
  logger.serverLog(TAG, `in unsubscribeFromSequence ${JSON.stringify(req.body)}`)
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    let resp = JSON.parse(event.postback.payload)
    unsubscribeFromSequence(resp.sequenceId, event)
  }
}

function unsubscribeFromSequence (sequenceId, req) {
  Sequences.findOne({ _id: sequenceId }, (err, sequence) => {
    if (err) {
      logger.serverLog(TAG,
        `Internal Server Error ${JSON.stringify(err)}`)
    }

    callApi(`subscribers/query`, 'post', { senderId: req.sender.id })
      .then(subscribers => {
        let subscriber = subscribers[0]

        SequenceSubscribers.remove({ sequenceId: sequenceId })
          .where('subscriberId').equals(subscriber._id)
          .exec((err, updated) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }

            SequenceMessageQueue.deleteMany({ sequenceId: sequenceId, subscriberId: subscriber._id }, (err, result) => {
              if (err) {
                return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }

              require('./../../../config/socketio').sendMessageToClient({
                room_id: sequence.companyId,
                body: {
                  action: 'sequence_update',
                  payload: {
                    sequence_id: sequenceId
                  }
                }
              })
            })
          })
      })
      .catch(err => {
        logger.serverLog(TAG, `Failed to fetch subscriber ${JSON.stringify(err)}`)
      })
  })
}
