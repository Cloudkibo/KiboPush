const logger = require('../../../components/logger')
const TAG = 'api/v2/companyprofile/company.controller.js'
const utility = require('../utility')
// const logicLayer = require('./commentCapture.logiclayer')
const _ = require('lodash')

exports.members = function (req, res) {
  utility.callApi(`companyprofile/members`, 'get', {}, req.headers.authorization)
    .then(members => {
      res.status(200).json({status: 'success', payload: members})
    })
    .catch(err => {
      res.status(500).json({status: 'failed', payload: `Failed to fetch members ${err}`})
    })
}

exports.invite = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  utility.callApi('companyprofile/invite', 'post', {email: req.body.email, name: req.body.name}, req.headers.authorization)
  .then((result) => {
    logger.serverLog(TAG, 'result from invite endpoint accounts')
    logger.serverLog(TAG, result)
    res.status(200).json(result)
  })
  .catch((err) => {
    logger.serverLog(TAG, 'result from invite endpoint accounts')
    logger.serverLog(TAG, err)
    res.status(500).json(err)
  })
}