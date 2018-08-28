/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Sessions = require('../sessions/sessions.model')
const Pages = require('../pages/Pages.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const pageBroadcast = require('../page_broadcast/page_broadcast.model')
const pageSurvey = require('../page_survey/page_survey.model')
const pagePoll = require('../page_poll/page_poll.model')
const LiveChat = require('../livechat/livechat.model')
const TAG = 'api/pages/dashboard.controller.js'
const PollResponse = require('../polls/pollresponse.model')
const PollPage = require('../page_poll/page_poll.model')
const mongoose = require('mongoose')
const CompanyUsers = require('./../companyuser/companyuser.model')
const sortBy = require('sort-array')
const Users = require('./../user/Users.model')
const needle = require('needle')

let _ = require('lodash')

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
//   })
// }

exports.otherPages = function (req, res) {
  Pages.find({connected: false}, (err, pages) => {
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
              let removeDuplicates = (myArr, prop) => {
                return myArr.filter((obj, pos, arr) => {
                  return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
                })
              }
              let allPagesWithoutDuplicates = removeDuplicates(allPages, 'pageId')
              payload.totalPages = allPagesWithoutDuplicates.length

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
                  userPages.forEach((page) => {
                    if (page.userId) {
                      Users.findOne({_id: page.userId}, (err, connectedUser) => {
                        if (err) {
                          return res.status(500).json({
                            status: 'failed',
                            description: `Internal Server Error ${JSON.stringify(err)}`
                          })
                        }
                        var currentUser
                        if (req.user.facebookInfo) {
                          currentUser = req.user
                        } else {
                          currentUser = connectedUser
                        }
                        needle.get(
                          `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                          (err, resp) => {
                            if (err) {
                              logger.serverLog(TAG,
                                `Page access token from graph api error ${JSON.stringify(
                                  err)}`)
                            }
                            if (resp.body && resp.body.access_token) {
                              needle.get(
                              `https://graph.facebook.com/v2.11/me/messaging_feature_review?access_token=${resp.body.access_token}`,
                              (err, respp) => {
                                if (err) {
                                  logger.serverLog(TAG,
                                    `Page access token from graph api error ${JSON.stringify(
                                      err)}`)
                                }
                                if (respp.body && respp.body.data && respp.body.data.length > 0) {
                                  for (let a = 0; a < respp.body.data.length; a++) {
                                    if (respp.body.data[a].feature === 'subscription_messaging' && respp.body.data[a].status === 'approved') {
                                      Pages.update({_id: req.body._id}, {gotPageSubscriptionPermission: true}, (err, updated) => {
                                        if (err) {
                                          res.status(500).json({
                                            status: 'Failed',
                                            description: 'Failed to update record'
                                          })
                                        }
                                      })
                                    }
                                  }
                                }
                              })
                            }
                          })
                      })
                    }
                  })
                  // let userPagesCount = userPages.length
                  // for (let a = 0; a < allPages.length; a++) {
                  //   let increment = true
                  //   for (let b = 0; b < userPages.length; b++) {
                  //     if (allPages[0].pageId === userPages[b].pageId) {
                  //       increment = false
                  //       break
                  //     }
                  //   }
                  //   if (increment) {
                  //     userPagesCount += 1
                  //   }
                  // }
                  // payload.totalPages = userPagesCount

                  Subscribers.count(
                    {companyId: companyUser.companyId, isEnabledByPage: true, isSubscribed: true},
                      (err2, subscribersCount) => {
                        if (err2) {
                          return res.status(500).json(
                            {status: 'failed', description: JSON.stringify(err2)})
                        }
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
exports.graphData = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
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
    Broadcasts.aggregate([
      {
        $match: { companyId: companyUser.companyId,
          'datetime': {
            $gte: new Date(
              (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
            $lt: new Date(
              (new Date().getTime()))
          }
        }
      },
      {
        $group: {
          _id: {'year': {$year: '$datetime'}, 'month': {$month: '$datetime'}, 'day': {$dayOfMonth: '$datetime'}},
          count: {$sum: 1}}
      }], (err, broadcastsgraphdata) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting surveys count ${JSON.stringify(err)}`
        })
      }
      Polls.aggregate([
        {
          $match: { companyId: companyUser.companyId,
            'datetime': {
              $gte: new Date(
                (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
              $lt: new Date(
                (new Date().getTime()))
            }
          }
        },
        {
          $group: {
            _id: {'year': {$year: '$datetime'}, 'month': {$month: '$datetime'}, 'day': {$dayOfMonth: '$datetime'}},
            count: {$sum: 1}}
        }], (err, pollsgraphdata) => {
        if (err) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting surveys count ${JSON.stringify(err)}`
          })
        }
        Surveys.aggregate([
          {
            $match: { companyId: companyUser.companyId,
              'datetime': {
                $gte: new Date(
                  (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                $lt: new Date(
                  (new Date().getTime()))
              }
            }
          },
          {
            $group: {
              _id: {'year': {$year: '$datetime'}, 'month': {$month: '$datetime'}, 'day': {$dayOfMonth: '$datetime'}},
              count: {$sum: 1}}
          }], (err, surveysgraphdata) => {
          if (err) {
            return res.status(404).json({
              status: 'failed',
              description: `Error in getting surveys count ${JSON.stringify(err)}`
            })
          }
          Sessions.aggregate([
            {
              $match: {
                'request_time': {
                  $gte: new Date(
                    (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                  $lt: new Date(
                    (new Date().getTime()))
                }
              }
            },
            {
              $group: {
                _id: {'year': {$year: '$request_time'}, 'month': {$month: '$request_time'}, 'day': {$dayOfMonth: '$request_time'}, 'company': '$company_id'},
                count: {$sum: 1}}
            }], (err, sessionsgraphdata) => {
            if (err) {
              return res.status(404).json({
                status: 'failed',
                description: `Error in getting sessions count ${JSON.stringify(err)}`
              })
            }
            let temp2 = []
            for (let i = 0; i < sessionsgraphdata.length; i++) {
              if (JSON.stringify(sessionsgraphdata[i]._id.company) === JSON.stringify(companyUser.companyId)) {
                temp2.push(sessionsgraphdata[i])
              }
            }
            return res.status(200)
              .json({status: 'success', payload: {broadcastsgraphdata: broadcastsgraphdata, pollsgraphdata: pollsgraphdata, surveysgraphdata: surveysgraphdata, sessionsgraphdata: temp2}})
          })
        })
      })
    })
  })
}

