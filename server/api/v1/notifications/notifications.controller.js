const Notifications = require('./notifications.model')
const logger = require('../../../components/logger')
const TAG = 'api/teams/teams.controller.js'
const _ = require('lodash')

exports.index = function (req, res) {
  Notifications.find({agentId: req.user._id})
  .populate('agentId')
  .exec((err, notifications) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    return res.status(201).json({status: 'success', payload: {notifications: notifications}})
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'message')) parametersMissing = true
  if (!_.has(req.body, 'category')) parametersMissing = true
  if (!_.has(req.body, 'agentIds')) parametersMissing = true
  if (!_.has(req.body, 'companyId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  req.body.agentIds.forEach((agentId,i) => {
    const notification = new Notifications({
      message: req.body.message,
      category: req.body.category,
      agentId: agentId,
      companyId: req.body.companyId
    })

    notification.save((err, savedNotification) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Broadcasts not created'})
      }
      if (i === (req.body.agentIds.length - 1)) {
        return res.status(200).json({status: 'success', payload: savedNotification})
      }

    })
  })
}

exports.markRead = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'notificationId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Notifications.update(
    {_id: req.body.notificationId},
    {seen: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      res.status(200).json({status: 'success', payload: updated})
    })
}
