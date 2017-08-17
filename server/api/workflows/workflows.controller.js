/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Workflows = require('./Workflows.model')
const TAG = 'api/workflows/workflows.controller.js'

exports.index = function (req, res) {
  Workflows.find({userId: req.user._id}, (err, workflows) => {
    logger.serverLog(TAG, workflows)
    logger.serverLog(TAG, `Error: ${err}`)
    res.status(200).json(workflows)
  })
}

exports.create = function (req, res) {
  const workflow = new Workflows({
    condition: req.body.condition,
    keywords: req.body.keywords,
    reply: req.body.reply,
    isActive: (req.body.isActive === 'Yes'),
    userId: req.user._id,
    sent: 0
  })

  // save model to MongoDB
  workflow.save((err, workflow) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        error: err,
        description: 'Failed to insert record'
      })
    } else {
      res.status(200).json({ status: 'Success', payload: workflow })
    }
  })
}

exports.edit = function (req, res) {
  Workflows.findById(req.body._id, (err, workflow) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'workflow not found'})
    }

    workflow.condition = req.body.condition,
    workflow.keywords = req.body.keywords,
    workflow.reply = req.body.reply,
    workflow.isActive = (req.body.isActive === 'Yes'),
    workflow.save((err2) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'workflow update failed.'})
      }
      return res.status(200)
        .json({status: 'success', payload: req.body})
    })
  })
}

exports.enable = function (req, res) {
  Workflows.findById(req.body._id, (err, workflow) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'workflow not found'})
    }

    workflow.isActive = true,
    workflow.save((err2) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'workflow update failed.'})
      }
      return res.status(200)
        .json({status: 'success', payload: req.body})
    })
  })
}

exports.disable = function (req, res) {
  logger.serverLog(TAG, 'Workflows' + JSON.stringify(req.body))
  Workflows.findById(req.body._id, (err, workflow) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'workflow not found'})
    }

    workflow.isActive = false,
    workflow.save((err2) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'workflow update failed.'})
      }
      return res.status(200)
        .json({status: 'success', payload: req.body})
    })
  })
}
exports.sent = function (req, res) {
  Workflows.update({ _id: req.body._id }, { sent: req.body.sent },
    { multi: true }, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      } else {
        res.status(200).json({ status: 'Success' })
      }
    }
  )
}

exports.report = function (req, res) {

}
exports.send = function (req, res) {

}

exports.seed = function (req, res) {
  const rawDocuments = [
    {
      condition: 'message_contains',
      keywords: ['Hi', 'Hello', 'Howdy'],
      reply: 'How are you?',
      isActive: true,
      sent: 0
    },
    {
      condition: 'message_contains',
      keywords: ['Hi', 'Hello', 'Howdy'],
      reply: 'How are you?',
      isActive: true,
      sent: 0
    },
    {
      condition: 'message_begins',
      keywords: ['Hi', 'Hello', 'Howdy'],
      reply: 'How are you?',
      isActive: true,
      sent: 0
    },
    {
      condition: 'message_is',
      keywords: ['Hi', 'Hello', 'Howdy'],
      reply: 'How are you?',
      isActive: true,
      sent: 0
    },
    {
      condition: 'message_is',
      keywords: ['Hi', 'Hello', 'Howdy'],
      reply: 'How are you?',
      isActive: true,
      sent: 0
    }
  ]

  Workflows.insertMany(rawDocuments)
    .then((mongooseDocuments) => {
      logger.serverLog(TAG, 'Workflows Table Seeded')
      res.status(200).json({ status: 'Success' })
    })
    .catch((err) => {
      /* Error handling */
      logger.serverLog(TAG, 'Unable to seed the database')
      res.status(500).json({ status: 'Failed', err })
    })
}
