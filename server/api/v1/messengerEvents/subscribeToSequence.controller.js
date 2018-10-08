const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/subscribeToSequence.controller.js'
const Subscribers = require('../subscribers/Subscribers.model')
const Sequences = require('../sequenceMessaging/sequence.model')
const SequenceSubscribers = require('../sequenceMessaging/sequenceSubscribers.model')
const SequenceMessages = require('../sequenceMessaging/message.model')
const SequenceMessageQueue = require('../SequenceMessageQueue/SequenceMessageQueue.model')

exports.subscribeToSequence = function (req, res) {
  res.status(200).json({
    status: 'success',
    description: `received the payload`
  })
  logger.serverLog(TAG, `in subscribeToSequence ${JSON.stringify(req.body)}`)
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    let resp = JSON.parse(event.postback.payload)
    subscribeToSequence(resp.sequenceId, event)
  }
}

function subscribeToSequence (sequenceId, req) {
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

      SequenceSubscribers.findOne({ subscriberId: subscriber._id }, (err, sequenceSubscriber) => {
        if (err) {
          logger.serverLog(TAG,
            `Internal Server Error ${JSON.stringify(err)}`)
        }

        // CASE-1 Subscriber already exists
        if (sequenceSubscriber !== {} && sequenceSubscriber !== null) {
          SequenceSubscribers.update({ _id: sequenceSubscriber._id }, { status: 'subscribed' }, (err, updated) => {
            if (err) {
              logger.serverLog(TAG,
                `Internal Server Error ${JSON.stringify(err)}`)
            }
          })
          // CASE-2 Subscriber doesn't exist
        } else {
          SequenceMessages.find({ sequenceId: sequenceId }, (err, messages) => {
            if (err) {
              return {
                status: 'Failed',
                description: 'Failed to insert record'
              }
            }

            messages.forEach(message => {
              if (message.schedule.condition === 'immediately') {
                // console.log('we will use the sending script here')
              } else {
                let sequenceQueuePayload = {
                  sequenceId: sequenceId,
                  subscriberId: subscriber._id,
                  companyId: subscriber.companyId,
                  sequenceMessageId: message._id,
                  queueScheduledTime: message.schedule.date,    // Needs to be updated after #3704
                  isActive: message.isActive
                }

                const sequenceMessageForQueue = new SequenceMessageQueue(sequenceQueuePayload)
                sequenceMessageForQueue.save((err, messageQueueCreated) => {
                  if (err) {
                    return {
                      status: 'Failed',
                      description: 'Failed to insert record in Queue'
                    }
                  }
                }) //  save ends here
              }  // else ends here
            })  // Messages Foreach ends here

            let sequenceSubscriberPayload = {
              sequenceId: sequenceId,
              subscriberId: subscriber._id,
              companyId: sequence.companyId,
              status: 'subscribed'
            }
            const sequenceSubcriber = new SequenceSubscribers(sequenceSubscriberPayload)

            // save model to MongoDB
            sequenceSubcriber.save((err, subscriberCreated) => {
              if (err) {
                logger.serverLog(TAG,
                  `Failed to insert record`)
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
        }
      })
    })
  })
}
