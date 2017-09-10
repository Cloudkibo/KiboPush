/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const AutoPosting = require('./autopostings.model')
const TAG = 'api/autoposting/autopostings.controller.js'

exports.index = function (req, res) {
  AutoPosting.find({userId: req.user._id}, (err, autoposting) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Autoposting query failed'})
    }
    res.status(200).json({
      status: 'success',
      payload: autoposting
    })
  })
}

exports.create = function (req, res) {
  // todo check for individual content creator services validity
  logger.serverLog(TAG,
    `Inside Create Autoposting, req body = ${JSON.stringify(req.body)}`)
  let autoPostingPayload = {
    userId: req.user._id,
    subscriptionUrl: req.body.subscriptionUrl,
    subscriptionType: req.body.subscriptionType
  }
  if (req.body.isSegmented) {
    autoPostingPayload.isSegmented = true
    autoPostingPayload.segmentationPageIds = (req.body.pageIds)
      ? req.body.pageIds
      : null
    autoPostingPayload.segmentationGender = (req.body.gender)
      ? req.body.gender
      : null
    autoPostingPayload.segmentationLocale = (req.body.locale)
      ? req.body.locale
      : null
  }
  const autoPosting = new AutoPosting(autoPostingPayload)
  autoPosting.save((err, createdRecord) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        error: err,
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: createdRecord})
    }
  })
}

exports.edit = function (req, res) {
  logger.serverLog(TAG,
    `This is body in edit autoposting ${JSON.stringify(req.body)}`)
  // todo check for individual content creator services validity
  AutoPosting.findById(req.body._id, (err, autoposting) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!autoposting) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }

    autoposting.subscriptionUrl = req.body.subscriptionUrl
    autoposting.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      return res.status(200).json({status: 'success', payload: autoposting})
    })
  })
}

exports.enable = function (req, res) {
  logger.serverLog(TAG,
    `This is body in enable autoposting ${JSON.stringify(req.body)}`)
  // todo check for individual content creator services validity
  AutoPosting.findById(req.body._id, (err, autoposting) => {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!autoposting) {
      return res.status(404)
      .json({status: 'failed', description: 'Record not found'})
    }

    autoposting.isActive = true
    autoposting.save((err2) => {
      if (err2) {
        return res.status(500)
        .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      return res.status(200).json({status: 'success', payload: autoposting})
    })
  })
}

exports.disable = function (req, res) {
  logger.serverLog(TAG,
    `This is body in disable autoposting ${JSON.stringify(req.body)}`)
  // todo check for individual content creator services validity
  AutoPosting.findById(req.body._id, (err, autoposting) => {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!autoposting) {
      return res.status(404)
      .json({status: 'failed', description: 'Record not found'})
    }

    autoposting.isActive = false
    autoposting.save((err2) => {
      if (err2) {
        return res.status(500)
        .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      return res.status(200).json({status: 'success', payload: autoposting})
    })
  })
}
