const logger = require('../../components/logger')
const Polls = require('./Polls.model')
const PollResponse = require('./pollresponse.model')
const Subscribers = require('../subscribers/Subscribers.model')
const needle = require('needle')
const Pages = require('../pages/Pages.model')
let _ = require('lodash')

const TAG = 'api/polls/polls.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Poll get api is working')
  Polls.find({userId: req.user._id}, (err, polls) => {
    if (err) {
      logger.serverLog(TAG, `Error: ${err}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({status: 'success', payload: polls})
  })
}

exports.create = function (req, res) {
  let pollPayload = {
    platform: 'facebook',
    statement: req.body.statement,
    options: req.body.options,
    sent: 0,
    userId: req.user._id
  }
  if (req.body.isSegmented) {
    pollPayload.isSegmented = true
    pollPayload.segmentationPageIds = (req.body.pageIds)
      ? req.body.pageIds
      : null
    pollPayload.segmentationGender = (req.body.gender)
      ? req.body.gender
      : null
    pollPayload.segmentationLocale = (req.body.locale)
      ? req.body.locale
      : null
  }
  const poll = new Polls(pollPayload)

  // save model to MongoDB
  poll.save((err, pollCreated) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        error: err,
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: pollCreated})
    }
  })
}

exports.submitresponses = function (req, res) {
  logger.serverLog(TAG,
    `Inside submitresponses of Poll ${JSON.stringify(req.body)}`)
  /*
   Expected body
   {
   response:String,//response submitted by subscriber
   pollId: _id of Poll,
   subscriberId: _id of subscriber,
   }
   */

  PollResponse.create(req.body, (err, pollresponse) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    return res.status(200).json({status: 'success', payload: pollresponse})
  })
}

exports.getresponses = function (req, res) {
  logger.serverLog(TAG, 'Inside getresponses of Poll')

  PollResponse.find({pollId: req.params.id})
    .populate('pollId subscriberId')
    .exec((err, pollresponses) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }

      return res.status(200).json({status: 'success', payload: pollresponses})
    })
}

exports.report = function (req, res) {

}

exports.send = function (req, res) {
  logger.serverLog(TAG, `Inside sendpoll ${JSON.stringify(req.body)}`)
  /*
   Expected request body
   { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
   */

  Polls.findById(req.body._id, (err, poll) => {
    if (err) {
      return logger.serverLog(TAG, `Send Error on Polls ${JSON.stringify(err)}`)
    }
    poll.sent = poll.sent + 1
    poll.save((err2) => {
      if (err2) {
        logger.serverLog(TAG, `Save Error on Polls send ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG, `Sent value updated for poll ${poll.sent}`)
      return res.status(200).json({status: 'success', payload: poll})
    })
  })

  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: req.body.statement,
        buttons: [
          {
            type: 'postback',
            title: req.body.options[0],
            payload: JSON.stringify(
              {poll_id: req.body._id, option: req.body.options[0]})
          },
          {
            type: 'postback',
            title: req.body.options[1],
            payload: JSON.stringify(
              {poll_id: req.body._id, option: req.body.options[1]})
          },
          {
            type: 'postback',
            title: req.body.options[2],
            payload: JSON.stringify(
              {poll_id: req.body._id, option: req.body.options[2]})
          }
        ]
      }
    }
  }
  logger.serverLog(TAG, `Poll to be sent ${JSON.stringify(messageData)}`)
  let pagesFindCriteria = {userId: req.user._id, connected: true}
  if (req.body.isSegmented) {
    if (req.body.segmentationPageIds) {
      _.merge(pagesFindCriteria, {
        pageId: {
          $in: req.body.segmentationPageIds
        }
      })
    }
  }
  Pages.find(pagesFindCriteria, (err, pages) => {
    if (err) {
      logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total pages to receive poll are ${pages.length}`)
    for (let z = 0; z < pages.length; z++) {
      logger.serverLog(TAG, `Page at Z ${pages[z].pageName}`)
      let subscriberFindCriteria = {pageId: pages[z]._id, isSubscribed: true}
      if (req.body.isSegmented) {
        if (req.body.segmentationGender) {
          _.merge(subscriberFindCriteria,
            {gender: req.body.segmentationGender.toLowerCase()})
        }
        if (req.body.segmentationLocale) {
          _.merge(subscriberFindCriteria,
            {locale: req.body.segmentationLocale})
        }
      }
      Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
        if (err) {
          return logger.serverLog(TAG, `error : ${JSON.stringify(err)}`)
        }
        if (subscribers.length > 0) {
          logger.serverLog(TAG,
            `Total Subscribers of page ${pages[z].pageName} are ${subscribers.length}`)
          // get accesstoken of page
          // -- Page tokens get expired therefore we need to fetch it from Graph api
          needle.get(
            `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${req.user.fbToken}`,
            (err, resp) => {
              if (err) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(err)}`)
              }

              logger.serverLog(TAG,
                `Page accesstoken from graph api ${JSON.stringify(
                  resp.body.access_token)}`)

              for (let j = 0; j < subscribers.length; j++) {
                logger.serverLog(TAG,
                  `At Subscriber fetched ${subscribers[j].firstName} ${subscribers[j].lastName}`)

                const data = {
                  recipient: {id: subscribers[j].senderId}, // this is the subscriber id
                  message: messageData
                }

                needle.post(
                  `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                  data, (err, resp) => {
                    logger.serverLog(TAG,
                      `Sending poll to subscriber response ${JSON.stringify(
                        resp.body)}`)
                    if (err) {
                      logger.serverLog(TAG, err)
                      logger.serverLog(TAG,
                        `Error occured at subscriber :${JSON.stringify(
                          subscribers[j])}`)
                    }

                    // return res.status(200).json({ status: 'success', payload: resp.body });
                  })
              }
            })
        }
      })
    }
  })
}
