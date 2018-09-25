/**
 * Created by sojharo on 25/09/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/operational_dashboard/operational.controller.js'
const request = require('request-promise')
const config = require('../../config/environment/index')

/*
//for platform wise total autoposting
Endpoint: /api/v1/AutopostingData
Type: Get
Responds: Array
Structure: {status: 'success', payload: {totalAutoposting, facebookAutoposting, twitterAutoposting, wordpressAutoposting}}
Endpoint: /api/v1/AutopostingData/UserTotalAutoposting
Type: post
Body: companyId
Responds: Array
Structure: {status: 'success', payload: {companyId, totalAutoposting, facebookAutoposting, twitterAutoposting, wordpressAutoposting}}
Endpoint: /api/v1/AutopostingData/UserAutopostingDatewise
Type: post
Body: companyId, startDate
Responds: Array
Structure: {status: 'success', payload: {companyId, startDate, totalAutoposting, facebookAutoposting, twitterAutoposting, wordpressAutoposting}}
Endpoint: /api/v1/AutopostingData/PlatformAutopostingDatewise
Type: post
Body: startDate
Responds: Array
Structure: {status: 'success', payload: {startDate, totalAutoposting, facebookAutoposting, twitterAutoposting, wordpressAutoposting}}
*/

exports.index = (req, res) => {
  const options = {
    uri: config.kibodashdomain + '/api/v1/AutopostingData',
    json: true // Automatically parses the JSON string in the response
  }
  request(options)
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result.payload})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in fetching data from KiboDash ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}

exports.ranged = (req, res) => {
  const options = {
    method: 'POST',
    uri: config.kibodashdomain + '/api/v1/AutopostingData/PlatformAutopostingDatewise',
    body: {
      startDate: req.body.startDate
    },
    json: true // Automatically parses the JSON string in the response
  }
  request(options)
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result.payload})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in fetching data from KiboDash ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}

exports.userwise = (req, res) => {
  const options = {
    method: 'POST',
    uri: config.kibodashdomain + '/api/v1/AutopostingData/UserTotalAutoposting',
    body: {
      companyId: req.body.companyId
    },
    json: true // Automatically parses the JSON string in the response
  }
  request(options)
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result.payload})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in fetching data from KiboDash ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}

exports.userwiseRanged = (req, res) => {
  const options = {
    method: 'POST',
    uri: config.kibodashdomain + '/api/v1/AutopostingData/UserAutopostingDatewise',
    body: {
      startDate: req.body.startDate,
      companyId: req.body.companyId
    },
    json: true // Automatically parses the JSON string in the response
  }
  request(options)
  .then((result) => {
    return res.status(200).json({status: 'success', payload: result.payload})
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in fetching data from KiboDash ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}