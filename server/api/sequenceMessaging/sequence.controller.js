const Messages = require('./message.model')
const Sequences = require('./sequence.model')
const SequenceSubscriberMessage = require('./sequenceSubscribersMessages.model')
const SequenceSubscribers = require('./sequenceSubscribers.model')
const SequenceMessages = require('./message.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const SequenceMessageQueue = require('./../SequenceMessageQueue/SequenceMessageQueue.model')
const logger = require('../../components/logger')
const TAG = 'api/sequenceMessaging/sequence.controller.js'
const URL = require('./../URLforClickedCount/URL.model')
const Pages = require('./../pages/Pages.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const config = require('./../../config/environment')
const BroadcastUtility = require('./../broadcasts/broadcasts.utility')
const _ = require('lodash')
const request = require('request')

exports.allMessages = function (req, res) {
  Messages.find({sequenceId: req.params.id},
    (err, messages) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({status: 'success', payload: messages})
    })
}

exports.createMessage = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let messagePayload = {
      schedule: req.body.schedule,
      sequenceId: req.body.sequenceId,
      payload: req.body.payload,
      title: req.body.title
    }
    const message = new Messages(messagePayload)

    // save model to MongoDB
    message.save((err, messageCreated) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          description: 'Failed to insert record'
        })
      } else {
        SequenceSubscribers.find({sequenceId: req.body.sequenceId}, (err, sequences) => {
          if (err) {
            return logger.serverLog(TAG, 'subscriber find error create message')
          }
          if (sequences.length > 0) {
            sequences.forEach(sequence => {
              let sequenceQueuePayload = {
                sequenceId: req.body.sequenceId,
                subscriberId: sequence.subscriberId,
                companyId: companyUser.companyId,
                sequenceMessageId: messageCreated._id,
                queueScheduledTime: req.body.schedule.date

              }

              const sequenceMessageForQueue = new SequenceMessageQueue(sequenceQueuePayload)
              sequenceMessageForQueue.save((err, messageQueueCreated) => {
                if (err) {
                  res.status(500).json({
                    status: 'Failed',
                    description: 'Failed to insert record in Queue'
                  })
                }
              })
            })
          }
        })
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_update',
            payload: {
              sequence_id: req.body.sequenceId
            }
          }
        })
        res.status(201).json({status: 'success', payload: messageCreated})
      }
    })
  })
}

exports.editMessage = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Messages.findById(req.body._id, (err, message) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!message) {
        return res.status(404)
          .json({status: 'failed', description: 'Record not found'})
      }
      message.title = req.body.title
      message.payload = req.body.payload
      message.save((err2) => {
        if (err2) {
          return res.status(500)
            .json({status: 'failed', description: 'Poll update failed'})
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_update',
            payload: {
              sequence_id: message.sequenceId
            }
          }
        })
        res.status(201).json({status: 'success', payload: message})
      })
    })
  })
}

