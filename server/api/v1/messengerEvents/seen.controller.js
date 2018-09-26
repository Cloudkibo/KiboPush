const SequenceUtility = require('../sequenceMessaging/utility')
const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/seen.controller.js'
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const PollPage = require('../page_poll/page_poll.model')
const SurveyPage = require('../page_survey/page_survey.model')
const LiveChat = require('../livechat/livechat.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require('./../autoposting_messages/autoposting_subscriber_messages.model')
const Sequences = require('../sequenceMessaging/sequence.model')
const SequenceSubscribers = require('../sequenceMessaging/sequenceSubscribers.model')
const SequenceMessages = require('../sequenceMessaging/message.model')
const Subscribers = require('../subscribers/Subscribers.model')
const SequenceSubscriberMessages = require('./../sequenceMessaging/sequenceSubscribersMessages.model')

exports.seen = function (req, res) {
  updateBroadcastSeen(req.body.entry[0].messaging[0])
  updatePollSeen(req.body.entry[0].messaging[0])
  updateSurveySeen(req.body.entry[0].messaging[0])
  updateLivechatSeen(req.body.entry[0].messaging[0])
  updateAutopostingSeen(req.body.entry[0].messaging[0])
  updateSequenceSeen(req.body.entry[0].messaging[0])
}

function updateBroadcastSeen (req) {
  BroadcastPage.update({ pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
  { seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at updating broadcast seen ${JSON.stringify(err)}`)
    }
  })
}

function updatePollSeen (req) {
  PollPage.update({ pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
  { seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at updating poll seen ${JSON.stringify(err)}`)
    }
  })
}

function updateSurveySeen (req) {
  SurveyPage.update({ pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
  { seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
  })
}

function updateLivechatSeen (req) {
  LiveChat.update({sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id, seen: false, datetime: { $lte: new Date(req.read.watermark) }},
  { seenDateTime: new Date(req.read.watermark), seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at updating live chat seen ${JSON.stringify(err)}`)
    }
    LiveChat.findOne({ sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id }, (err, chat) => {
      if (err) {
        logger.serverLog(TAG, `ERROR at finding live chat message in updateLivechatSeen ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG, `CHAT with updated seen ${req.recipient.id} ${req.sender.id} ${JSON.stringify(chat)}`)
      if (chat) {
        require('./../../../config/socketio').sendMessageToClient({
          room_id: chat.company_id,
          body: {
            action: 'message_seen',
            payload: {
              session_id: chat.session_id
            }
          }
        })
      }
    })
  })
}

function updateAutopostingSeen (req) {
  AutopostingSubscriberMessages.distinct('autoposting_messages_id',
  { subscriberId: req.sender.id, pageId: req.recipient.id, seen: false },
  (err, AutopostingMessagesIds) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    AutopostingSubscriberMessages.update({subscriberId: req.sender.id, pageId: req.recipient.id, seen: false, datetime: { $lte: new Date(req.read.watermark) }},
    { seen: true }, { multi: true }, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      AutopostingMessagesIds.forEach(autopostingMessagesId => {
        AutopostingMessages.update({ _id: autopostingMessagesId },
        { $inc: { seen: 1 } }, { multi: true }, (err, updated) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
        })
      })
    })
  })
}

