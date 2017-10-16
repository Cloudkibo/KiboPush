/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Subscribers = require('./Subscribers.model')
const TAG = 'api/subscribers/subscribers.controller.js'

exports.index = function (req, res) {
  Subscribers.find({ userId: req.user._id }, (err, subscribers) => {
    if (err) {
      logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
      return res.status(404)
      .json({status: 'failed', description: 'Subscribers not found'})
    }
    logger.serverLog(TAG, `Total subscribers ${subscribers.length}`)
    res.status(200).json(subscribers)
  })
}
