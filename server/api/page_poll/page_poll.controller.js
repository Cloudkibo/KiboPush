/**
 * Created by sojharo on 01/08/2017.
 */

const logger = require('../../components/logger')
const PagePolls = require('./page_poll.model')

const TAG = 'api/page_poll/page_poll.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Page Polls get api is working')
  PagePolls.find({ userId: req.user._id }, (err, polls) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: 'User Polls not found'
      })
    }
    logger.serverLog(TAG, polls)
    res.status(200).json({ status: 'success', payload: polls })
  })
}

exports.show = function (req, res) {
  logger.serverLog(TAG, 'Polls get api is working')
  PagePolls.find({ pollId: req.params.id }, (err, polls) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: 'User Polls not found'
      })
    }
    logger.serverLog(TAG, polls)
    res.status(200).json({ status: 'success', payload: polls })
  })
}
