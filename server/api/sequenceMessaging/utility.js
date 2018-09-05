const SequenceSubscribers = require('./sequenceSubscribers.model')
const logger = require('../../components/logger')
const TAG = 'api/sequenceMessaging/sequence.controller.js'
const SequenceMessageQueue = require('./../SequenceMessageQueue/SequenceMessageQueue.model')

function addToMessageQueue (sequenceId, scheduleDate, messageId) {
  SequenceSubscribers.find({sequenceId: sequenceId}, (err, sequences) => {
    if (err) {
      logger.serverLog(TAG, 'subscriber find error in add to message queue')
    }
    if (sequences.length > 0) {
      sequences.forEach(sequence => {
        let sequenceQueuePayload = {
          sequenceId: sequenceId,
          subscriberId: sequence.subscriberId,
          companyId: sequence.companyId,
          sequenceMessageId: messageId,
          queueScheduledTime: scheduleDate
        }
        const sequenceMessageForQueue = new SequenceMessageQueue(sequenceQueuePayload)
        sequenceMessageForQueue.save((err, messageQueueCreated) => {
          if (err) {
            logger.serverLog(TAG, 'Failed to insert record in message queue')
          }
        })
      })
    }
  })
}

exports.addToMessageQueue = addToMessageQueue