exports.setSchedule = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Messages.findById(req.body.messageId, (err, message) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!message) {
        return res.status(404)
          .json({status: 'failed', description: 'Record not found'})
      }
      if (req.body.condition === 'immediately') {
        if (message.isActive === true) {
          SequenceMessageQueue.find({'sequenceMessageId': message._id}, (err, messagesFromQueue) => {
            if (err) {
              return res.status(404)
              .json({status: 'failed', description: 'Record not found'})
            }
            for (let i = 0; i < messagesFromQueue.length; i++) {
              let messageFromQueue = messagesFromQueue[i]
              if (messageFromQueue) {
                Subscribers.findOne({'_id': messageFromQueue.subscriberId}, (err, subscriber) => {
                  if (err) {
                    return res.status(404)
                    .json({status: 'failed', description: 'Record not found'})
                  }

                  Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
                    if (err) {
                      return res.status(404)
                      .json({status: 'failed', description: 'Record not found'})
                    }
                    if (message.payload.length > 0) {
                      AppendURLCount(message, (newPayload) => {
                        let sequenceSubMessage = new SequenceSubscriberMessage({
                          subscriberId: messageFromQueue.subscriberId,
                          messageId: message._id,
                          companyId: messageFromQueue.companyId,
                          datetime: new Date(),
                          seen: false
                        })

                        sequenceSubMessage.save((err2, result) => {
                          if (err2) {
                            logger.serverLog(TAG, {
                              status: 'failed',
                              description: 'Sequence Message Subscriber addition create failed',
                              err2
                            })
                          }
                          logger.serverLog(TAG, `UPDATE SENT COUNT ${JSON.stringify(req.body.messageId)}`)
                          SequenceMessages.update(
                            {_id: req.body.messageId},
                            {$inc: {sent: 1}},
                            {multi: true}, (err, updated) => {
                              if (err) {
                                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                              }
                            })
                          BroadcastUtility.getBatchData(newPayload, subscriber.senderId, page, sendSequence, subscriber.firstName, subscriber.lastName)
                          SequenceMessageQueue.deleteOne({'_id': messageFromQueue._id}, (err, result) => {
                            if (err) {
                              logger.serverLog(TAG, `could not delete the message from queue ${JSON.stringify(err)}`)
                            }
                          })
                        })
                      })
                    }
                  })
                })
              }
            }
          })
        }
      } else {
        SequenceMessageQueue.update({sequenceMessageId: message._id}, {queueScheduledTime: req.body.date}, {multi: true},
        (err, result) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
        })
      }
      message.schedule = {condition: req.body.condition, days: req.body.days, date: req.body.date}
      message.save((err2) => {
        if (err2) {
          return res.status(500)
            .json({status: 'failed', description: 'Poll update failed'})
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_update',
            payload: {
              sequence_id: message.sequenceId
            }
          }
        })
        res.status(201).json({status: 'success', payload: message})
      })
    })
  })
}

exports.setStatus = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Messages.findById(req.body.messageId, (err, message) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!message) {
        return res.status(404)
          .json({status: 'failed', description: 'Record not found'})
      }
      // this will update the status in queue. Queue will only send active messages
      if (message.schedule.condition === 'immediately') {
        SequenceMessageQueue.find({'sequenceMessageId': message._id}, (err, messagesFromQueue) => {
          if (err) {
            return res.status(404)
            .json({status: 'failed', description: 'Record not found'})
          }
          for (let i = 0; i < messagesFromQueue.length; i++) {
            let messageFromQueue = messagesFromQueue[i]
            if (messageFromQueue) {
              Subscribers.findOne({'_id': messageFromQueue.subscriberId}, (err, subscriber) => {
                if (err) {
                  return res.status(404)
                  .json({status: 'failed', description: 'Record not found'})
                }

                Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
                  if (err) {
                    return res.status(404)
                    .json({status: 'failed', description: 'Record not found'})
                  }

                  if (message.payload.length > 0) {
                    AppendURLCount(message, (newPayload) => {
                      logger.serverLog(TAG, `New Payload ${JSON.stringify(newPayload)}`)
                      let sequenceSubMessage = new SequenceSubscriberMessage({
                        subscriberId: messageFromQueue.subscriberId,
                        messageId: message._id,
                        companyId: messageFromQueue.companyId,
                        datetime: new Date(),
                        seen: false
                      })

                      sequenceSubMessage.save((err2, result) => {
                        if (err2) {
                          logger.serverLog(TAG, {
                            status: 'failed',
                            description: 'Sequence Message Subscriber addition create failed',
                            err2
                          })
                        }
                        logger.serverLog(TAG, `UPDATE SENT COUNT ${JSON.stringify(req.body.messageId)}`)
                        SequenceMessages.update(
                          {_id: req.body.messageId},
                          {$inc: {sent: 1}},
                          {multi: true}, (err, updated) => {
                            if (err) {
                              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                            }
                          })
                        BroadcastUtility.getBatchData(newPayload, subscriber.senderId, page, sendSequence, subscriber.firstName, subscriber.lastName)
                        SequenceMessageQueue.deleteOne({'_id': messageFromQueue._id}, (err, result) => {
                          if (err) {
                            logger.serverLog(TAG, `could not delete the message from queue ${JSON.stringify(err)}`)
                          }
                        })
                      })
                    })
                  }
                })
              })
            }
          }
        })
      } else {
        SequenceMessageQueue.update({sequenceMessageId: req.body.messageId}, {isActive: req.body.isActive}, {multi: true}, (err, result) => {
          if (err) {
            return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
          }

          logger.serverLog(TAG, 'updated the status in queue')
        })
      }
      message.isActive = req.body.isActive
      message.save((err2) => {
        if (err2) {
          return res.status(500)
            .json({status: 'failed', description: 'Poll update failed'})
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_update',
            payload: {
              sequence_id: message.sequenceId
            }
          }
        })
        res.status(201).json({status: 'success', payload: message})
      })
    })
  })
}

