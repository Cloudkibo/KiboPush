const logger = require('../../components/logger')
const TAG = 'api/messengerEvents/unsubscribeFromSequence.controller.js'
const Subscribers = require('../subscribers/Subscribers.model')
const Sequences = require('../sequenceMessaging/sequence.model')
const SequenceSubscribers = require('../sequenceMessaging/sequenceSubscribers.model')
const SequenceMessageQueue = require('../SequenceMessageQueue/SequenceMessageQueue.model')

exports.unsubscribeFromSequence = function (req, res) {
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

    Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
      if (err) {
        logger.serverLog(TAG,
          `Internal Server Error ${JSON.stringify(err)}`)
      }

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

            require('./../../config/socketio').sendMessageToClient({
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
  })
}
