/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Pages = require('../pages/Pages.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const pageBroadcast = require('../page_broadcast/page_broadcast.model')
const TAG = 'api/pages/pages.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Get Dashboard API called')
  const data = {}
  Pages.count((err, c) => {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: JSON.stringify(err)})
    }
    data.pagesCount = c
    res.status(200).json(data)
  })
}
exports.sentVsSeen = function (req, res) {
  pageBroadcast.aggregate(
    [
      { $group: { _id: null, count: { $sum: 1 } } }
    ], (err, broadcastSentCount) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting broadcastSentCount count ${JSON.stringify(err)}`
      })
    }
    pageBroadcast.aggregate(
      [
        { $match: {seen: true} },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, broadcastSeenCount) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting broadcastSeenCount count ${JSON.stringify(err)}`
        })
      }
      let datacounts = {
        broadcastSentCount: broadcastSentCount,
        broadcastSeenCount: broadcastSeenCount
      }
      logger.serverLog(TAG, `counts ${JSON.stringify(datacounts)}`)
      res.status(200).json({
        status: 'success',
        payload: datacounts
      })
    })
  })
}
exports.enable = function (req, res) {

}

// exports.disable = function (req, res) {
//   const updateData = {
//     connected: false
//   }
//   Pages.update({_id: req.body._id}, updateData, (err, affected) => {
//     logger.serverLog(TAG, `affected rows ${affected}`)
//   })
// }

exports.otherPages = function (req, res) {
  Pages.find({connected: false}, (err, pages) => {
    logger.serverLog(TAG, pages)
    logger.serverLog(TAG, `Error: ${err}`)
    res.status(200).json(pages)
  })
}

exports.stats = function (req, res) {
  const payload = {
    scheduledBroadcast: 0,
    username: req.user.name
  }
  Pages.count({connected: true, userId: req.user._id}, (err, pagesCount) => {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: JSON.stringify(err)})
    }
    payload.pages = pagesCount
    Subscribers.count({userId: req.user._id}, (err2, subscribersCount) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: JSON.stringify(err2)})
      }
      payload.subscribers = subscribersCount
      Broadcasts.find({userId: req.user._id}).sort('datetime').limit(10).exec(
        (err3, recentBroadcasts) => {
          if (err3) {
            return res.status(500)
              .json({status: 'failed', description: JSON.stringify(err3)})
          }
          payload.recentBroadcasts = recentBroadcasts
          Broadcasts.count({userId: req.user._id}, (err4, broadcastsCount) => {
            if (err4) {
              return res.status(500)
                .json({status: 'failed', description: JSON.stringify(err4)})
            }
            Polls.count({userId: req.user._id}, (err5, pollsCount) => {
              if (err5) {
                return res.status(500).json({
                  status: 'failed',
                  description: JSON.stringify(err5)
                })
              }
              Surveys.count({userId: req.user._id}, (err6, surveysCount) => {
                if (err6) {
                  return res.status(500).json({
                    status: 'failed',
                    description: JSON.stringify(err6)
                  })
                }
                payload.activityChart = {
                  messages: broadcastsCount,
                  polls: pollsCount,
                  surveys: surveysCount
                }

                res.status(200).json({
                  status: 'success',
                  payload
                })
              })
            })
          })
        }
      )
    })
  })
}
