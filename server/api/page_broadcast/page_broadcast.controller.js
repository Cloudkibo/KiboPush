/**
 * Created by sojharo on 01/08/2017.
 */

const logger = require('../../components/logger')
const PageBroadcasts = require('./page_broadcast.model')

const TAG = 'api/page_broadcast/page_broadcast.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Broadcasts get api is working')
  PageBroadcasts.find({ userId: req.user._id }, (err, broadcasts) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, broadcasts)
    res.status(200).json({ status: 'success', payload: broadcasts })
  })
}

exports.show = function (req, res) {
  logger.serverLog(TAG, 'Broadcasts get api is working')
  PageBroadcasts.find({ broadcastId: req.params.id }, (err, broadcasts) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, broadcasts)
    res.status(200).json({ status: 'success', payload: broadcasts })
  })
}
