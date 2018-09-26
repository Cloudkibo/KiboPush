const logger = require('../../../components/logger')
const CronShcedulerQueue = require('./cron_scheduler.model')

const TAG = 'api/cron_scheduler/cron_scheduler.controller.js'

const _ = require('lodash')

exports.index = function (req, res) {
  CronShcedulerQueue.find({}, (err, schedulers) => {
    if (err) {
      logger.serverLog(TAG, JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!schedulers) {
      return res.status(404).json({
        status: 'failed',
        description: 'Scheduler Queue is empty. Please add schedulers'
      })
    }

    res.status(200).json({
      status: 'success',
      payload: schedulers
    })
  })
}

exports.Create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'serviceName')) parametersMissing = true
  if (!_.has(req.body, 'scriptPath')) parametersMissing = true
  if (!_.has(req.body, 'timeAmount')) parametersMissing = true
  if (!_.has(req.body, 'timeUnit')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  let payload = {
    serviceName: req.body.serviceName,
    scriptPath: req.body.scriptPath,
    timeAmount: req.body.timeAmount,
    timeUnit: req.body.timeUnit
  }

  let scheduler = new CronShcedulerQueue(payload)
  scheduler.save((err, result) => {
    if (err) {
      logger.serverLog(TAG, JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    if (result) {
      res.status(200).json({
        status: 'success',
        payload: result
      })
    }
  })
}

exports.Edit = function (req, res) {
  let serviceName
  let scriptPath
  let timeAmount
  let timeUnit
  let parametersMissing = false

  if (!_.has(req.body, '_id')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  if (_.has(req.body, 'serviceName')) serviceName = req.body.serviceName
  if (_.has(req.body, 'scriptPath')) scriptPath = req.body.scriptPath
  if (_.has(req.body, 'timeAmount')) timeAmount = req.body.timeAmount
  if (_.has(req.body, 'timeUnit')) timeUnit = req.body.timeUnit

  CronShcedulerQueue.findOne({_id: req.body._id}, (err, payload) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    if (payload) {
      if (serviceName) payload.serviceName = serviceName
      if (scriptPath) payload.scriptPath = scriptPath
      if (timeAmount) payload.timeAmount = timeAmount
      if (timeUnit) payload.timeUnit = timeUnit

      payload.save((err, result) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }

        if (result) {
          res.status(200).json({
            status: 'success',
            payload: result
          })
        }
      })
    }
  })
}

exports.Delete = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, '_id')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CronShcedulerQueue.deleteOne({ _id: req.body._id }, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    if (result) {
      res.status(200).json({
        status: 'success',
        payload: result
      })
    }
  })
}
