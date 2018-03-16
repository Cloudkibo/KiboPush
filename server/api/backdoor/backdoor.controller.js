/**
 * Created by sojharo on 25/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/backdoor/backdoor.controller.js'
const CompanyUsers = require('./../companyprofile/companyprofile.model')
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
  //  5a584c3729a3150272d8c007
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
    logger.serverLog(TAG, `Total subscribers ${subscribers.length}`)
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
    logger.serverLog(TAG, `Total broadcasts ${broadcasts.length}`)
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
      logger.serverLog(TAG, `top10 pages ${JSON.stringify(top10)}`)
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
      logger.serverLog(TAG,
                    `File data ${JSON.stringify(usersPayload)}`)
      //  let dir = path.resolve(__dirname, './my-file.csv')
      // let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles/users.csv')
      // csvdata.write(dir, usersPayload,
      //   {header: 'Name,Gender,Email,Locale,Timezone'})
      // logger.serverLog(TAG, 'created file')
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
      //   logger.serverLog(TAG,
      //     `Inside Download file, err = ${JSON.stringify(err)}`)
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
          logger.serverLog(TAG,
            'user object sent to client failed ' + JSON.stringify(err))
          return res.status(500).json({
            status: 'failed',
            description: 'internal server error' + JSON.stringify(err)
          })
        }
        CompanyUsers.find({_id: {
          $in: tempCompany
        }}, (err, companies) => {
          if (err) {
            logger.serverLog(TAG,
              'user object sent to client failed ' + JSON.stringify(err))
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          Pages.find({}, (err, pages) => {
            if (err) {
              logger.serverLog(TAG,
                'user object sent to client failed ' + JSON.stringify(err))
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
            logger.serverLog(TAG,
              'user object sent to client failed ' + JSON.stringify(err))
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          CompanyUsers.find({_id: {
            $in: tempCompany
          }}, (err, companies) => {
            if (err) {
              logger.serverLog(TAG,
                'user object sent to client failed ' + JSON.stringify(err))
              return res.status(500).json({
                status: 'failed',
                description: 'internal server error' + JSON.stringify(err)
              })
            }
            Pages.find({}, (err, pages) => {
              if (err) {
                logger.serverLog(TAG,
                  'user object sent to client failed ' + JSON.stringify(err))
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
                  logger.serverLog(TAG,
                    'response of survey first ' + JSON.stringify(responsesurvey))
                  for (let n = 0; n < pagesurvey.length; n++) {
                    let subscriber = subscribers.filter((c) => c.senderId === pagesurvey[n].subscriberId)
                    let subscriberPage = pages.filter((c) => JSON.stringify(c._id) === JSON.stringify(subscriber[0].pageId))
                    // if (responsesurvey[n]) {
                    //   let subscriberNew = subscribers.filter((c) => JSON.stringify(c._id) === JSON.stringify(responsesurvey[n].subscriberId))
                    //   logger.serverLog(TAG,
                    //     'response of survey second ' + JSON.stringify(subscriberNew))
                    //   if (subscriberNew.length > 0) {
                    //     logger.serverLog(TAG,
                    //       'response of survey inside if')
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
                      }
                    }
                  }
                  logger.serverLog(TAG, 'response of survey subscriber ' + JSON.stringify(subscriberData))
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
                    responded: subscriberData.length,
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
            logger.serverLog(TAG,
              'user object sent to client failed ' + JSON.stringify(err))
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          CompanyUsers.find({_id: {
            $in: tempCompany
          }}, (err, companies) => {
            if (err) {
              logger.serverLog(TAG,
                'user object sent to client failed ' + JSON.stringify(err))
              return res.status(500).json({
                status: 'failed',
                description: 'internal server error' + JSON.stringify(err)
              })
            }
            Pages.find({}, (err, pages) => {
              if (err) {
                logger.serverLog(TAG,
                  'user object sent to client failed ' + JSON.stringify(err))
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
