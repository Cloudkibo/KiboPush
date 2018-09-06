const Messages = require('./message.model')
const Sequences = require('./sequence.model')
const SequenceSubscribers = require('./sequenceSubscribers.model')
const SequenceMessages = require('./message.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const SequenceMessageQueue = require('./../SequenceMessageQueue/SequenceMessageQueue.model')
const logger = require('../../components/logger')
const TAG = 'api/sequenceMessaging/sequence.controller.js'
const Subscribers = require('./../subscribers/Subscribers.model')
const _ = require('lodash')
const utility = require('./utility')
const mongoose = require('mongoose')

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
        utility.addToMessageQueue(req.body.sequenceId, req.body.schedule.date, messageCreated._id)
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
    SequenceMessages.findById(req.body.messageId, (err, message) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!message) {
        return res.status(404)
          .json({status: 'failed', description: 'Record not found'})
      }
      SequenceMessageQueue.update({sequenceMessageId: message._id}, {queueScheduledTime: req.body.date}, {multi: true},
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
      })
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

// exports.setStatus = function (req, res) {
//   CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
//     if (err) {
//       return res.status(500).json({
//         status: 'failed',
//         description: `Internal Server Error ${JSON.stringify(err)}`
//       })
//     }
//     if (!companyUser) {
//       return res.status(404).json({
//         status: 'failed',
//         description: 'The user account does not belong to any company. Please contact support'
//       })
//     }
//     Messages.findById(req.body.messageId, (err, message) => {
//       if (err) {
//         return res.status(500)
//           .json({status: 'failed', description: 'Internal Server Error'})
//       }
//       if (!message) {
//         return res.status(404)
//           .json({status: 'failed', description: 'Record not found'})
//       }
//       // this will update the status in queue. Queue will only send active messages
//       if (message.schedule.condition === 'immediately') {
//         SequenceMessageQueue.find({'sequenceMessageId': message._id}, (err, messagesFromQueue) => {
//           if (err) {
//             return res.status(404)
//             .json({status: 'failed', description: 'Record not found'})
//           }
//           for (let i = 0; i < messagesFromQueue.length; i++) {
//             let messageFromQueue = messagesFromQueue[i]
//             if (messageFromQueue) {
//               Subscribers.findOne({'_id': messageFromQueue.subscriberId}, (err, subscriber) => {
//                 if (err) {
//                   return res.status(404)
//                   .json({status: 'failed', description: 'Record not found'})
//                 }
//
//                 Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
//                   if (err) {
//                     return res.status(404)
//                     .json({status: 'failed', description: 'Record not found'})
//                   }
//
//                   if (message.payload.length > 0) {
//                     AppendURLCount(message, (newPayload) => {
//                       logger.serverLog(TAG, `New Payload ${JSON.stringify(newPayload)}`)
//                       let sequenceSubMessage = new SequenceSubscriberMessage({
//                         subscriberId: messageFromQueue.subscriberId,
//                         messageId: message._id,
//                         companyId: messageFromQueue.companyId,
//                         datetime: new Date(),
//                         seen: false
//                       })
//
//                       sequenceSubMessage.save((err2, result) => {
//                         if (err2) {
//                           logger.serverLog(TAG, {
//                             status: 'failed',
//                             description: 'Sequence Message Subscriber addition create failed',
//                             err2
//                           })
//                         }
//                         logger.serverLog(TAG, `UPDATE SENT COUNT ${JSON.stringify(req.body.messageId)}`)
//                         SequenceMessages.update(
//                           {_id: req.body.messageId},
//                           {$inc: {sent: 1}},
//                           {multi: true}, (err, updated) => {
//                             if (err) {
//                               logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
//                             }
//                           })
//                         BroadcastUtility.getBatchData(newPayload, subscriber.senderId, page, sendSequence, subscriber.firstName, subscriber.lastName, req.body.fbMessageTag)
//                         SequenceMessageQueue.deleteOne({'_id': messageFromQueue._id}, (err, result) => {
//                           if (err) {
//                             logger.serverLog(TAG, `could not delete the message from queue ${JSON.stringify(err)}`)
//                           }
//                         })
//                       })
//                     })
//                   }
//                 })
//               })
//             }
//           }
//         })
//       } else {
//         SequenceMessageQueue.update({sequenceMessageId: req.body.messageId}, {isActive: req.body.isActive}, {multi: true}, (err, result) => {
//           if (err) {
//             return res.status(500)
//             .json({status: 'failed', description: 'Internal Server Error'})
//           }
//
//           logger.serverLog(TAG, 'updated the status in queue')
//         })
//       }
//       message.isActive = req.body.isActive
//       message.save((err2) => {
//         if (err2) {
//           return res.status(500)
//             .json({status: 'failed', description: 'Poll update failed'})
//         }
//         require('./../../config/socketio').sendMessageToClient({
//           room_id: companyUser.companyId,
//           body: {
//             action: 'sequence_update',
//             payload: {
//               sequence_id: message.sequenceId
//             }
//           }
//         })
//         res.status(201).json({status: 'success', payload: message})
//       })
//     })
//   })
// }

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

    Sequences.find({companyId: companyUser.companyId}, {}, {sort: {datetime: 1}},
    (err, sequences) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      let sequencePayload = []
      if (sequences.length > 0) {
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
      } else {
        res.status(200).json({status: 'success', payload: []})
      }
    })
  })
}

