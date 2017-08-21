/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Subscribers = require('./Subscribers.model')
const TAG = 'api/subscribers/subscribers.controller.js'

exports.index = function (req, res) {
  Subscribers.find({ userId: req.user._id }, (err, subscriber) => {
    logger.serverLog(TAG, subscriber)
    logger.serverLog(TAG, `Error: ${err}`)
    res.status(200).json(subscriber)
  })
}

exports.create = function (req, res) {

}

exports.report = function (req, res) {

}
exports.send = function (req, res) {

}
