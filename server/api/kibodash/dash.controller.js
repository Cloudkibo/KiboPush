
const logger = require('../../components/logger')
const TAG = 'api/kibodash/dash.controller.js'
const Users = require('../user/Users.model')
const Pages = require('../pages/Pages.model')
const Autoposting = require('../autoposting/autopostings.model')
const PageBroadcasts = require('../page_broadcast/page_broadcast.model')
const PagePolls = require('../page_poll/page_poll.model')
const PageSurveys = require('../page_survey/page_survey.model')
const { filterConnectedPages, countResults, joinCompanyWithSubscribers, selectCompanyFields, filterDate,
  groupCompanyWiseAggregates, companyWisePageCount, joinPageWithSubscribers, selectPageFields,
  filterCompanySubscribers, filterUserDate, pageWiseAggregate, filterPageSubscribers,
  joinAutpostingMessages, dateFilterAutoposting, selectAutoPostingFields,
  selectTwitterType, selectFacebookType, selectWordpressType } = require('./pipeline')
const { setBroadcastsCount, setPollsCount, setSurveysCount, setTotalPagesCount, setConnectedPagesCount } = require('./utility')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const CompanyUsers = require('../companyuser/companyuser.model')
const mongoose = require('mongoose')

exports.platformWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
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
  // logger.serverLog(TAG, `user not found for page ${JSON.stringify(finalResults)}`)
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
    res.status(500).json({
      status: 'failed',
      error: err
    })
  })
}

exports.pageWiseData = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let startDate = req.body.startDate
  let dateFilterSubscribers = filterPageSubscribers
  // add the date filter(as from reqeust) in the aggregate pipeline query for subscribers page wise
  dateFilterSubscribers['$project']['pageSubscribers']['$filter']['cond'] = {$gte: ['$$pageSubscriber.datetime', new Date(startDate)]}
  let dateFilterAggregates = filterDate
  // add date filter for broadcasts, polls, surveys count-page wise
  dateFilterAggregates['$match']['datetime'] = { $gte: new Date(startDate) }
  let data = Pages.aggregate([ joinPageWithSubscribers, dateFilterSubscribers, selectPageFields ]).exec()
  let numberOfBroadcast = PageBroadcasts.aggregate([ dateFilterAggregates, pageWiseAggregate ]).exec()
  let numberOfPoll = PagePolls.aggregate([ dateFilterAggregates, pageWiseAggregate ]).exec()
  let numberOfSurvey = PageSurveys.aggregate([ dateFilterAggregates, pageWiseAggregate ]).exec()
  let finalResults = Promise.all([ data, numberOfBroadcast, numberOfPoll, numberOfSurvey ])

  finalResults.then((results) => {
    data = results[0]
    let broadcastAggregates = results[1]
    let pollsAggregate = results[2]
    let surveysAggregate = results[3]
    // set Broadcasts count
    data = data.map((page) => {
      broadcastAggregates.forEach((broadcast) => {
        if (page.pageId.toString() === broadcast._id) {
          page.numberOfBroadcasts = broadcast.totalCount
        }
      })
      return page
    })
    // set Polls counts
    data = data.map((page) => {
      pollsAggregate.forEach((poll) => {
        if (page.pageId.toString() === poll._id) {
          page.numberOfPolls = poll.totalCount
        }
      })
      return page
    })
    // set Survey count
    data = data.map((page) => {
      surveysAggregate.forEach((survey) => {
        if (page.pageId.toString() === survey._id) {
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
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
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

// Twitter AutoPosting Data
exports.getTwitterAutoposting = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let queries = []
  if (req.body.start_date !== '') {
    queries = [
      joinAutpostingMessages,
      dateFilterAutoposting(req.body.startDate),
      selectAutoPostingFields,
      selectTwitterType]
  } else {
    queries = [
      joinAutpostingMessages,
      selectAutoPostingFields,
      selectTwitterType]
  }
  Autoposting
  .aggregate(queries)
  .exec()
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Some error occured in getting autoposting ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}

// Facebook AutoPosting Data
exports.getFacebookAutoposting = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let queries = []
  if (req.body.startDate !== '') {
    queries = [
      joinAutpostingMessages,
      dateFilterAutoposting(req.body.startDate),
      selectAutoPostingFields,
      selectFacebookType]
  } else {
    queries = [
      joinAutpostingMessages,
      selectAutoPostingFields,
      selectFacebookType]
  }
  Autoposting
  .aggregate(queries)
  .exec()
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Some error occured in getting autoposting ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}

// Wordpress AutoPosting Data
exports.getWordpressAutoposting = function (req, res) {
  logger.serverLog(TAG, `Request from KiboDash ${req.body}`)
  let queries = []
  if (req.body.startDate !== '') {
    queries = [
      joinAutpostingMessages,
      dateFilterAutoposting(req.body.startDate),
      selectAutoPostingFields,
      selectWordpressType]
  } else {
    queries = [
      joinAutpostingMessages,
      selectAutoPostingFields,
      selectWordpressType]
  }
  Autoposting
  .aggregate(queries)
  .exec()
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Some error occured in getting autoposting ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}