exports.toppages = function (req, res) {
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
    Pages.find({connected: true, companyId: companyUser.companyId}, (err, pages) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages ${JSON.stringify(err)}`
        })
      }
      Subscribers.aggregate([
        {$match: {companyId: companyUser.companyId}}, {
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
        for (let i = 0; i < pagesPayload.length; i++) {
          for (let j = 0; j < gotSubscribersCount.length; j++) {
            if (pagesPayload[i]._id.toString() ===
              gotSubscribersCount[j]._id.pageId.toString()) {
              pagesPayload[i].subscribers = gotSubscribersCount[j].count
            }
          }
        }
        let sorted = sortBy(pagesPayload, 'subscribers')
        let top10 = _.takeRight(sorted, 10)
        top10 = top10.reverse()
        res.status(200).json({
          status: 'success',
          payload: top10
        })
      })
    })
  })
}

exports.getAllSubscribers = function (req, res) {
  let search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
  let findCriteria = {
    pageId: mongoose.Types.ObjectId(req.params.pageid),
    $or: [{firstName: {$regex: search}}, {lastName: {$regex: search}}],
    gender: req.body.filter_criteria.gender_value !== '' ? req.body.filter_criteria.gender_value : {$exists: true},
    locale: req.body.filter_criteria.locale_value !== '' ? req.body.filter_criteria.locale_value : {$exists: true}
  }
  if (req.body.first_page === 'first') {
    Subscribers.aggregate([
      { $match: findCriteria },
      { $group: { _id: null, count: { $sum: 1 } } }
    ], (err, subscribersCount) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'Ssubscribers not found'})
      }
      Subscribers.find(findCriteria).limit(req.body.number_of_records)
      .exec((err, subscribers) => {
        if (err) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting subscribers ${JSON.stringify(err)}`
          })
        }
        res.status(200).json({
          status: 'success',
          payload: {subscribers: subscribers, count: subscribers.length > 0 ? subscribersCount[0].count : ''}
        })
      })
    })
  } else if (req.body.first_page === 'next') {
    Subscribers.aggregate([
      { $match: findCriteria },
      { $group: { _id: null, count: { $sum: 1 } } }
    ], (err, subscribersCount) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'BroadcastsCount not found'})
      }
      Subscribers.find(Object.assign(findCriteria, {_id: {$gt: req.body.last_id}})).limit(req.body.number_of_records)
      .exec((err, subscribers) => {
        if (err) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting subscribers ${JSON.stringify(err)}`
          })
        }
        res.status(200).json({
          status: 'success',
          payload: {subscribers: subscribers, count: subscribers.length > 0 ? subscribersCount[0].count : ''}
        })
      })
    })
  } else if (req.body.first_page === 'previous') {
    Subscribers.aggregate([
      { $match: findCriteria },
      { $group: { _id: null, count: { $sum: 1 } } }
    ], (err, subscribersCount) => {
      if (err) {
        return res.status(404)
          .json({status: 'failed', description: 'BroadcastsCount not found'})
      }
      Subscribers.find(Object.assign(findCriteria, {_id: {$lt: req.body.last_id}})).limit(req.body.number_of_records)
      .exec((err, subscribers) => {
        if (err) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting subscribers ${JSON.stringify(err)}`
          })
        }
        res.status(200).json({
          status: 'success',
          payload: {subscribers: subscribers, count: subscribers.length > 0 ? subscribersCount[0].count : ''}
        })
      })
    })
  }
}
