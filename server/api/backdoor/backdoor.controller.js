/**
 * Created by sojharo on 25/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/backdoor/backdoor.controller.js'
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const Users = require('../user/Users.model')
const Pages = require('../pages/Pages.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const PollResponse = require('../polls/pollresponse.model')
const PollPages = require('../page_poll/page_poll.model')
const SurveyQuestions = require('../surveys/surveyquestions.model')
const SurveyResponses = require('../surveys/surveyresponse.model')
const Sessions = require('../sessions/sessions.model')
const sortBy = require('sort-array')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const SurveyPage = require('../page_survey/page_survey.model')
const PollPage = require('../page_poll/page_poll.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const config = require('./../../config/environment/index')
const LiveChat = require('../livechat/livechat.model')

// const mongoose = require('mongoose')
var json2csv = require('json2csv')

let _ = require('lodash')

exports.index = function (req, res) {
  Users.find({}, (err, users) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting users ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: users
    })
  })
}

exports.allpages = function (req, res) {
  Pages.find({userId: req.params.userid}, (err, pages) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting pages ${JSON.stringify(err)}`
      })
    }
    CompanyUsers.findOne({userId: req.params.userid}, (err, companyUser) => {
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
      Subscribers.aggregate([
        {
          $match: {
            companyId: companyUser.companyId
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
  })
}

exports.allsubscribers = function (req, res) {
  Subscribers.find({pageId: req.params.pageid}, (err, subscribers) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting subscribers ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: subscribers
    })
  })
}

exports.allbroadcasts = function (req, res) {
  // todo put pagination for scaling
  Broadcasts.find({userId: req.params.userid}, (err, broadcasts) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting broadcasts ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: broadcasts
    })
  })
}

exports.allpolls = function (req, res) {
  // todo put pagination for scaling
  Polls.find({userId: req.params.userid}, (err, polls) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting polls ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: polls
    })
  })
}

exports.allsurveys = function (req, res) {
  // todo put pagination for scaling
  Surveys.find({userId: req.params.userid}, (err, surveys) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting surveys ${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: surveys
    })
  })
}
exports.surveyDetails = function (req, res) {
  Surveys.find({_id: req.params.surveyid}, (err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    // find questions
    SurveyQuestions.find({surveyId: req.params.surveyid})
      .populate('surveyId')
      .exec((err2, questions) => {
        if (err2) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err2)}`
          })
        }
        SurveyResponses.find({surveyId: req.params.surveyid})
          .populate('surveyId subscriberId questionId')
          .exec((err3, responses) => {
            if (err3) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err3)}`
              })
            }
            return res.status(200)
              .json({status: 'success', payload: {survey, questions, responses}})
          })
      })
  })
}

exports.toppages = function (req, res) {
  Pages.find({connected: true}, (err, pages) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting pages ${JSON.stringify(err)}`
      })
    }
    Subscribers.aggregate([
      {
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
}
exports.datacount = function (req, res) {
  var days = 0
  if (req.params.userid === '10') {
    days = 10
  } else if (req.params.userid === '30') {
    days = 30
  }
  if (req.params.userid === '0') {
    Users.aggregate(
      [
        {$group: {_id: null, count: {$sum: 1}}}
      ], (err, gotUsersCount) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting Users count ${JSON.stringify(err)}`
        })
      }
      Subscribers.aggregate(
        [
            {$group: {_id: null, count: {$sum: 1}}}
        ], (err2, gotSubscribersCount) => {
        if (err2) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting pages subscriber count ${JSON.stringify(
                  err2)}`
          })
        }
        Pages.aggregate(
          [
                {$match: {connected: true}},
                {$group: {_id: null, count: {$sum: 1}}}
          ], (err2, gotPagesCount) => {
          if (err2) {
            return res.status(404).json({
              status: 'failed',
              description: `Error in getting pages count ${JSON.stringify(
                      err2)}`
            })
          }
          Broadcasts.aggregate(
            [
                    {$group: {_id: null, count: {$sum: 1}}}
            ], (err2, gotBroadcastsCount) => {
            if (err2) {
              return res.status(404).json({
                status: 'failed',
                description: `Error in getting pages subscriber count ${JSON.stringify(
                          err2)}`
              })
            }
            Polls.aggregate(
              [
                        {$group: {_id: null, count: {$sum: 1}}}
              ], (err2, gotPollsCount) => {
              if (err2) {
                return res.status(404).json({
                  status: 'failed',
                  description: `Error in getting polls count ${JSON.stringify(
                              err2)}`
                })
              }
              Surveys.aggregate(
                [
                            {$group: {_id: null, count: {$sum: 1}}}
                ], (err2, gotSurveysCount) => {
                if (err2) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting surveys count ${JSON.stringify(
                                  err2)}`
                  })
                }
                Pages.aggregate(
                  [
                        {$group: {_id: null, count: {$sum: 1}}}
                  ], (err2, gotAllPagesCount) => {
                  if (err2) {
                    return res.status(404).json({
                      status: 'failed',
                      description: `Error in getting pages count ${JSON.stringify(
                              err2)}`
                    })
                  }
                  let datacounts = {
                    UsersCount: gotUsersCount,
                    SubscribersCount: gotSubscribersCount,
                    PagesCount: gotPagesCount,
                    AllPagesCount: gotAllPagesCount,
                    BroadcastsCount: gotBroadcastsCount,
                    PollsCount: gotPollsCount,
                    SurveysCount: gotSurveysCount
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
  } else {
    Users.aggregate(
      [
        {
          $match: {
            'createdAt': {
              $gte: new Date(
                (new Date().getTime() - (days * 24 * 60 * 60 * 1000)))
            }
          }
        },
        {$group: {_id: null, count: {$sum: 1}}}
      ], (err, gotUsersCount) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting Users count ${JSON.stringify(err)}`
        })
      }
      Subscribers.aggregate(
        [
            {$group: {_id: null, count: {$sum: 1}}}
        ], (err2, gotSubscribersCount) => {
        if (err2) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting pages subscriber count ${JSON.stringify(
                  err2)}`
          })
        }
        Pages.aggregate(
          [
                {$match: {connected: true}},
                {$group: {_id: null, count: {$sum: 1}}}
          ], (err2, gotPagesCount) => {
          if (err2) {
            return res.status(404).json({
              status: 'failed',
              description: `Error in getting pages count ${JSON.stringify(
                      err2)}`
            })
          }
          Broadcasts.aggregate(
            [
              {
                $match: {
                  'datetime': {
                    $gte: new Date(
                            (new Date().getTime() - (days * 24 * 60 * 60 * 1000)))
                  }
                }
              },
                    {$group: {_id: null, count: {$sum: 1}}}
            ], (err2, gotBroadcastsCount) => {
            if (err2) {
              return res.status(404).json({
                status: 'failed',
                description: `Error in getting pages subscriber count ${JSON.stringify(
                          err2)}`
              })
            }
            Polls.aggregate(
              [
                {
                  $match: {
                    'datetime': {
                      $gte: new Date((new Date().getTime() -
                              (days * 24 * 60 * 60 * 1000)))
                    }
                  }
                },
                        {$group: {_id: null, count: {$sum: 1}}}
              ], (err2, gotPollsCount) => {
              if (err2) {
                return res.status(404).json({
                  status: 'failed',
                  description: `Error in getting polls count ${JSON.stringify(
                              err2)}`
                })
              }
              Surveys.aggregate(
                [
                  {
                    $match: {
                      'datetime': {
                        $gte: new Date((new Date().getTime() -
                                  (days * 24 * 60 * 60 * 1000)))
                      }
                    }
                  },
                            {$group: {_id: null, count: {$sum: 1}}}
                ], (err2, gotSurveysCount) => {
                if (err2) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting surveys count ${JSON.stringify(
                                  err2)}`
                  })
                }
                Pages.aggregate(
                  [
                        {$group: {_id: null, count: {$sum: 1}}}
                  ], (err2, gotAllPagesCount) => {
                  if (err2) {
                    return res.status(404).json({
                      status: 'failed',
                      description: `Error in getting pages count ${JSON.stringify(
                              err2)}`
                    })
                  }
                  let datacounts = {
                    UsersCount: gotUsersCount,
                    SubscribersCount: gotSubscribersCount,
                    PagesCount: gotPagesCount,
                    BroadcastsCount: gotBroadcastsCount,
                    AllPagesCount: gotAllPagesCount,
                    PollsCount: gotPollsCount,
                    SurveysCount: gotSurveysCount
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
  }
}

exports.uploadFile = function (req, res) {
  Users.find({}, (err, users) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting users ${JSON.stringify(err)}`
      })
    }

    Pages.find({}, (err, pages) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages ${JSON.stringify(err)}`
        })
      }

      let usersPayload = []
      for (let a = 0; a < pages.length; a++) {
        for (let b = 0; b < users.length; b++) {
          if (JSON.stringify(pages[a].userId) === JSON.stringify(users[b]._id)) {
            usersPayload.push({
              Page: pages[a].pageName,
              isConnected: pages[a].connected,
              Name: users[b].name,
              Gender: users[b].gender,
              Email: users[b].email,
              Locale: users[b].locale,
              Timezone: users[b].timezone
            })
          }
        }
      }
      //  let dir = path.resolve(__dirname, './my-file.csv')
      // let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles/users.csv')
      // csvdata.write(dir, usersPayload,
      //   {header: 'Name,Gender,Email,Locale,Timezone'})
      // try {
      //   return res.status(201).json({
      //     status: 'success',
      //     payload: {
      //       url: `${config.domain}/api/broadcasts/download/users.csv`
      //     }
      //   })
      // try {
      //   res.set({
      //     'Content-Disposition': 'attachment; filename=users.csv',
      //     'Content-Type': 'text/csv'
      //   })
      //   res.send(dir)
      // } catch (err) {
      //   res.status(201)
      //     .json({status: 'failed', payload: 'Not Found ' + JSON.stringify(err)})
      // }
      // fs.unlinkSync(dir)

      var info = usersPayload
      var keys = []
      var val = info[0]

      for (var j in val) {
        var subKey = j
        keys.push(subKey)
      }
      json2csv({ data: info, fields: keys }, function (err, csv) {
        if (err) {
          logger.serverLog(TAG,
                        `Error at exporting csv file ${JSON.stringify(err)}`)
        }
        res.status(200).json({
          status: 'success',
          payload: csv
        })
      })
    })
  })
}

exports.poll = function (req, res) {
  Polls.findOne({_id: req.params.pollid}, (err, poll) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    if (!poll) {
      return res.status(404).json({
        status: 'failed',
        description: `Poll not found.`
      })
    }
    PollResponse.find({pollId: req.params.pollid}, (err, pollResponses) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      PollPages.find({pollId: req.params.pollid}, (err, pollpages) => {
        if (err) {
          return res.status(404)
            .json({status: 'failed', description: 'Polls not found'})
        }
        return res.status(200)
        .json({status: 'success', payload: {pollResponses, poll, pollpages}})
      })
    })
  })
}
exports.broadcastsGraph = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
  Broadcasts.aggregate([
    {
      $match: {
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
    return res.status(200)
    .json({status: 'success', payload: {broadcastsgraphdata}})
  })
}
exports.pollsGraph = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
  Polls.aggregate([
    {
      $match: {
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
    return res.status(200)
    .json({status: 'success', payload: {pollsgraphdata}})
  })
}
exports.surveysGraph = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
  Surveys.aggregate([
    {
      $match: {
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
    return res.status(200)
    .json({status: 'success', payload: {surveysgraphdata}})
  })
}
exports.sessionsGraph = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
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
        _id: {'year': {$year: '$request_time'}, 'month': {$month: '$request_time'}, 'day': {$dayOfMonth: '$request_time'}},
        count: {$sum: 1}}
    }], (err, sessionsgraphdata) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting sessions count ${JSON.stringify(err)}`
      })
    }
    return res.status(200)
    .json({status: 'success', payload: {sessionsgraphdata}})
  })
}
exports.broadcastsByDays = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
  Broadcasts.aggregate([
    {
      $match: {
        'datetime': {
          $gte: new Date(
            (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
          $lt: new Date(
            (new Date().getTime()))
        }
      }
    }
  ], (err, broadcasts) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting surveys count ${JSON.stringify(err)}`
      })
    }
    let temp = []
    let tempUser = []
    let tempCompany = []
    for (let i = 0; i < broadcasts.length; i++) {
      temp.push(broadcasts[i]._id)
      tempUser.push(broadcasts[i].userId)
      tempCompany.push(broadcasts[i].companyId)
    }
    BroadcastPage.find({broadcastId: {
      $in: temp
    }}, (err, broadcastpages) => {
      if (err) {
        return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
      }
      Users.find({_id: {
        $in: tempUser
      }}, (err, users) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: 'internal server error' + JSON.stringify(err)
          })
        }
        CompanyProfile.find({_id: {
          $in: tempCompany
        }}, (err, companies) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          Pages.find({}, (err, pages) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: 'internal server error' + JSON.stringify(err)
              })
            }
            Subscribers.find({}, (err, subscribers) => {
              if (err) {
                return res.status(404).json({
                  status: 'failed',
                  description: `Error in getting subscribers ${JSON.stringify(err)}`
                })
              }
              let data = []
              for (let j = 0; j < broadcasts.length; j++) {
                let pagebroadcast = broadcastpages.filter((c) => JSON.stringify(c.broadcastId) === JSON.stringify(broadcasts[j]._id))
                let subscriberData = []
                for (let n = 0; n < pagebroadcast.length; n++) {
                  let subscriber = subscribers.filter((c) => c.senderId === pagebroadcast[n].subscriberId)
                  let subscriberPage = pages.filter((c) => JSON.stringify(c._id) === JSON.stringify(subscriber[0].pageId))
                  subscriberData.push({_id: subscriber[0]._id,
                    firstName: subscriber[0].firstName,
                    lastName: subscriber[0].lastName,
                    locale: subscriber[0].locale,
                    gender: subscriber[0].gender,
                    profilePic: subscriber[0].profilePic,
                    page: subscriberPage[0].pageName,
                    seen: pagebroadcast[n].seen})
                }
                let pagebroadcastTapped = pagebroadcast.filter((c) => c.seen === true)
                let user = users.filter((c) => JSON.stringify(c._id) === JSON.stringify(broadcasts[j].userId))
                let company = companies.filter((c) => JSON.stringify(c._id) === JSON.stringify(broadcasts[j].companyId))
                let pageSend = []
                if (broadcasts[j].segmentationPageIds && broadcasts[j].segmentationPageIds.length > 0) {
                  for (let k = 0; k < broadcasts[j].segmentationPageIds.length; k++) {
                    let page = pages.filter((c) => JSON.stringify(c.pageId) === JSON.stringify(broadcasts[j].segmentationPageIds[k]))
                    pageSend.push(page[0].pageName)
                  }
                } else {
                  let page = pages.filter((c) => JSON.stringify(c.companyId) === JSON.stringify(company[0]._id) && c.connected === true)
                  for (let a = 0; a < page.length; a++) {
                    pageSend.push(page[a].pageName)
                  }
                }
                //  let page = pages.filter((c) => JSON.stringify(c.pageId) === JSON.stringify(broadcasts[j].pageId))
                data.push({_id: broadcasts[j]._id,
                  title: broadcasts[j].title,
                  datetime: broadcasts[j].datetime,
                  payload: broadcasts[j].payload,
                  page: pageSend,
                  user: user,
                  company: company,
                  sent: pagebroadcast.length,
                  seen: pagebroadcastTapped.length,
                  subscriber: subscriberData}) // total tapped
              }
              var newBroadcast = data.reverse()
              return res.status(200)
              .json({status: 'success', payload: newBroadcast})
            })
          })
        })
      })
    })
  })
}
exports.surveysByDays = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
  Surveys.aggregate([
    {
      $match: {
        'datetime': {
          $gte: new Date(
            (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
          $lt: new Date(
            (new Date().getTime()))
        }
      }
    }
  ], (err, surveys) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting surveys count ${JSON.stringify(err)}`
      })
    }
    let temp = []
    let tempUser = []
    let tempCompany = []
    for (let i = 0; i < surveys.length; i++) {
      temp.push(surveys[i]._id)
      tempUser.push(surveys[i].userId)
      tempCompany.push(surveys[i].companyId)
    }
    SurveyPage.find({surveyId: {
      $in: temp
    }}, (err, surveypages) => {
      if (err) {
        return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
      }
      SurveyResponses.find({surveyId: {
        $in: temp
      }}, (err, surveyResponses) => {
        if (err) {
          return res.status(404)
          .json({status: 'failed', description: 'Broadcasts not found'})
        }
        Users.find({_id: {
          $in: tempUser
        }}, (err, users) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          CompanyProfile.find({_id: {
            $in: tempCompany
          }}, (err, companies) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: 'internal server error' + JSON.stringify(err)
              })
            }
            Pages.find({}, (err, pages) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: 'internal server error' + JSON.stringify(err)
                })
              }
              Subscribers.find({}, (err, subscribers) => {
                if (err) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting subscribers ${JSON.stringify(err)}`
                  })
                }
                let data = []
                for (let j = 0; j < surveys.length; j++) {
                  let pagesurvey = surveypages.filter((c) => JSON.stringify(c.surveyId) === JSON.stringify(surveys[j]._id))
                  let responsesurvey = surveyResponses.filter((c) => JSON.stringify(c.surveyId) === JSON.stringify(surveys[j]._id))
                  let subscriberData = []
                  let responded = 0
                  for (let n = 0; n < pagesurvey.length; n++) {
                    let subscriber = subscribers.filter((c) => c.senderId === pagesurvey[n].subscriberId)
                    let subscriberPage = pages.filter((c) => JSON.stringify(c._id) === JSON.stringify(subscriber[0].pageId))
                    // if (responsesurvey[n]) {
                    //   let subscriberNew = subscribers.filter((c) => JSON.stringify(c._id) === JSON.stringify(responsesurvey[n].subscriberId))
                    //   if (subscriberNew.length > 0) {
                    //     res = true
                    //   }
                    // }
                    subscriberData.push({_id: subscriber[0]._id,
                      firstName: subscriber[0].firstName,
                      lastName: subscriber[0].lastName,
                      locale: subscriber[0].locale,
                      gender: subscriber[0].gender,
                      profilePic: subscriber[0].profilePic,
                      page: subscriberPage[0].pageName,
                      seen: pagesurvey[n].seen,
                      responded: false})
                  }
                  for (let m = 0; m < responsesurvey.length; m++) {
                    let subscriberNew = subscribers.filter((c) => JSON.stringify(c._id) === JSON.stringify(responsesurvey[m].subscriberId))
                    for (let o = 0; o < subscriberData.length; o++) {
                      if (JSON.stringify(subscriberData[o]._id) === JSON.stringify(subscriberNew[0]._id)) {
                        subscriberData[o].responded = true
                        responded = responded + 1
                      }
                    }
                  }
                  let pagesurveyTapped = pagesurvey.filter((c) => c.seen === true)
                  let user = users.filter((c) => JSON.stringify(c._id) === JSON.stringify(surveys[j].userId))
                  let company = companies.filter((c) => JSON.stringify(c._id) === JSON.stringify(surveys[j].companyId))
                  let pageSend = []
                  if (surveys[j].segmentationPageIds && surveys[j].segmentationPageIds.length > 0) {
                    for (let k = 0; k < surveys[j].segmentationPageIds.length; k++) {
                      let page = pages.filter((c) => JSON.stringify(c.pageId) === JSON.stringify(surveys[j].segmentationPageIds[k]))
                      pageSend.push(page[0].pageName)
                    }
                  } else {
                    let page = pages.filter((c) => JSON.stringify(c.companyId) === JSON.stringify(company[0]._id) && c.connected === true)
                    for (let a = 0; a < page.length; a++) {
                      pageSend.push(page[a].pageName)
                    }
                  }
                  //  let page = pages.filter((c) => JSON.stringify(c.pageId) === JSON.stringify(broadcasts[j].pageId))
                  data.push({_id: surveys[j]._id,
                    title: surveys[j].title,
                    datetime: surveys[j].datetime,
                    page: pageSend,
                    user: user,
                    company: company,
                    sent: pagesurvey.length,
                    seen: pagesurveyTapped.length,
                    responded: responded,
                    subscriber: subscriberData}) // total tapped
                }
                var newSurvey = data.reverse()
                return res.status(200)
                .json({status: 'success', payload: newSurvey})
              })
            })
          })
        })
      })
    })
  })
}
exports.pollsByDays = function (req, res) {
  var days = 0
  if (req.params.days === '0') {
    days = 10
  } else {
    days = req.params.days
  }
  Polls.aggregate([
    {
      $match: {
        'datetime': {
          $gte: new Date(
            (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
          $lt: new Date(
            (new Date().getTime()))
        }
      }
    }
  ], (err, polls) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting surveys count ${JSON.stringify(err)}`
      })
    }
    let temp = []
    let tempUser = []
    let tempCompany = []
    for (let i = 0; i < polls.length; i++) {
      temp.push(polls[i]._id)
      tempUser.push(polls[i].userId)
      tempCompany.push(polls[i].companyId)
    }
    PollPage.find({pollId: {
      $in: temp
    }}, (err, pollpages) => {
      if (err) {
        return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
      }
      PollResponse.find({pollId: {
        $in: temp
      }}, (err, pollResponses) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error${JSON.stringify(err)}`
          })
        }
        PollPages.find({pollId: req.params.pollid}, (err, pollpages) => {
          if (err) {
            return res.status(404)
              .json({status: 'failed', description: 'Polls not found'})
          }
        })
        Users.find({_id: {
          $in: tempUser
        }}, (err, users) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          CompanyProfile.find({_id: {
            $in: tempCompany
          }}, (err, companies) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: 'internal server error' + JSON.stringify(err)
              })
            }
            Pages.find({}, (err, pages) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: 'internal server error' + JSON.stringify(err)
                })
              }
              Subscribers.find({}, (err, subscribers) => {
                if (err) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting subscribers ${JSON.stringify(err)}`
                  })
                }
                let data = []
                for (let j = 0; j < polls.length; j++) {
                  let pagepoll = pollpages.filter((c) => JSON.stringify(c.pollId) === JSON.stringify(polls[j]._id))
                  let responsepoll = pollResponses.filter((c) => JSON.stringify(c.pollId) === JSON.stringify(polls[j]._id))
                  let subscriberData = []
                  for (let n = 0; n < pagepoll.length; n++) {
                    let subscriber = subscribers.filter((c) => c.senderId === pagepoll[n].subscriberId)
                    let subscriberPage = pages.filter((c) => JSON.stringify(c._id) === JSON.stringify(subscriber[0].pageId))
                    subscriberData.push({_id: subscriber[0]._id,
                      firstName: subscriber[0].firstName,
                      lastName: subscriber[0].lastName,
                      locale: subscriber[0].locale,
                      gender: subscriber[0].gender,
                      profilePic: subscriber[0].profilePic,
                      page: subscriberPage[0].pageName,
                      seen: pagepoll[n].seen,
                      responded: false
                    })
                  }
                  for (let m = 0; m < responsepoll.length; m++) {
                    let subscriberNew = subscribers.filter((c) => JSON.stringify(c._id) === JSON.stringify(responsepoll[m].subscriberId))
                    for (let o = 0; o < subscriberData.length; o++) {
                      if (JSON.stringify(subscriberData[o]._id) === JSON.stringify(subscriberNew[0]._id)) {
                        subscriberData[o].responded = true
                      }
                    }
                  }
                  let pagepollTapped = pagepoll.filter((c) => c.seen === true)
                  let user = users.filter((c) => JSON.stringify(c._id) === JSON.stringify(polls[j].userId))
                  let company = companies.filter((c) => JSON.stringify(c._id) === JSON.stringify(polls[j].companyId))
                  let pageSend = []
                  if (polls[j].segmentationPageIds && polls[j].segmentationPageIds.length > 0) {
                    for (let k = 0; k < polls[j].segmentationPageIds.length; k++) {
                      let page = pages.filter((c) => JSON.stringify(c.pageId) === JSON.stringify(polls[j].segmentationPageIds[k]))
                      pageSend.push(page[0].pageName)
                    }
                  } else {
                    let page = pages.filter((c) => JSON.stringify(c.companyId) === JSON.stringify(company[0]._id) && c.connected === true)
                    for (let a = 0; a < page.length; a++) {
                      pageSend.push(page[a].pageName)
                    }
                  }
                  //  let page = pages.filter((c) => JSON.stringify(c.pageId) === JSON.stringify(broadcasts[j].pageId))
                  data.push({_id: polls[j]._id,
                    statement: polls[j].statement,
                    datetime: polls[j].datetime,
                    page: pageSend,
                    user: user,
                    company: company,
                    sent: pagepoll.length,
                    seen: pagepollTapped.length,
                    responded: responsepoll.length,
                    subscriber: subscriberData }) // total tapped
                }
                var newPoll = data.reverse()
                return res.status(200)
                .json({status: 'success', payload: newPoll})
              })
            })
          })
        })
      })
    })
  })
}
exports.sendEmail = function (req, res) {
  var days = 7
  Users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    users.forEach((user) => {
      let data = {
        subscribers: 0,
        polls: 0,
        broadcasts: 0,
        surveys: 0,
        liveChat: 0
      }
      CompanyUsers.findOne({domain_email: user.domain_email}, (err, companyUser) => {
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
        Subscribers.find({isSubscribed: true, isEnabledByPage: true}, (err, subs) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          if (subs.length > 1) {
            Subscribers.aggregate([
              {
                $match: {
                  $and: [
                    {'datetime': {
                      $gte: new Date(
                        (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                      $lt: new Date(
                        (new Date().getTime()))
                    }
                    }, {companyId: companyUser.companyId},
                {isEnabledByPage: true}, {isSubscribed: true}]
                }}
            ], (err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
              }
              data.subscribers = subscribers.length
                // if (subscribers.length > 50) {
              Polls.aggregate([
                {
                  $match: {
                    $and: [
                      {'datetime': {
                        $gte: new Date(
                          (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                        $lt: new Date(
                          (new Date().getTime()))
                      }
                      }, {companyId: companyUser.companyId}]
                  }}
              ], (err, polls) => {
                if (err) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting surveys count ${JSON.stringify(err)}`
                  })
                }
                data.polls = polls.length
              })
              Surveys.aggregate([
                {
                  $match: {
                    $and: [
                      {'datetime': {
                        $gte: new Date(
                          (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                        $lt: new Date(
                          (new Date().getTime()))
                      }
                      }, {companyId: companyUser.companyId}]
                  }}
              ], (err, surveys) => {
                if (err) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting surveys count ${JSON.stringify(err)}`
                  })
                }
                data.surveys = surveys.length
              })
              Broadcasts.aggregate([
                {
                  $match: {
                    $and: [
                      {'datetime': {
                        $gte: new Date(
                          (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                        $lt: new Date(
                          (new Date().getTime()))
                      }
                      }, {companyId: companyUser.companyId}]
                  }}
              ], (err, broadcasts) => {
                if (err) {
                  return res.status(404).json({
                    status: 'failed',
                    description: `Error in getting surveys count ${JSON.stringify(err)}`
                  })
                }
                LiveChat.aggregate([
                  {
                    $match: {
                      $and: [
                        {'datetime': {
                          $gte: new Date(
                            (new Date().getTime() - (days * 24 * 60 * 60 * 1000))),
                          $lt: new Date(
                            (new Date().getTime()))
                        }
                        }, {companyId: companyUser.companyId}]
                    }}
                ], (err, livechat) => {
                  if (err) {
                    return res.status(404).json({
                      status: 'failed',
                      description: `Error in getting surveys count ${JSON.stringify(err)}`
                    })
                  }
                  data.liveChat = livechat.length
                  let sendgrid = require('sendgrid')(config.sendgrid.username,
                    config.sendgrid.password)

                  let email = new sendgrid.Email({
                    to: user.email,
                    from: 'support@cloudkibo.com',
                    subject: 'KiboPush: Weekly Summary',
                    text: 'Welcome to KiboPush'
                  })

                /*  email.setHtml(
                    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                    '<p style="color: #ffffff">Weekly Summary</p> </td></tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                    '<tr> <td class="wrapper last"> <p> Hello ' + user.name + ', <br> Thank you for joining KiboPush. <br></p><p>Here is your weekly Summary <br> Subscribers: ' + data.subscribers + '<br> Live Chat: ' + data.liveChat + '<br> Broadcasts: ' + data.broadcasts + ' <br> Surveys: ' + data.surveys + ' <br> Polls: ' + data.polls + ' </p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                    '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>') */

                  // email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/api/email_verification/verify/' + tokenString + '"> https://app.kibopush.com/api/email_verification/verify/' + tokenString + '</a>')

                  email.setHtml('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 480px !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ebebeb;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb"> <tr> <td valign="top" bgcolor="#ebebeb" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:35px 0px 0px 0px;background-color:#ffffff;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;" width="600" height="100" src="https://marketing-image-production.s3.amazonaws.com/uploads/63fe9859761f80dce4c7d46736baaa15ca671ce6533ec000c93401c7ac150bbec5ddae672e81ff4f6686750ed8e3fad14a60fc562df6c6fdf70a6ef40b2d9c56.png" alt="Logo"> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <h1 style="text-align: center;"><span style="color:#B7451C;"><span style="font-size:20px;"><span style="font-family:arial,helvetica,sans-serif;">KiboPush Weekly Report</span></span></span></h1> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:30px 045px 30px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div>Hello Anisha,</div><div>&nbsp;</div><div>Hope you are doing great&nbsp;:)</div><div>&nbsp;</div><div>You have become an important part of our community. You have been very active on KiboPush. We are very pleased to share the weekly report of your activities.</div><div>&nbsp;</div><ul><li>New Subscribers=&gt; ' + data.subscribers + '</li><li>New Chats=&gt; ' + data.liveChat + '</li><li>New Broadcasts=&gt; ' + data.broadcasts + '</li><li>New Surveys=&gt; ' + data.surveys + '</li><li>New Polls=&gt; ' + data.polls + '</li></ul><div>If you any queries, you can send message to our <a href="https://www.facebook.com/kibopush/" style="background-color: rgb(255, 255, 255); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-family: arial; font-size: 14px;">&nbsp;Facebook Page</a>. Our admins will get back to you. Or, you can join our <a href="https://www.facebook.com/groups/kibopush/">Facebook Community</a>.</div><div>&nbsp;</div><div>Thank you for your continuous support!</div><div>&nbsp;</div><div>Regards,</div><div>KiboPush Team</div><div>CloudKibo</div></td></tr></table> <table class="module" role="module" data-type="social" align="right" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tbody> <tr> <td valign="top" style="padding:10px 0px 30px 0px;font-size:6px;line-height:10px;background-color:#f5f5f5;"> <table align="right"> <tbody> <tr> <td style="padding: 0px 5px;"> <a role="social-icon-link" href="https://www.facebook.com/kibopush/" target="_blank" alt="Facebook" data-nolink="false" title="Facebook " style="-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;display:inline-block;background-color:#3B579D;"> <img role="social-icon" alt="Facebook" title="Facebook " height="30" width="30" style="height: 30px, width: 30px" src="https://marketing-image-production.s3.amazonaws.com/social/white/facebook.png"/> </a> </td><td style="padding: 0px 5px;"> <a role="social-icon-link" href="https://twitter.com/kibodeveloper" target="_blank" alt="Twitter" data-nolink="false" title="Twitter " style="-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;display:inline-block;background-color:#7AC4F7;"> <img role="social-icon" alt="Twitter" title="Twitter " height="30" width="30" style="height: 30px, width: 30px" src="https://marketing-image-production.s3.amazonaws.com/social/white/twitter.png"/> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body></html>')
                  sendgrid.send(email, function (err, json) {
                    if (err) {
                      logger.serverLog(TAG,
                        `Internal Server Error on sending email : ${JSON.stringify(
                          err)}`)
                    }
                  })
                })
                // }
              })
            })
          }
        })
      })
    })
  })
  return res.status(200)
    .json({status: 'success'})
}
