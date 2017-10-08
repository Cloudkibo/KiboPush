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
  AutoPosting.find({userId: req.user._id, subscriptionUrl: req.body.subscriptionUrl}, (error, gotData) => {
    if (error) {
      res.status(500).json({
        status: 'Failed',
        error: error,
        description: 'Internal Server Error'
      })
    }
    if (gotData.length > 0) {
      res.status(403).json({
        status: 'Failed',
        description: 'Cannot add duplicate accounts.'
      })
    } else {
      let autoPostingPayload = {
        userId: req.user._id,
        subscriptionUrl: req.body.subscriptionUrl,
        subscriptionType: req.body.subscriptionType,
        accountTitle: req.body.accountTitle
      }
      if (req.body.isSegmented) {
        autoPostingPayload.isSegmented = true
        autoPostingPayload.segmentationPageIds = (req.body.segmentationPageIds)
          ? req.body.pageIds
          : null
        autoPostingPayload.segmentationGender = (req.body.segmentationGender)
          ? req.body.gender
          : null
        autoPostingPayload.segmentationLocale = (req.body.segmentationLocale)
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
  })
}

exports.edit = function (req, res) {
  // todo see individual subscriptions here, disable/enable them
  logger.serverLog(TAG,
    `This is body in edit autoposting ${JSON.stringify(req.body)}`)
  AutoPosting.findById(req.body._id, (err, autoposting) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!autoposting) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }

    autoposting.accountTitle = req.body.accountTitle
    autoposting.isSegmented = req.body.isSegmented
    autoposting.segmentationPageIds = req.body.segmentationPageIds
    autoposting.segmentationGender = req.body.segmentationGender
    autoposting.segmentationLocale = req.body.segmentationLocale
    autoposting.isActive = req.body.isActive
    autoposting.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      return res.status(200).json({status: 'success', payload: autoposting})
    })
  })
}

exports.destroy = function (req, res) {
  // todo see individual subscriptions here.. disable them
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
  AutoPosting.findById(req.params.id, (err, autoposting) => {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!autoposting) {
      return res.status(404)
      .json({status: 'failed', description: 'Record not found'})
    }
    autoposting.remove((err2) => {
      if (err2) {
        return res.status(500)
        .json({status: 'failed', description: 'AutoPosting update failed'})
      }
      return res.status(204).end()
    })
  })
}

exports.twitterwebhook = function (req, res) {
  logger.serverLog(TAG, 'Twitter Webhook Called')
  logger.serverLog(TAG, JSON.stringify(req.body))
  return res.status(200).json({status: 'success', description: 'got the data.'})
}