exports.createSequence = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let sequencePayload = {
      name: req.body.name,
      companyId: companyUser.companyId,
      userId: req.user._id
    }
    const sequence = new Sequences(sequencePayload)

    // save model to MongoDB
    sequence.save((err, sequenceCreated) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          description: 'Failed to insert record'
        })
      } else {
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_create',
            payload: {
              sequence_id: sequenceCreated._id
            }
          }
        })
        res.status(201).json({status: 'success', payload: sequenceCreated})
      }
    })
  })
}

exports.editSequence = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'sequenceId')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    Sequences.findById(req.body.sequenceId, (err, sequence) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!sequence) {
        return res.status(404)
          .json({status: 'failed', description: 'Record not found'})
      }
      sequence.name = req.body.name

      sequence.save((err2) => {
        if (err2) {
          return res.status(500)
            .json({status: 'failed', description: 'Sequence update failed'})
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_update',
            payload: {
              sequence_id: req.body.sequenceId
            }
          }
        })
        res.status(201).json({status: 'success', payload: sequence})
      })
    })
  })
}

exports.allSequences = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    Sequences.find({companyId: companyUser.companyId},
    (err, sequences) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      let sequencePayload = []
      sequences.forEach(sequence => {
        Messages.find({sequenceId: sequence._id},
        (err, messages) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }

          SequenceSubscribers.find({sequenceId: sequence._id})
          .populate('subscriberId')
          .exec((err, subscribers) => {
            if (err) {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
            }

            sequencePayload.push({
              sequence: sequence,
              messages: messages,
              subscribers: subscribers
            })
            if (sequencePayload.length === sequences.length) {
              res.status(200).json({status: 'success', payload: sequencePayload})
            }
          })
        })
      })
    })
  })
}

exports.getAll = function (req, res) {
  /*
  body = {
    first_page:
    last_id:
    number_of_records:
    filter:
    filter_criteria: {
      search_value:
    }
  }
  */
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    if (req.body.first_page) {
      let search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
      let findCriteria = {
        companyId: companyUser.companyId,
        name: req.body.filter_criteria.search_value !== '' ? {$regex: search} : {$exists: true}
      }
      Sequences.aggregate([
        { $match: findCriteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, sequenceCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        Sequences.find(findCriteria).limit(req.body.number_of_records)
        .exec((err, sequences) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          let sequencePayload = []
          sequences.forEach(sequence => {
            Messages.find({sequenceId: sequence._id},
            (err, messages) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }

              SequenceSubscribers.find({sequenceId: sequence._id})
              .populate('subscriberId')
              .exec((err, subscribers) => {
                if (err) {
                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                }

                sequencePayload.push({
                  sequence: sequence,
                  messages: messages,
                  subscribers: subscribers
                })
                if (sequencePayload.length === sequences.length) {
                  res.status(200).json({
                    status: 'success',
                    payload: {sequences: sequencePayload, count: sequencePayload.length > 0 ? sequenceCount[0].count : ''}
                  })
                }
              })
            })
          })
        })
      })
    } else {
      let search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
      let findCriteria = {
        companyId: companyUser.companyId,
        name: req.body.filter_criteria.search_value !== '' ? {$regex: search} : {$exists: true}
      }
      Sequences.aggregate([
        { $match: findCriteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, sequenceCount) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'BroadcastsCount not found'})
        }
        Sequences.find(Object.assign(findCriteria, {_id: {$gt: req.body.last_id}})).limit(req.body.number_of_records)
        .exec((err, sequences) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          let sequencePayload = []
          sequences.forEach(sequence => {
            Messages.find({sequenceId: sequence._id},
            (err, messages) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }

              SequenceSubscribers.find({sequenceId: sequence._id})
              .populate('subscriberId')
              .exec((err, subscribers) => {
                if (err) {
                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                }

                sequencePayload.push({
                  sequence: sequence,
                  messages: messages,
                  subscribers: subscribers
                })
                if (sequencePayload.length === sequences.length) {
                  res.status(200).json({
                    status: 'success',
                    payload: {sequences: sequencePayload, count: sequencePayload.length > 0 ? sequenceCount[0].count : ''}
                  })
                }
              })
            })
          })
        })
      })
    }
  })
}