exports.getAll = function (req, res) {
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
          }
          messages.forEach(message => {
            if (message.schedule.condition === 'immediately') {
              utility.addToMessageQueue(req.body.sequenceId, new Date(), message._id)
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
              utility.addToMessageQueue(req.body.sequenceId, utcDate, message._id)
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
  } else if (req.body.type === 'message') {
    console.log('req--', JSON.stringify(req.body))  // Logic to update the trigger if the type is message
    let trigger = req.body.trigger[0]
    if (trigger.event === 'clicks') {
      let messageIdToBeUpdated = mongoose.Types.ObjectId(trigger.value)
      // find the message whose payload needs to be updated
      SequenceMessages.findOne({_id: messageIdToBeUpdated}, (err, seqMessage) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (seqMessage) {
          let tempPayloadArray = []
          let tempButtonsArray = []
          let payLoadArray = seqMessage.payload
          if (payLoadArray.length > 0) {
            for (let payLoad of payLoadArray) {
              let buttonArray = payLoad.buttons
              if (buttonArray.length > 0) {
                for (let button of buttonArray) {
                  if (button.buttonId === trigger.buttonId) {
                    button.type = 'postback'
                    tempButtonsArray.push(button)
                  }
                }
              }
              tempPayloadArray.push(payLoad)
            }
          }
          seqMessage.payLoad = tempPayloadArray
          console.log('seqMessage', JSON.stringify(seqMessage))
          const sequenceMesaage = new SequenceMessages(seqMessage)
          sequenceMesaage.save((err, savedMessage) => {
            if (err) {
              return res.status(404).json({ status: 'failed', description: 'Record Not Updated' })
            }
          })
        }
      })
    }

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
  if (!_.has(req.body, 'segmentationCondition')) parametersMissing = true

  // If parameter missing return
  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  SequenceMessages.updateOne({_id: req.body.messageId}, {segmentation: req.body.segmentation, segmentationCondition: req.body.segmentationCondition},
      (err, result) => {
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
                  if (messages) {
                    messages.forEach(message => {
                      if (message.schedule.condition === 'immediately') {
                        utility.addToMessageQueue(sequence._id, new Date(), message._id)
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
                        utility.addToMessageQueue(sequence._id, utcDate, message._id)
                      }
                    })
                  }
                  // insert socket.io code here
                  logger.serverLog(TAG, `Subscribed to sequence successfully`)
                }
              })
            })
          }
        }
      })
    }
  })
}
exports.setSequenceTrigger = setSequenceTrigger
