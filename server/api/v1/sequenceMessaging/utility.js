const SequenceSubscribers = require('./sequenceSubscribers.model')
const logger = require('../../../components/logger')
const TAG = 'api/sequenceMessaging/utility.js'
const SequenceMessageQueue = require('./../SequenceMessageQueue/SequenceMessageQueue.model')
const SequenceMessages = require('./message.model')

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

function checkParentMessageTrigger (message) {
  SequenceMessages.findOne({_id: message.trigger.value}, (err, foundMessage) => {
    if (err) {
      logger.serverLog(TAG, 'Failed to find message record')
    } else {
      if (foundMessage.trigger.event === 'none') {
        let utcDate = setScheduleDate(message.schedule)
        addToMessageQueue(message.sequenceId, utcDate, message._id)
      }
    }
  })
}

function setScheduleDate (schedule) {
  let d1 = new Date()
  if (schedule.condition === 'hours') {
    d1.setHours(d1.getHours() + Number(schedule.days))
  } else if (schedule.condition === 'minutes') {
    d1.setMinutes(d1.getMinutes() + Number(schedule.days))
  } else if (schedule.condition === 'day(s)') {
    d1.setDate(d1.getDate() + Number(schedule.days))
  }
  return new Date(d1)
}

exports.addToMessageQueue = addToMessageQueue
exports.checkParentMessageTrigger = checkParentMessageTrigger
exports.setScheduleDate = setScheduleDate
