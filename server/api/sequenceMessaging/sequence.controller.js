const Messages = require('./message.model')
const Sequences = require('./sequence.model')
const SequenceSubscribers = require('./sequenceSubscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const logger = require('../../components/logger')
const TAG = 'api/sequenceMessaging/sequence.controller.js'
const _ = require('lodash')

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
      })
    })
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
      SequenceSubscribers.update(
      {sequenceId: req.body.sequenceId, subscriberId: subscriberId},
      {status: 'unsubscribed'}, {multi: true}, (err, updated) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
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
          res.status(201).json({status: 'success', description: 'Subscribers unsubscribed successfully'})
        }
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
    })
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

    Messages.deleteOne({_id: req.params.id}, (err, deleted) => {
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
    })
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