function updateSequenceSeen (req) {
  Subscribers.findOne({ senderId: req.sender.id }).exec((err, subscriber) => {
    if (err) {
      return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    if (subscriber) {
      SequenceSubscriberMessages.distinct('messageId',
        { subscriberId: subscriber._id, seen: false },
        (err, sequenceMessagesIds) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          logger.serverLog('MessageIds', `${JSON.stringify(sequenceMessagesIds)}`)
          logger.serverLog('DateTime', `${JSON.stringify(new Date(req.read.watermark))}`)
          SequenceSubscriberMessages.update(
            {
              subscriberId: subscriber._id,
              seen: false,
              datetime: { $lte: new Date(req.read.watermark) }
            },
            { seen: true },
            { multi: true }, (err, updated) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }

              sequenceMessagesIds.forEach((sequenceMessagesId, sIndex) => {
                SequenceMessages.update(
                  { _id: sequenceMessagesId },
                  { $inc: { seen: 1 } },
                  { multi: true }, (err, updated) => {
                    if (err) {
                      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                    }
                    // Logic to capture all seen messages for a sequence
                    let smIds = []   // Will contain the message ids against a specific sub AND sequnce
                    let length = sequenceMessagesIds.length - 1
                    // Checking if the last index and all seen have been inserted
                    if (sIndex === length) {
                      // Finding all the sequences of the subscriber
                      SequenceSubscribers.find({ subscriberId: subscriber._id }, (err, seqsubs) => {
                        if (err) {
                          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                        }

                        if (seqsubs) {
                          // Iterating for each sequence
                          seqsubs.forEach((seqSub) => {
                            // finding messages of all sequences one by one
                            SequenceMessages.find({ sequenceId: seqSub.seqeunceId }, (err, sequenceMessages) => {
                              if (err) {
                                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                              }
                              // Inserting message ids against a specific subscriber and sequence
                              for (let i = 0, length = sequenceMessages.length; i < length; i++) {
                                smIds[i] = sequenceMessages[i]._id
                              }
                              // Finding all seen messages of that sequence
                              SequenceSubscriberMessages.find({ subscriberId: subscriber._id, seen: true, messageId: { $in: smIds } }, (err, seqsubmessages) => {
                                if (err) {
                                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                }
                                // Checking if all the message of sequence have been seen
                                if (sequenceMessages.length === seqsubmessages.length) {
                                  // It means that all of the messages of sequence have been seen
                                  // Now we need to see if this sequence is added in trigger of any other sequences

                                  Sequences.find({ companyId: subscriber.companyId },
                                    (err, sequences) => {
                                      if (err) {
                                        return logger.serverLog(TAG, `ERROR getting sequence ${JSON.stringify(err)}`)
                                      }
                                      if (sequences) {
                                        sequences.forEach(sequence => {
                                          if (sequence.trigger && sequence.trigger.event) {
                                            logger.serverLog(TAG, `seqSub ${JSON.stringify(seqSub)}`)
                                            if (sequence.trigger.event === 'seen_all_sequence_messages' && (JSON.stringify(sequence.trigger.value) === JSON.stringify(seqSub.sequenceId))) {
                                              SequenceSubscribers.find({ subscriberId: subscriber._id, sequenceId: sequence._id }, (err, sequenceSubscriber) => {
                                                if (err) {
                                                  logger.serverLog(TAG,
                                                    `Internal Server Error ${JSON.stringify(err)}`)
                                                }
                                                if (sequenceSubscriber.length < 1) {
                                                  logger.serverLog(TAG, `ERROR getting sequence ${JSON.stringify(seqSub.sequenceId)}`)
                                                  SequenceMessages.find({ sequenceId: sequence._id }, (err, messages) => {
                                                    if (err) {
                                                      logger.serverLog(TAG, `ERROR getting sequence message${JSON.stringify(err)}`)
                                                    }
                                                    let sequenceSubscriberPayload = {
                                                      sequenceId: sequence._id,
                                                      subscriberId: subscriber._id,
                                                      companyId: subscriber.companyId,
                                                      status: 'subscribed'
                                                    }
                                                    const sequenceSubcriber = new SequenceSubscribers(sequenceSubscriberPayload)

                                                    sequenceSubcriber.save((err, subscriberCreated) => {
                                                      if (err) {
                                                        return logger.serverLog(TAG, `ERROR saving sequence subscriber{JSON.stringify(err)}`)
                                                      } else {
                                                        // insert socket.io code here
                                                        logger.serverLog(TAG, `Subscribed to sequence successfully`)
                                                      }
                                                      if (messages) {
                                                        messages.forEach(message => {
                                                          if (message.schedule.condition === 'immediately') {
                                                            SequenceUtility.addToMessageQueue(sequence._id, new Date(), message._id)
                                                          } else {
                                                            let d1 = new Date()
                                                            if (message.schedule.condition === 'hours') {
                                                              d1.setHours(d1.getHours() + Number(message.schedule.days))
                                                            } else if (message.schedule.condition === 'minutes') {
                                                              d1.setMinutes(d1.getMinutes() + Number(message.schedule.days))
                                                            } else if (message.schedule.condition === 'day(s)') {
                                                              d1.setDate(d1.getDate() + Number(message.schedule.days))
                                                            }
                                                            let utcDate = new Date(d1)
                                                            SequenceUtility.addToMessageQueue(sequence._id, utcDate, message._id)
                                                          }
                                                        })
                                                      }
                                                    })
                                                  })
                                                }
                                              })
                                            }
                                          }
                                        })
                                      }
                                    })
                                }
                              })  // seqsubmessages find ends here
                            })   // sequence messages find ends here
                          })   // seqsubs Foreach ends here
                        }
                      })   // Sequence Subscriber find ends here
                    }
                  })  // Sequence Message Update ends here
              })
            })
        })
    }
  })
}
