const Messages = require('./../sequenceMessaging/message.model')
const Sequences = require('./../sequenceMessaging/sequence.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const _ = require('lodash')

exports.allMessages = function (req, res) {
  Messages.find({SequenceId: req.params.id},
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
      res.status(201).json({status: 'success', payload: messageCreated})
    }
  })
}

exports.editMessage = function (req, res) {
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
    message.schedule = req.body.schedule
    message.payload = req.body.payload
    message.isActive = req.body.isActive
    message.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: message})
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
      res.status(201).json({status: 'success', payload: sequence})
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
      res.status(200).json({status: 'success', payload: sequences})
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
