
const logger = require('../../components/logger')
const TAG = 'api/kibodash/dash.controller.js'
const Users = require('../user/Users.model')
const Pages = require('../pages/Pages.model')
const PageBroadcasts = require('../page_broadcast/page_broadcast.model')
const PagePolls = require('../page_poll/page_poll.model')
const PageSurveys = require('../page_survey/page_survey.model')
const { filterConnectedPages, countResults, joinCompanyWithSubscribers, selectCompanyFields, filterDate,
  groupCompanyWiseAggregates, companyWisePageCount, joinPageWithSubscribers, selectPageFields,
  filterCompanySubscribers, filterUserDate, pageWiseAggregate } = require('./pipeline')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const CompanyUsers = require('../companyuser/companyuser.model')
const mongoose = require('mongoose')

exports.platformWiseData = function (req, res) {
  let startDate = req.body.start_date
  let dateFilterAggregates = filterDate
  dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }

  let userDateFilter = filterUserDate
  userDateFilter['$match']['createdAt'] = { $gte: new Date(startDate) }
  let connectetPages = Pages.aggregate([filterConnectedPages, countResults]).exec()
  let totalPages = Pages.aggregate([countResults]).exec()
  let totalUsers = Users.aggregate([userDateFilter, countResults]).exec()
  let totalSubscribers = Subscribers.aggregate([dateFilterAggregates, countResults]).exec()
  let totalBroadcasts = Broadcasts.aggregate([dateFilterAggregates, countResults]).exec()
  let totalPolls = Polls.aggregate([dateFilterAggregates, countResults]).exec()
  let totalSurveys = Surveys.aggregate([dateFilterAggregates, countResults]).exec()

  let finalResults = Promise.all([connectetPages, totalPages, totalUsers, totalSubscribers, totalBroadcasts, totalPolls, totalSurveys])
  //logger.serverLog(TAG, `user not found for page ${JSON.stringify(finalResults)}`)
  finalResults.then(function (results) {
    let data = {
      connectedPages: (results[0].length === 0) ? 0 : results[0][0].count,
      totalPages: (results[1].length === 0) ? 0 : results[1][0].count,
      totalUsers: (results[2].length === 0) ? 0 : results[2][0].count,
      totalSubscribers: (results[3].length === 0) ? 0 : results[3][0].count,
      totalBroadcasts: (results[4].length === 0) ? 0 : results[4][0].count,
      totalPolls: (results[5].length === 0) ? 0 : results[5][0].count,
      totalSurveys: (results[6].length === 0) ? 0 : results[6][0].count
    }
    res.status(200).json({
      status: 'success',
      payload: data
    })
  }).catch((err) => {
    console.log('in error')
    res.status(500).json({
      status: 'failed',
      error: err
    })
  })
}

exports.pageWiseData = function (req, res) {
  let data = Pages.aggregate([ joinPageWithSubscribers, selectPageFields ]).exec()
  let numberOfBroadcast = PageBroadcasts.aggregate([ pageWiseAggregate ]).exec()
  // let pageWiseBroadcast = Broadcasts.aggregate([ selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId ]).exec()
  let numberOfPoll = PagePolls.aggregate([ pageWiseAggregate ]).exec()
  // let pageWisePoll = Polls.aggregate([ selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId ]).exec()
  let numberOfSurvey = PageSurveys.aggregate([ pageWiseAggregate ]).exec()
  // let pageWiseSurvey = Surveys.aggregate([ selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId ]).exec()

  let finalResults = Promise.all([ data, numberOfBroadcast, numberOfPoll, numberOfSurvey ])
  // let finalResults = Promise.all([ data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll ])

  finalResults.then((results) => {
    data = results[0]
    let broadcastAggregates = results[1]
    let pollsAggregate = results[2]
    let surveysAggregate = results[3]
    // set Broadcasts count
    data = data.map((page) => {
      broadcastAggregates.forEach((broadcast) => {
        if (page.pageId.toString() === broadcast._id) {
          console.log('in if')
          page.numberOfBroadcasts = broadcast.totalCount
        }
      })
      return page
    })
    // set Polls counts
    data = data.map((page) => {
      pollsAggregate.forEach((poll) => {
        if (page.pageId.toString() === poll._id) {
          console.log('in if')
          page.numberOfPolls = poll.totalCount
        }
      })
      return page
    })
    // set Survey count
    data = data.map((page) => {
      surveysAggregate.forEach((survey) => {
        if (page.pageId.toString() === survey._id) {
          console.log('in if')
          page.numberOfSurveys = survey.totalCount
        }
      })
      return page
    })

    res.status(200).json({
      status: 'success',
      payload: data
    })
  }).catch((err) => {
    return res.status(500).json({
      status: 'failed',
      error: err
    })
  })
}

