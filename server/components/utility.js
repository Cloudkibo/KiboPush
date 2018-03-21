/**
 * Created by sojharo on 16/12/2017.
 */

const config = require('../config/environment/index')
const logger = require('./logger')
const TAG = 'components/utility.js'
let Plans = require('../api/permissions_plan/permissions_plan.model')

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

exports.validateUrl = validateUrl
exports.setupPlans = setupPlans