exports.subscriberSequences = function (req, res) {
  SequenceSubscribers.find({subscriberId: req.params.id, status: 'subscribed'})
  .populate('sequenceId')
  .exec((err, sequences) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({status: 'success', payload: sequences})
  })
}

exports.subscribeToSequence = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'sequenceId')) parametersMissing = true
  if (!_.has(req.body, 'subscriberIds')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    req.body.subscriberIds.forEach(subscriberId => {
    // Following code will run when user subscribes to sequence
      SequenceMessages.find({sequenceId: req.body.sequenceId}, (err, messages) => {
        if (err) {
          res.status(500).json({
            status: 'Failed',
            description: 'Failed to insert record'
          })
        }

        messages.forEach(message => {
          if (message.schedule.condition === 'immediately') {
            message.isActive = true
            if (message.isActive === true) {
              Subscribers.findOne({'_id': subscriberId}, (err, subscriber) => {
                if (err) {
                  return res.status(404)
                  .json({status: 'failed', description: 'Record not found'})
                }

                Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
                  if (err) {
                    return res.status(404)
                    .json({status: 'failed', description: 'Record not found'})
                  }

                  if (message.payload.length > 0) {
                    AppendURLCount(message, (newPayload) => {
                      let sequenceSubMessage = new SequenceSubscriberMessage({
                        subscriberId: subscriberId,
                        messageId: message._id,
                        companyId: subscriber.companyId,
                        datetime: new Date(),
                        seen: false
                      })

                      sequenceSubMessage.save((err2, result) => {
                        if (err2) {
                          logger.serverLog(TAG, {
                            status: 'failed',
                            description: 'Sequence Message Subscriber addition create failed',
                            err2
                          })
                        }
                        logger.serverLog(TAG, `UPDATE SENT COUNT ${JSON.stringify(message._id)}`)
                        SequenceMessages.update(
                          {_id: message._id},
                          {$inc: {sent: 1}},
                          {multi: true}, (err, updated) => {
                            if (err) {
                              logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                            }
                          })
                        BroadcastUtility.getBatchData(newPayload, subscriber.senderId, page, sendSequence, subscriber.firstName, subscriber.lastName)
                      })
                    })
                  }
                })
              })
            }
          } else {
            let sequenceQueuePayload = {
              sequenceId: req.body.sequenceId,
              subscriberId: subscriberId,
              companyId: companyUser.companyId,
              sequenceMessageId: message._id,
              queueScheduledTime: message.schedule.date,
              isActive: message.isActive
            }

            const sequenceMessageForQueue = new SequenceMessageQueue(sequenceQueuePayload)
            sequenceMessageForQueue.save((err, messageQueueCreated) => {
              if (err) {
                res.status(500).json({
                  status: 'Failed',
                  description: 'Failed to insert record in Queue'
                })
              }
            }) //  save ends here
          }  // else ends here
        })  // Messages Foreach ends here

        let sequenceSubscriberPayload = {
          sequenceId: req.body.sequenceId,
          subscriberId: subscriberId,
          companyId: companyUser.companyId,
          status: 'subscribed'
        }
        const sequenceSubcriber = new SequenceSubscribers(sequenceSubscriberPayload)

        // save model to MongoDB
        sequenceSubcriber.save((err, subscriberCreated) => {
          if (err) {
            res.status(500).json({
              status: 'Failed',
              description: 'Failed to insert record'
            })
          } else if (subscriberId === req.body.subscriberIds[req.body.subscriberIds.length - 1]) {
            require('./../../config/socketio').sendMessageToClient({
              room_id: companyUser.companyId,
              body: {
                action: 'sequence_update',
                payload: {
                  sequence_id: req.body.sequenceId
                }
              }
            })
            res.status(201).json({status: 'success', description: 'Subscribers subscribed successfully'})
          }
        })  // Sequence subscriber save ends here
      }) // Sequence message find ends here
    })  //  Foreach ends of subscriber id
  })
}

