/**
 * Created by sojharo on 25/09/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/kibodash/dash.controller.js'
const Users = require('../user/Users.model')
const Pages = require('../pages/Pages.model')
const { filterConnectedPages, countResults, joinCompanyWithSubscribers, selectCompanyFields, companyWiseAggregate,
  companyWisePageCount, joinPageWithSubscribers, selectPageFields, broadcastPageCount, filterZeroPageCount,
  selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId } = require('./pipeline')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
const CompanyUsers = require('../companyuser/companyuser.model')
const mongoose = require('mongoose')

exports.platformWiseData = function (req, res) {
  let connectetPages = Pages.aggregate([filterConnectedPages, countResults]).exec()
  let totalPages = Pages.aggregate([countResults]).exec()
  let totalUsers = Users.aggregate([countResults]).exec()
  let totalSubscribers = Subscribers.aggregate([countResults]).exec()
  let totalBroadcasts = Broadcasts.aggregate([countResults]).exec()
  let totalPolls = Polls.aggregate([countResults]).exec()
  let totalSurveys = Surveys.aggregate([countResults]).exec()

  let finalResults = Promise.all([connectetPages, totalPages, totalUsers, totalSubscribers, totalBroadcasts, totalPolls, totalSurveys])
  logger.serverLog(TAG, `user not found for page ${JSON.stringify(finalResults)}`)
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
  let data = Pages.aggregate([ joinPageWithSubscribers, selectPageFields ]).exec()
  let numberOfBroadcast = Broadcasts.aggregate([ broadcastPageCount, filterZeroPageCount, countResults ]).exec()
  let pageWiseBroadcast = Broadcasts.aggregate([ selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId ]).exec()
  let numberOfPoll = Polls.aggregate([ broadcastPageCount, filterZeroPageCount, countResults ]).exec()
  let pageWisePoll = Polls.aggregate([ selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId ]).exec()
  let numberOfSurvey = Surveys.aggregate([ broadcastPageCount, filterZeroPageCount, countResults ]).exec()
  let pageWiseSurvey = Surveys.aggregate([ selectPageIdAndPageCount, getPageCountGreaterThanZero, expandPageIdArray, countByPageId ]).exec()

  let finalResults = Promise.all([ data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll, pageWisePoll, numberOfSurvey, pageWiseSurvey ])
  // let finalResults = Promise.all([ data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll ])

  finalResults.then((results) => {
    let data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll, pageWisePoll, numberOfSurvey, pageWiseSurvey
    // let data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll
    [ data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll, pageWisePoll, numberOfSurvey, pageWiseSurvey ] = results
    // [ data, numberOfBroadcast, pageWiseBroadcast, numberOfPoll ] = results
    numberOfBroadcast = (numberOfBroadcast.length === 0) ? 0 : numberOfBroadcast[0].count
    data = data.map((page) => {
      page.numberOfBroadcasts = numberOfBroadcast
      return page
    })

    data = data.map((page) => {
      pageWiseBroadcast.forEach((item) => {
        if (page.pageId === item._id) page.numberOfBroadcasts += item.count
      })
      return page
    })

    numberOfPoll = (numberOfPoll.length === 0) ? 0 : numberOfPoll[0].count
    data = data.map((page) => {
      page.numberOfPolls = numberOfPoll
      return page
    })

    data = data.map((page) => {
      pageWisePoll.forEach((item) => {
        if (page.pageId === item._id) page.numberOfPolls += item.count
      })
      return page
    })

    numberOfSurvey = (numberOfSurvey.length === 0) ? 0 : numberOfSurvey[0].count
    data = data.map((page) => {
      page.numberOfSurveys = numberOfSurvey
      return page
    })

    data = data.map((page) => {
      pageWiseSurvey.forEach((item) => {
        if (page.pageId === item._id) page.numberOfSurveys += item.count
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

exports.userWiseData = function (req, res) {
  let companySubscribers = CompanyUsers.aggregate([joinCompanyWithSubscribers, selectCompanyFields]).exec()
  let numberOfBroadcasts = Broadcasts.aggregate([companyWiseAggregate]).exec()
  let numberOfPolls = Polls.aggregate([companyWiseAggregate]).exec()
  let numberOfSurveys = Surveys.aggregate([companyWiseAggregate]).exec()
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
        data[i].userName = user.name
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
