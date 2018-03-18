'use strict'

const express = require('express')

const router = express.Router()
const Pages = require('./../pages/Pages.model')
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

      Subscribers.find({firstName : null, pageId: page._id}, (err, subs) => {
        subs.forEach((sub) => {
          const options = {
            url: `https://graph.facebook.com/v2.6/${sub.senderId}?access_token=${page.accessToken}`,
            qs: {access_token: page.accessToken},
            method: 'GET'

          }
          needle.get(options.url, options, (error, response) => {
            const subsriber = response.body
            logger.serverLog(TAG, `NEW SUB DATA ${JSON.stringify(subsriber)}`)
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
                logger.serverLog(TAG, `SUB TO UPDATE ${JSON.stringify(subscriber)}`)
                if (err) logger.serverLog(TAG, err)
                subscriber.firstName =subsriber.first_name
                subscriber.lastName = subsriber.last_name
                subscriber.locale = subsriber.locale
                subscriber.gender = subsriber.gender
                subscriber.timezone = subsriber.timezone
                subscriber.profilePic = subsriber.profile_pic
                subscriber.save((err, result) => {
                  logger.serverLog(TAG, `SUB UPDATED ${JSON.stringify(result)}`)
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

module.exports = router
