/**
 * Created by sojharo on 16/12/2017.
 */

const config = require('../config/environment/index')
const logger = require('./logger')
const TAG = 'components/utility.js'
let Plans = require('../api/v1/permissions_plan/permissions_plan.model')
let sessions = require('../api/v1/sessions/sessions.model')
let subscribers = require('../api/v1/subscribers/Subscribers.model')

function validateUrl (str) {
  let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  if (regexp.test(str)) {
    return true
  } else {
    return false
  }
}

function setupPlans () {
  Plans.findOne({}, (err, plan) => {
    if (err) {
      return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
    }
    if (!plan) {
      let payload = new Plans({
        plan_A: config.plans.plan_A, // Individual Paid
        plan_B: config.plans.plan_B, // Individual Unpaid
        plan_C: config.plans.plan_C, // Team Paid
        plan_D: config.plans.plan_D  // Team Unpaid
      })
      payload.save((err, savedPlan) => {
        if (err) {
          return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
        }
      })
    }
  })
}

let request = require('request')
let crypto = require('crypto')
let username = 'demo.cloudkibo.api'
let apiKey = 'b64228a5-cb5f-f1d4-c7ef-5a3a45f40586'
let dbMode = '1'
let password = apiKey + '|' + dbMode
let ngp_api = require('./../api/v1/api_ngp/api_ngp.model')

function test () {
  var options = {
    headers: { 'Content-type': 'application/json' },
    auth: {
      user: username,
      password: password
    },
    json: {
      'message': 'Hello, world'
    },
    uri: 'https://api.securevan.com/v4/echoes'
  }
  request.post(options, function (err, res, body) {
    if (err) {
      console.dir(err)
      return
    }
    console.dir(res.statusCode)
    console.dir(body)
  })
}
// vanIds to check: 101097013, 101097014
function addVanSupporter (payload) {
  ngp_api.findOne({company_id: payload.companyId}, (err, ngp_payload) => {
    if (err) {
      return logger.serverLog(TAG, 'Internal Server Error on VAN Supporter GET ' + JSON.stringify(err))
    }
    if (ngp_payload && ngp_payload.enabled) {
      var today = new Date()
      var uid = crypto.randomBytes(5).toString('hex')
      let tokenString = 'f' + uid + '' + today.getFullYear() + '' +
        (today.getMonth() + 1) + '' + today.getDate() + '' +
        today.getHours() + '' + today.getMinutes() + '' +
        today.getSeconds()
      var options = {
        headers: { 'Content-type': 'application/json' },
        auth: {
          user: ngp_payload.app_id,
          password: ngp_payload.app_secret + '|' + dbMode
        },
        json: {
          'firstName': payload.firstName,
          'lastName': payload.lastName,
          'sex': payload.sex,
          'emails': [{
            'email': '' + tokenString + '@gotham.city.us',
            'type': 'P',
            'isPreferred': true
          }]
        },
        uri: 'https://api.securevan.com/v4/people/findOrCreate'
      }
      request.post(options, function (err, res, body) {
        if (err) {
          console.dir(err)
          logger.serverLog(TAG, 'Internal Server Error on VAN Supporter API CALL ' + JSON.stringify(err))
          return
        }
        logger.serverLog(TAG, 'Added subscriber to VAN')
        console.dir(res.statusCode)
        console.dir(body)
      })
    }
  })
}

function findVanSupport () {
  var options = {
    headers: { 'Content-type': 'application/json' },
    auth: {
      user: username,
      password: password
    },
    uri: 'https://api.securevan.com/v4/people/101097014?$expand=emails'
  }
  request.get(options, function (err, res, body) {
    if (err) {
      console.dir(err)
      return
    }
    console.dir(res.statusCode)
    console.dir(body)
  })
}

function checkLastMessageAge (subscriberId, callback) {
  subscribers.findOne({ senderId: subscriberId }, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG, 'inside error')
      return callback(err)
    }
    sessions.findOne({ subscriber_id: subscriber._id }, (err, session) => {
      if (err) {
        logger.serverLog(TAG, 'inside error')
        return callback(err)
      }
      if (session && session.agent_activity_time) {
        let lastActivity = new Date(session.agent_activity_time)
        let inMiliSeconds = Date.now() - lastActivity
        let inMinutes = Math.floor((inMiliSeconds / 1000) / 60)

        callback(null, (inMinutes > 30))
      }
    })
  })
}

exports.validateUrl = validateUrl
exports.setupPlans = setupPlans
exports.test = test
exports.addVanSupporter = addVanSupporter
exports.findVanSupport = findVanSupport
exports.checkLastMessageAge = checkLastMessageAge
