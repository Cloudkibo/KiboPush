/**
 * Created by sojharo on 25/09/2017.
 */
// const logger = require('../../components/logger')
// const TAG = 'api/backdoor/backdoor.controller.js'
// const Users = require('../user/Users.model')
// const Pages = require('../pages/Pages.model')
// const Subscribers = require('../subscribers/Subscribers.model')
// const Broadcasts = require('../broadcasts/broadcasts.model')
// const Polls = require('../polls/Polls.model')
// const Surveys = require('../surveys/surveys.model')
// const config = require('./../../config/environment/index')
 const mongoose = require('mongoose')
// var json2csv = require('json2csv')

exports.platformWiseData = function (req, res) {
  res.status(200).json({
    status: 'success',
    payload: {text: 'I am a barbie girl in the barbie world'}
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