exports.unsubscribeToSequence = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'sequenceId')) parametersMissing = true
  if (!_.has(req.body, 'subscriberIds')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    req.body.subscriberIds.forEach(subscriberId => {
      SequenceSubscribers.remove({sequenceId: req.body.sequenceId})
      .where('subscriberId').equals(subscriberId)
      .exec((err, updated) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        SequenceMessageQueue.remove({sequenceId: req.body.sequenceId, subscriberId: subscriberId}, (err, result) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          Subscribers.findOne({ _id: subscriberId }, (err, subscriber) => {
            if (err) {
              logger.serverLog(TAG,
                `Error occurred in finding subscriber ${JSON.stringify(
                  err)}`)
            }
            if (subscriber) {
              logger.serverLog(TAG, `Unsubscribes ${JSON.stringify(subscriber)}`)
              setSequenceTrigger(subscriber.companyId, subscriber._id, {event: 'unsubscribes_from_other_sequence', value: req.body.sequenceId})
            }
          })
          if (subscriberId === req.body.subscriberIds[req.body.subscriberIds.length - 1]) {
            require('./../../config/socketio').sendMessageToClient({
              room_id: companyUser.companyId,
              body: {
                action: 'sequence_update',
                payload: {
                  sequence_id: req.body.sequenceId
                }
              }
            })
            res.status(201).json({status: 'success', description: 'Subscribers unsubscribed successfully'})
          }
        })
      })
    })
  })
}

exports.deleteSequence = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    Sequences.deleteOne({_id: req.params.id}, (err, deleted) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }

      SequenceSubscribers.deleteMany({sequenceId: req.params.id}, (err, result) => {
        if (err) {
          return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
        }

        SequenceMessageQueue.deleteMany({sequenceId: req.params.id}, (err, result) => {
          if (err) {
            return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
          }

          SequenceMessages.deleteMany({sequenceId: req.params.id}, (err, result) => {
            if (err) {
              return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
            }

            require('./../../config/socketio').sendMessageToClient({
              room_id: companyUser.companyId,
              body: {
                action: 'sequence_delete',
                payload: {
                  sequence_id: req.params.id
                }
              }
            })
            res.status(201).json({status: 'success', payload: deleted})
          })  //  ends sequence message delete
        }) // ends queue deletemany
      })  // ends sequence-sub deletemany
    })  //  ends sequence delete one
  })
}

exports.deleteMessage = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }

    SequenceMessages.deleteOne({_id: req.params.id}, (err, deleted) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }

      SequenceMessageQueue.deleteMany({sequenceMessageId: req.params.id}, (err, result) => {
        if (err) {
          return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
        }

        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'sequence_delete',
            payload: {
              sequence_id: req.params.id
            }
          }
        })
        res.status(201).json({status: 'success', payload: deleted})
      })  // message queue deletemany ends here
    })  // sequence message deleteOne ends here
  })
}

