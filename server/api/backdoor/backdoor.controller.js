/**
 * Created by sojharo on 25/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/backdoor/backdoor.controller.js'

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
const mongoose = require('mongoose')
const csvdata = require('csvdata')
const path = require('path')
let config = require('./../../config/environment')
var json2csv = require('json2csv')

let _ = require('lodash')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all users api is working')
  Users.find({}, (err, users) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting users ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total users ${users.length}`)
    res.status(200).json({
      status: 'success',
      payload: users
    })
  })
}

exports.allpages = function (req, res) {
  logger.serverLog(TAG, `Backdoor get all pages ${JSON.stringify(req.params)}`)
  Pages.find({userId: req.params.userid}, (err, pages) => {
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

exports.allsubscribers = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all subscribers api is working')
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
  logger.serverLog(TAG, 'Backdoor get all broadcasts api is working')
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
  logger.serverLog(TAG, 'Backdoor get all polls api is working')
  // todo put pagination for scaling
  Polls.find({userId: req.params.userid}, (err, polls) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting polls ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total polls ${polls.length}`)
    res.status(200).json({
      status: 'success',
      payload: polls
    })
  })
}

exports.allsurveys = function (req, res) {
  logger.serverLog(TAG, 'Backdoor get all surveys api is working')
  // todo put pagination for scaling
  Surveys.find({userId: req.params.userid}, (err, surveys) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting surveys ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total surveys ${surveys.length}`)
    res.status(200).json({
      status: 'success',
      payload: surveys
    })
  })
}
exports.surveyDetails = function (req, res) {
  logger.serverLog(TAG, 'Backdoor surveyDetails api is working')
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
  logger.serverLog(TAG, `Backdoor get all pages ${JSON.stringify(req.params)}`)
  Pages.find({connected: true}, (err, pages) => {
    if (err) {
      return res.status(404).json({
        status: 'failed',
        description: `Error in getting pages ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, `Total pages ${pages.length}`)
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
            logger.serverLog(TAG,
              `MATCH ${pagesPayload[i]._id} ${gotSubscribersCount[j]._id.pageId}`)
            logger.serverLog(TAG, `${JSON.stringify(gotSubscribersCount[j])}`)
            logger.serverLog(TAG, `${JSON.stringify(pagesPayload[i])}`)
            pagesPayload[i].subscribers = gotSubscribersCount[j].count
          }
        }
      }
      let sorted = sortBy(pagesPayload, 'subscribers')
      let top10 = _.takeRight(sorted, 10)
      top10 = top10.reverse()
      logger.serverLog(TAG, `top10 ${JSON.stringify(top10)}`)
      res.status(200).json({
        status: 'success',
        payload: top10
      })
    })
  })
}
exports.datacount = function (req, res) {
  logger.serverLog(TAG,
    `req.params.userid ${JSON.stringify(req.params.userid)}`)
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
    logger.serverLog(TAG, `Total users ${users.length}`)
    let usersPayload = []
    for (let i = 0; i < users.length; i++) {
      usersPayload.push({
        Name: users[i].name,
        Gender: users[i].gender,
        Email: users[i].email,
        Locale: users[i].locale,
        Timezone: users[i].timezone
      })
    }
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
        console.log(err)
      }
      res.set({
        'Content-Disposition': 'attachment; filename=usersInformation.csv',
        'Content-Type': 'text/csv'
      })
      res.status(200).send(csv)
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