exports.companyWiseData = function (req, res) {
  let startDate = req.body.startDate
  let dateFilterSubscribers = filterCompanySubscribers
  dateFilterSubscribers['$project']['companysubscribers']['$filter']['cond'] = {$gte: ['$$companysubscriber.datetime', new Date(startDate)]}
  let dateFilterAggregates = filterDate
  dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }
  let companySubscribers = CompanyUsers.aggregate([joinCompanyWithSubscribers, dateFilterSubscribers, selectCompanyFields]).exec()
  let numberOfBroadcasts = Broadcasts.aggregate([dateFilterAggregates, groupCompanyWiseAggregates]).exec()
  let numberOfPolls = Polls.aggregate([dateFilterAggregates, groupCompanyWiseAggregates]).exec()
  let numberOfSurveys = Surveys.aggregate([dateFilterAggregates, groupCompanyWiseAggregates]).exec()
  let companyPagesCount = Pages.aggregate([companyWisePageCount]).exec()
  let companyConnectedPagesCount = Pages.aggregate([filterConnectedPages, companyWisePageCount]).exec()
  let finalResults = Promise.all([companySubscribers, numberOfBroadcasts, numberOfPolls, numberOfSurveys,
    companyPagesCount, companyConnectedPagesCount])

  finalResults.then(function (results) {
    let data = {}
    data = results[0]
    for (let i = 0; i < data.length; i++) {
      let userId = mongoose.Types.ObjectId(data[i].userId)
      Users.findOne({ '_id': userId }, (err, user) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`})
        }
        if (user != null) {
          data[i].userName = user.name
        }
        if (i === (data.length - 1)) {
          setBroadcastsCount(results, data)
          setPollsCount(results, data)
          setSurveysCount(results, data)
          setTotalPagesCount(results, data)
          setConnectedPagesCount(results, data)
          console.log('data' + JSON.stringify(data))

          res.status(200).json({
            status: 'success',
            payload: data
          })
        }
      })
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'failed',
      error: err
    })
  })
}

function setBroadcastsCount (results, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < results[1].length; j++) {
      if (results[1][j]._id.toString() === data[i].companyId.toString()) {
        let broadcasts = results[1][j]
        data[i].numberOfBroadcasts = broadcasts.totalCount
      }
    }
  }
}

function setPollsCount (results, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < results[2].length; j++) {
      if (results[2][j]._id.toString() === data[i].companyId.toString()) {
        let polls = results[2][j]
        data[i].numberOfPolls = polls.totalCount
      }
    }
  }
}

function setSurveysCount (results, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < results[3].length; j++) {
      if (results[3][j]._id.toString() === data[i].companyId.toString()) {
        let surveys = results[3][j]
        data[i].numberOfSurveys = surveys.totalCount
      }
    }
  }
}
function setTotalPagesCount (results, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < results[4].length; j++) {
      if (results[4][j]._id.toString() === data[i].companyId.toString()) {
        let pages = results[4][j]
        data[i].numberOfPages = pages.totalPages
      }
    }
  }
}

function setConnectedPagesCount (results, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < results[5].length; j++) {
      if (results[5][j]._id.toString() === data[i].companyId.toString()) {
        let pages = results[5][j]
        data[i].numberOfConnectedPages = pages.totalPages
      }
    }
  }
}
