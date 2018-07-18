/**
 * Created by sojharo on 25/09/2017.
 */
// const logger = require('../../components/logger')
// const TAG = 'api/backdoor/backdoor.controller.js'
const Users = require('../user/Users.model')
const Pages = require('../pages/Pages.model')
const { filterConnectedPages, countResults } = require('./pipeline')
const Subscribers = require('../subscribers/Subscribers.model')
const Broadcasts = require('../broadcasts/broadcasts.model')
const Polls = require('../polls/Polls.model')
const Surveys = require('../surveys/surveys.model')
// const config = require('./../../config/environment/index')
 // const mongoose = require('mongoose')
// var json2csv = require('json2csv')

exports.platformWiseData = function (req, res) {
  let connectetPages = Pages.aggregate([filterConnectedPages, countResults]).exec()
  let totalPages = Pages.aggregate([countResults]).exec()
  let totalUsers = Users.aggregate([countResults]).exec()
  let totalSubscribers = Subscribers.aggregate([countResults]).exec()
  let totalBroadcasts = Broadcasts.aggregate([countResults]).exec()
  let totalPolls = Polls.aggregate([countResults]).exec()
  let totalSurveys = Surveys.aggregate([countResults]).exec()

  let finalResults = Promise.all([connectetPages, totalPages, totalUsers, totalSubscribers, totalBroadcasts, totalPolls, totalSurveys])

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
  res.status(200).json({
    status: 'success',
    payload: {text: 'Sher aya k chor aya!!!'}
  })
}

exports.userWiseData = function (req, res) {
  res.status(200).json({
    status: 'success',
    payload: {text: 'The man who walks with the crowd can get no further than the crowd'}
  })
}