exports.updateTrigger = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'trigger')) parametersMissing = true
  if (!_.has(req.body, 'type')) parametersMissing = true

  // Checking the type to update the trigger
  if (req.body.type === 'sequence') {
    if (!_.has(req.body, 'sequenceId')) parametersMissing = true
  } else if (req.body.type === 'message') {
    if (!_.has(req.body, 'messageId')) parametersMissing = true
  }

  // If parameter missing return
  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  // Logic to update trigger for sequence
  if (req.body.type === 'sequence') {
    Sequences.updateOne({_id: req.body.sequenceId}, {trigger: req.body.trigger}, (err, result) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          description: 'Failed to update record'
        })
      } else {
        res.status(200).json({status: 'success', payload: result})
      }
    })
  } else if (req.body.type === 'message') {   // Logic to update the trigger if the type is message
    SequenceMessages.updateOne({_id: req.body.messageId}, {trigger: req.body.trigger}, (err, result) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          description: 'Failed to update record'
        })
      } else {
        res.status(200).json({status: 'success', payload: result})
      }
    })
  }
}

exports.updateSegmentation = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'sequenceId')) parametersMissing = true
  if (!_.has(req.body, 'segmentation')) parametersMissing = true

  // check if all the indexes of segmentation have required properties
  for (let i = 0, length = req.body.segmentation.length; i < length; i++) {
    if (!(req.body.segmentation[i].condition)) parametersMissing = true
    if (!(req.body.segmentation[i].criteria)) parametersMissing = true
    if (!(req.body.segmentation[i].value)) parametersMissing = true
  }

  if (!_.has(req.body, 'messageId')) parametersMissing = true

  // If parameter missing return
  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Sequences.updateOne({_id: req.body.sequenceId}, {segmentation: req.body.segmentation}, (err, result) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        description: 'Failed to update record'
      })
    } else {
      res.status(200).json({status: 'success', payload: result})
    }
  })
}

exports.testScheduler = function (req, res) {
  let sequencePayload = {
    name: req.body.name
  }
  const sequence = new Sequences(sequencePayload)

  // save model to MongoDB
  sequence.save((err, sequenceCreated) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: sequenceCreated})
    }
  })
}

const AppendURLCount = function (sequenceMessage, callback) {
  logger.serverLog(TAG, `Append URL count${JSON.stringify(sequenceMessage)}`)
  if (sequenceMessage.payload.length > 0) {
    let newPayload = sequenceMessage.payload
    sequenceMessage.payload.forEach((payloadItem, pindex) => {
      if (payloadItem.buttons) {
        payloadItem.buttons.forEach((button, bindex) => {
          if (!(button.type === 'postback')) {
            let URLObject = new URL({
              originalURL: button.url,
              module: {
                id: sequenceMessage._id,
                type: 'sequence'
              }
            })
            URLObject.save((err, savedurl) => {
              if (err) logger.serverLog(TAG, err)
              let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
              newPayload[pindex].buttons[bindex].url = newURL
            })
          }
        })
      }
      if (payloadItem.componentType === 'media' && payloadItem.buttons) {
        payloadItem.buttons.forEach((button, bindex) => {
          let URLObject = new URL({
            originalURL: button.url,
            module: {
              id: sequenceMessage._id,
              type: 'sequence'
            }
          })
          URLObject.save((err, savedurl) => {
            if (err) logger.serverLog(TAG, err)
            let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
            newPayload[pindex].buttons[bindex].url = newURL
          })
        })
      }
      if (payloadItem.componentType === 'gallery') {
        payloadItem.cards.forEach((card, cindex) => {
          card.buttons.forEach((button, bindex) => {
            let URLObject = new URL({
              originalURL: button.url,
              module: {
                id: sequenceMessage._id,
                type: 'sequence'
              }
            })
            URLObject.save((err, savedurl) => {
              if (err) logger.serverLog(TAG, err)
              let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
              newPayload[pindex].cards[cindex].buttons[bindex].url = newURL
            })
          })
        })
      }
      if (payloadItem.componentType === 'list') {
        payloadItem.listItems.forEach((element, lindex) => {
          if (element.buttons && element.buttons.length > 0) {
            element.buttons.forEach((button, bindex) => {
              let URLObject = new URL({
                originalURL: button.url,
                module: {
                  id: sequenceMessage._id,
                  type: 'sequence'
                }
              })
              URLObject.save((err, savedurl) => {
                if (err) logger.serverLog(TAG, err)
                let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
                newPayload[pindex].listItems[lindex].buttons[bindex].url = newURL
              })
            })
          }
          if (element.default_action) {
            let URLObject = new URL({
              originalURL: element.default_action.url,
              module: {
                id: sequenceMessage._id,
                type: 'sequence'
              }
            })
            URLObject.save((err, savedurl) => {
              if (err) logger.serverLog(TAG, err)
              let newURL = config.domain + '/api/URL/sequence/' + savedurl._id
              newPayload[pindex].listItems[lindex].default_action.url = newURL
            })
          }
        })
      }
    })
    callback(newPayload)
  }
}

