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

exports.seed = function (req, res) {
  const rawDocuments = [
    { pageScopedId: 'id',
      firstName: 'John',
      lastName: 'Doe',
      locale: 'en/US',
      timezone: 'UTC',
      email: 'john@doe.com',
      gender: 'male',
      senderId: 'adsda',
      profilePic: 'url',
      pageId: '1',
      userId: '1' },
    { pageScopedId: 'id',
      firstName: 'John',
      lastName: 'Doe',
      locale: 'en/US',
      timezone: 'UTC',
      email: 'john@doe.com',
      gender: 'male',
      senderId: 'adsda',
      profilePic: 'url',
      pageId: '1',
      userId: '1' },
    { pageScopedId: 'id',
      firstName: 'John',
      lastName: 'Doe',
      locale: 'en/US',
      timezone: 'UTC',
      email: 'john@doe.com',
      gender: 'male',
      senderId: 'adsda',
      profilePic: 'url',
      pageId: '1',
      userId: '1' },
    { pageScopedId: 'id',
      firstName: 'John',
      lastName: 'Doe',
      locale: 'en/US',
      timezone: 'UTC',
      email: 'john@doe.com',
      gender: 'male',
      senderId: 'adsda',
      profilePic: 'url',
      pageId: '1',
      userId: '1' },
    { pageScopedId: 'id',
      firstName: 'John',
      lastName: 'Doe',
      locale: 'en/US',
      timezone: 'UTC',
      email: 'john@doe.com',
      gender: 'male',
      senderId: 'adsda',
      profilePic: 'url',
      pageId: '1',
      userId: '1' }
  ]

  Subscribers.insertMany(rawDocuments)
      .then((mongooseDocuments) => {
        logger.serverLog(TAG, 'Subscribers Table Seeded')
        res.status(200).json({ status: 'Success' })
      })
      .catch((err) => {
          /* Error handling */
        logger.serverLog(TAG, 'Unable to seed the database')
        res.status(500).json({ status: 'Failed' })
      })
}
