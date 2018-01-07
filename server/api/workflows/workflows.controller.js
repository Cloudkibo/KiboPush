/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Workflows = require('./Workflows.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/workflows/workflows.controller.js'
const _ = require('lodash')

exports.index = function (req, res) {
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
    Workflows.find({companyId: companyUser.companyId}, (err, workflows) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({status: 'success', payload: workflows})
    })
  })
}

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Workflows create payload ' + JSON.stringify(req.body))

  let parametersMissing = false

  if (!_.has(req.body, 'condition')) parametersMissing = true
  if (!_.has(req.body, 'keywords')) parametersMissing = true
  if (!_.has(req.body, 'reply')) parametersMissing = true
  if (!_.has(req.body, 'isActive')) parametersMissing = true

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
    const workflow = new Workflows({
      condition: req.body.condition,
      keywords: req.body.keywords,
      reply: req.body.reply,
      isActive: (req.body.isActive === 'Yes'),
      userId: req.user._id,
      companyId: companyUser.companyId,
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
        logger.serverLog(TAG, 'Workflows created successfully ' + JSON.stringify(req.workflow))
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'workflow_created',
            payload: {
              workflow_id: workflow._id,
              user_id: req.user._id,
              user_name: req.user.name,
              company_id: companyUser.companyId
            }
          }
        })
        res.status(201).json({status: 'success', payload: workflow})
      }
    })
  })
}

exports.edit = function (req, res) {
  Workflows.findById(req.body._id, (err, workflow) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    workflow.condition = req.body.condition
    workflow.keywords = req.body.keywords
    workflow.reply = req.body.reply
    workflow.isActive = (req.body.isActive === 'Yes')
    workflow.save((err2) => {
      if (err2) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err2)}`
        })
      }
      require('./../../config/socketio').sendMessageToClient({
        room_id: req.body.companyId,
        body: {
          action: 'workflow_updated',
          payload: {
            workflow_id: workflow._id,
            user_id: req.user._id,
            user_name: req.user.name,
            company_id: req.body.companyId
          }
        }
      })
      return res.status(200).json({status: 'success', payload: req.body})
    })
  })
}

exports.enable = function (req, res) {
  Workflows.findById(req.body._id, (err, workflow) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    workflow.isActive = true
    workflow.save((err2) => {
      if (err2) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err2)}`
        })
      }
      return res.status(200).json({status: 'success', payload: req.body})
    })
  })
}

exports.disable = function (req, res) {
  Workflows.findById(req.body._id, (err, workflow) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    workflow.isActive = false
    workflow.save((err2) => {
      if (err2) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err2)}`
        })
      }
      return res.status(200).json({status: 'success', payload: req.body})
    })
  })
}
exports.sent = function (req, res) {
  Workflows.update({_id: req.body._id}, {sent: req.body.sent},
    {multi: true}, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      } else {
        res.status(200).json({status: 'success'})
      }
    }
  )
}

exports.report = function (req, res) {

}
exports.send = function (req, res) {

}