const sendSequence = (batchMessages, page) => {
  const r = request.post('https://graph.facebook.com', (err, httpResponse, body) => {
    if (err) {
      return logger.serverLog(TAG, `Batch send error ${JSON.stringify(err)}`)
    }
    logger.serverLog(TAG, `Batch send response ${JSON.stringify(body)}`)
  })
  const form = r.form()
  form.append('access_token', page.accessToken)
  form.append('batch', batchMessages)
}

const setSequenceTrigger = function (companyId, subscriberId, trigger) {
  Sequences.find({companyId: companyId},
  (err, sequences) => {
    if (err) {
      return logger.serverLog(TAG, `ERROR getting sequence ${JSON.stringify(err)}`)
    }
    if (sequences) {
      sequences.forEach(sequence => {
        if (sequence.trigger && sequence.trigger.event) {
          if ((sequence.trigger.event === trigger.event && !trigger.value) || (sequence.trigger.event === trigger.event && sequence.trigger.value === trigger.value)) {
            SequenceMessages.find({sequenceId: sequence._id}, (err, messages) => {
              if (err) {
                return logger.serverLog(TAG, `ERROR getting sequence message${JSON.stringify(err)}`)
              }
              if (messages) {
                messages.forEach(message => {
                  if (message.schedule.condition === 'immediately') {
                    if (message.isActive === true) {
                      Subscribers.findOne({'_id': subscriberId}, (err, subscriber) => {
                        if (err) {
                          return logger.serverLog(TAG, `ERROR getting subscribers ${JSON.stringify(err)}`)
                        }

                        Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
                          if (err) {
                            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                          }

                          if (message.payload.length > 0) {
                            AppendURLCount(message, (newPayload) => {
                              let sequenceSubMessage = new SequenceSubscriberMessage({
                                subscriberId: subscriberId,
                                messageId: message._id,
                                companyId: subscriber.companyId,
                                datetime: new Date(),
                                seen: false
                              })
                              sequenceSubMessage.save((err2, result) => {
                                if (err2) {
                                  return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                }
                                logger.serverLog(TAG, `UPDATE SENT COUNT ${JSON.stringify(message._id)}`)
                                SequenceMessages.update(
                                  {_id: message._id},
                                  {$inc: {sent: 1}},
                                  {multi: true}, (err, updated) => {
                                    if (err) {
                                      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                    }
                                  })
                                BroadcastUtility.getBatchData(newPayload, subscriber.senderId, page, sendSequence, subscriber.firstName, subscriber.lastName)
                              })
                            })
                          }
                        })
                      })
                    }
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
                    let sequenceQueuePayload = {
                      sequenceId: sequence._id,
                      subscriberId: subscriberId,
                      companyId: companyId,
                      sequenceMessageId: message._id,
                      queueScheduledTime: utcDate,
                      isActive: message.isActive
                    }
                    const sequenceMessageForQueue = new SequenceMessageQueue(sequenceQueuePayload)
                    sequenceMessageForQueue.save((err, messageQueueCreated) => {
                      if (err) {
                        return logger.serverLog(TAG, `ERROR saving message in queue${JSON.stringify(err)}`)
                      }
                    })
                  }
                })
              }
            })

            let sequenceSubscriberPayload = {
              sequenceId: sequence._id,
              subscriberId: subscriberId,
              companyId: companyId,
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
            })
          }
        }
      })
    }
  })
}
exports.setSequenceTrigger = setSequenceTrigger
