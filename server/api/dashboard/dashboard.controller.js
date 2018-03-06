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
const PollPage = require('../page_poll/page_poll.model')
const mongoose = require('mongoose')
const CompanyUsers = require('./../companyuser/companyuser.model')

exports.index = function (req, res) {
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
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    pageBroadcast.aggregate(
      [
        {$match: {companyId: companyUser.companyId}},
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
            {$match: {seen: true, companyId: companyUser.companyId}},
            {$group: {_id: null, count: {$sum: 1}}}
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
                {$match: {companyId: companyUser.companyId}},
                {$group: {_id: null, count: {$sum: 1}}}
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
                    {$match: {seen: true, companyId: companyUser.companyId}},
                    {$group: {_id: null, count: {$sum: 1}}}
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
                        {$match: {companyId: companyUser.companyId}},
                        {$group: {_id: null, count: {$sum: 1}}}
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
                            {$match: {seen: true, companyId: companyUser.companyId}},
                            {$group: {_id: null, count: {$sum: 1}}}
                ], (err, pollSeenCount) => {
                if (err) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting pollSeenCount count ${JSON.stringify(
                                  err)}`
                  })
                }
                Surveys.find({companyId: companyUser.companyId},
                              (err2, surveyResponseCount) => {
                                if (err2) {
                                  return res.status(404).json({
                                    status: 'failed',
                                    description: 'responses count not found'
                                  })
                                }
                                Polls.find({companyId: companyUser.companyId},
                                  (err, polls) => {
                                    if (err) {
                                      logger.serverLog(TAG, `Error: ${err}`)
                                      return res.status(500).json({
                                        status: 'failed',
                                        description: `Internal Server Error${JSON.stringify(
                                          err)}`
                                      })
                                    }
                                    PollPage.find({companyId: companyUser.companyId},
                                      (err, pollpages) => {
                                        if (err) {
                                          return res.status(404).json({
                                            status: 'failed',
                                            description: 'Polls not found'
                                          })
                                        }
                                        PollResponse.aggregate(
                                          [
                                            {
                                              $group: {
                                                _id: '$pollId',
                                                count: {$sum: 1}
                                              }
                                            }
                                          ], (err, pollResponseCount) => {
                                          if (err) {
                                            return res.status(404).json({
                                              status: 'failed',
                                              description: `Error in getting poll response count ${JSON.stringify(
                                                  err)}`
                                            })
                                          }
                                          let responsesCount = []
                                          logger.serverLog(TAG,
                                              `counts for dashboard poll response ${JSON.stringify(
                                                pollResponseCount)}`)
                                                for (let a = 0; a < polls.length; a++) {
                                                  for (let b = 0; b < pollResponseCount.length; b++) {
                                                    if (polls[a]._id.toString() === pollResponseCount[b]._id.toString()) {
                                                      responsesCount.push(pollResponseCount[b].count)
                                                    }
                                                  }
                                                }
                                          var sum = 0
                                          if (responsesCount.length > 0) {
                                            for (var c = 0; c <
                                              responsesCount.length; c++) {
                                              sum = sum +
                                                  responsesCount[c]
                                            }
                                          }
                                          logger.serverLog(TAG,
                                              `counts for dashboard poll response sum ${JSON.stringify(
                                                sum)}`)
                                          var sum1 = 0
                                          if (surveyResponseCount.length > 0) {
                                            for (var j = 0; j <
                                              surveyResponseCount.length; j++) {
                                              sum1 = sum1 +
                                                  surveyResponseCount[j].isresponded
                                            }
                                          }

                                          let datacounts = {
                                            broadcast: {
                                              broadcastSentCount: 0,
                                              broadcastSeenCount: 0
                                            },
                                            survey: {
                                              surveySentCount: 0,
                                              surveySeenCount: 0,
                                              surveyResponseCount: 0
                                            },
                                            poll: {
                                              pollSentCount: 0,
                                              pollSeenCount: 0,
                                              pollResponseCount: 0
                                            }
                                          }
                                          if (broadcastSentCount.length > 0) {
                                            datacounts.broadcast.broadcastSentCount = broadcastSentCount[0].count
                                            if (broadcastSeenCount.length > 0) {
                                              datacounts.broadcast.broadcastSeenCount = broadcastSeenCount[0].count
                                            }
                                          }
                                          if (surveySentCount.length > 0) {
                                            datacounts.survey.surveySentCount = surveySentCount[0].count
                                            if (surveySeenCount.length > 0) {
                                              datacounts.survey.surveySeenCount = surveySeenCount[0].count
                                              datacounts.survey.surveyResponseCount = sum1
                                            }
                                          }
                                          if (pollSentCount.length > 0) {
                                            datacounts.poll.pollSentCount = pollSentCount[0].count
                                            if (pollSeenCount.length > 0) {
                                              datacounts.poll.pollSeenCount = pollSeenCount[0].count
                                              datacounts.poll.pollResponseCount = sum
                                            }
                                          }
                                          logger.serverLog(TAG,
                                              `counts for dashboard ${JSON.stringify(
                                                datacounts)}`)
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
      logger.serverLog(TAG,
        `counts for dashboard ${JSON.stringify(gotSubscribersCount)}`)
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
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }
      Pages.count({connected: true, companyId: companyUser.companyId},
        (err, pagesCount) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: JSON.stringify(err)})
          }
          payload.pages = pagesCount
          Pages.find({companyId: companyUser.companyId},
            (err, allPages) => {
              if (err) {
                return res.status(500)
                  .json({status: 'failed', description: JSON.stringify(err)})
              }
              Pages.find({userId: req.user._id},
                (err, userPages) => {
                  if (err) {
                    return res.status(500)
                      .json({status: 'failed', description: JSON.stringify(err)})
                  }
                  let userPagesCount = userPages.length
                  for (let a = 0; a < allPages.length; a++) {
                    let increment = true
                    for (let b = 0; b < userPages.length; b++) {
                      if (allPages[0].pageId === userPages[b].pageId) {
                        increment = false
                        break
                      }
                    }
                    if (increment) {
                      userPagesCount = userPagesCount++
                    }
                  }
                  payload.totalPages = userPagesCount

                  Subscribers.count(
                    {companyId: companyUser.companyId, isEnabledByPage: true, isSubscribed: true},
                      (err2, subscribersCount) => {
                        if (err2) {
                          return res.status(500).json(
                            {status: 'failed', description: JSON.stringify(err2)})
                        }
                        logger.serverLog(TAG, `subscribersCOunt: ${subscribersCount}`)
                        payload.subscribers = subscribersCount
                        Broadcasts.find({companyId: companyUser.companyId})
                          .sort('datetime')
                          .limit(10)
                          .exec(
                            (err3, recentBroadcasts) => {
                              if (err3) {
                                return res.status(500).json({
                                  status: 'failed',
                                  description: JSON.stringify(err3)
                                })
                              }
                              payload.recentBroadcasts = recentBroadcasts
                              Broadcasts.count({companyId: companyUser.companyId},
                                (err4, broadcastsCount) => {
                                  if (err4) {
                                    return res.status(500).json({
                                      status: 'failed',
                                      description: JSON.stringify(err4)
                                    })
                                  }
                                  Polls.count({companyId: companyUser.companyId},
                                    (err5, pollsCount) => {
                                      if (err5) {
                                        return res.status(500).json({
                                          status: 'failed',
                                          description: JSON.stringify(err5)
                                        })
                                      }
                                      Surveys.count(
                                        {companyId: companyUser.companyId},
                                        (err6, surveysCount) => {
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
                                            company_id: companyUser.companyId,
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
                            })
                      }
              )
                })
            })
        })
    })
}
