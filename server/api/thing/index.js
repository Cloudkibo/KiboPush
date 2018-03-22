'use strict'

const express = require('express')

const router = express.Router()
const Pages = require('./../pages/Pages.model')
const Sessions = require('./../sessions/sessions.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const needle = require('needle')

const logger = require('../../components/logger')
const TAG = 'api/thing/index'

router.get('/', (req, res) => {
  Pages.find()
  .populate('userId')
  .exec((err, pages) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    pages.forEach((page) => {
      Subscribers.find({firstName: null, pageId: page._id}, (err, subs) => {
        subs.forEach((sub) => {
          const options = {
            url: `https://graph.facebook.com/v2.6/${sub.senderId}?access_token=${page.accessToken}`,
            qs: {access_token: page.accessToken},
            method: 'GET'

          }
          needle.get(options.url, options, (error, response) => {
            const subsriber = response.body
            if (!error) {
              const payload = {
                firstName: subsriber.first_name,
                lastName: subsriber.last_name,
                locale: subsriber.locale,
                gender: subsriber.gender,
                timezone: subsriber.timezone,
                profilePic: subsriber.profile_pic
              }
              Subscribers.findOne({senderId: sub.senderId}, (err, subscriber) => {
                if (err) logger.serverLog(TAG, err)
                subscriber.firstName = subsriber.first_name
                subscriber.lastName = subsriber.last_name
                subscriber.locale = subsriber.locale
                subscriber.gender = subsriber.gender
                subscriber.timezone = subsriber.timezone
                subscriber.profilePic = subsriber.profile_pic
                subscriber.save((err, result) => {
                })
              })
            } else {
              logger.serverLog(TAG, `ERROR ${JSON.stringify(error)}`)
            }
          })
        })
      })
    })
  })
  res.status(200).json({status: 'success', payload: []})
})

router.get('/subscriptionDate', (req, res) => {
  Sessions.find({}, (err, sessions) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    sessions.forEach((session) => {
      Subscribers.update({_id: session.subscriber_id}, {datetime: session.request_time}, (err, subs) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
      })
    })
    res.status(200).json({status: 'success', payload: []})
  })
})

module.exports = router
