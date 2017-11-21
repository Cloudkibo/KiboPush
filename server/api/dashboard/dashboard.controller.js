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
const pageSurvey = require('../page_survey/page_survey.model')
const pagePoll = require('../page_poll/page_poll.model')
const LiveChat = require('../livechat/livechat.model')
const TAG = 'api/pages/pages.controller.js'
const PollResponse = require('../polls/pollresponse.model')
const mongoose = require('mongoose')

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
      {$match: {userId: req.user._id}},
      {$group: {_id: null, count: {$sum: 1}}}
    ], (err, broadcastSentCount) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting broadcastSentCount count ${JSON.stringify(
            err)}`
      })
    }
    pageBroadcast.aggregate(
      [
          {$match: {seen: true, userId: req.user._id}},
          {$group: {_id: null, count: {$sum: 1}}},
          {$project: {_id: 0}}
      ], (err, broadcastSeenCount) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting broadcastSeenCount count ${JSON.stringify(
                err)}`
        })
      }
      pageSurvey.aggregate(
        [
              {$match: {userId: req.user._id}},
              {$group: {_id: null, count: {$sum: 1}}},
              {$project: {_id: 0}}
        ], (err, surveySentCount) => {
        if (err) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting surveySentCount count ${JSON.stringify(
                    err)}`
          })
        }
        pageSurvey.aggregate(
          [
                  {$match: {seen: true, userId: req.user._id}},
                  {$group: {_id: null, count: {$sum: 1}}},
                  {$project: {_id: 0}}
          ], (err, surveySeenCount) => {
          if (err) {
            return res.status(404).json({
              status: 'failed',
              description: `Error in getting surveytSeenCount count ${JSON.stringify(
                        err)}`
            })
          }
          pagePoll.aggregate(
            [
                      {$match: {userId: req.user._id}},
                      {$group: {_id: null, count: {$sum: 1}}},
                      {$project: {_id: 0}}
            ], (err, pollSentCount) => {
            if (err) {
              return res.status(404).json({
                status: 'failed',
                description: `Error in getting pollSentCount count ${JSON.stringify(
                            err)}`
              })
            }
            pagePoll.aggregate(
              [
                          {$match: {seen: true, userId: req.user._id}},
                          {$group: {_id: null, count: {$sum: 1}}},
                          {$project: {_id: 0}}
              ], (err, pollSeenCount) => {
              if (err) {
                return res.status(404).json({
                  status: 'failed',
                  description: `Error in getting pollSeenCount count ${JSON.stringify(
                                err)}`
                })
              }
              Surveys.find({userId: req.user._id}, (err2, surveyResponseCount) => {
                if (err2) {
                  return res.status(404)
                  .json({status: 'failed', description: 'responses count not found'})
                }
                PollResponse.aggregate(
                  [
                              {$group: {_id: '$pollId', count: {$sum: 1}}}
                  ], (err, pollResponseCount) => {
                  if (err) {
                    return res.status(404).json({
                      status: 'failed',
                      description: `Error in getting surveyResponseCount count ${JSON.stringify(
                                    err)}`
                    })
                  }
                  var sum = 0
                  for (var i = 0; i < pollResponseCount.length; i++) {
                    sum = sum + pollResponseCount[i].count
                  }
                  var sum1 = 0
                  for (var j = 0; j < surveyResponseCount.length; j++) {
                    sum1 = sum1 + surveyResponseCount[j].isresponded
                  }
                  let datacounts = {
                    broadcast:
                      { sent: broadcastSentCount[0].count, seen: broadcastSeenCount[0].count },
                    survey:
                      { sent: surveySentCount[0].count, seen: surveySeenCount[0].count, responses: sum1 },
                    poll:
                      { sent: pollSentCount[0].count, seen: pollSeenCount[0].count, responses: sum }
                  }
                  logger.serverLog(TAG,
                                `counts ${JSON.stringify(datacounts)}`)
                  res.status(200).json({
                    status: 'success',
                    payload: datacounts
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}

exports.likesVsSubscribers = function (req, res) {
  Pages.find({userId: req.params.userid, connected: true}, (err, pages) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting pages ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Initially Total pages ${pages.length}`)
    Subscribers.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.params.userid)
        }
      }, {
        $group: {
          _id: {pageId: '$pageId'},
          count: {$sum: 1}
        }
      }], (err2, gotSubscribersCount) => {
      if (err2) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages subscriber count ${JSON.stringify(
            err2)}`
        })
      }
      let pagesPayload = []
      for (let i = 0; i < pages.length; i++) {
        pagesPayload.push({
          _id: pages[i]._id,
          pageId: pages[i].pageId,
          pageName: pages[i].pageName,
          userId: pages[i].userId,
          pagePic: pages[i].pagePic,
          connected: pages[i].connected,
          pageUserName: pages[i].pageUserName,
          likes: pages[i].likes,
          subscribers: 0
        })
      }
      logger.serverLog(TAG, `Total pages in payload ${pagesPayload.length}`)
      for (let i = 0; i < pagesPayload.length; i++) {
        for (let j = 0; j < gotSubscribersCount.length; j++) {
          if (pagesPayload[i]._id.toString() ===
            gotSubscribersCount[j]._id.pageId.toString()) {
            logger.serverLog(TAG,
              `MATCH ${pagesPayload[i]._id} ${gotSubscribersCount[j]._id.pageId}`)
            logger.serverLog(TAG, `${JSON.stringify(gotSubscribersCount[j])}`)
            logger.serverLog(TAG, `${JSON.stringify(pagesPayload[i])}`)
            pagesPayload[i].subscribers = gotSubscribersCount[j].count
          }
        }
      }
      logger.serverLog(TAG,
        `Total pages in after double loop ${pagesPayload.length}`)
      res.status(200).json({
        status: 'success',
        payload: pagesPayload
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

                LiveChat.count({
                  company_id: req.user._id,
                  status: 'unseen',
                  format: 'facebook'
                }, (err7, unreadCount) => {
                  if (err7) {
                    return res.status(500).json({
                      status: 'failed',
                      description: JSON.stringify(err7)
                    })
                  }
                  payload.unreadCount = unreadCount
                  res.status(200).json({
                    status: 'success',
                    payload
                  })
                })
              })
            })
          })
        }
      )
    })
  })
}
