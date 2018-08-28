/**
 * Created by sojharo on 25/09/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/operational_dashboard/operational.controller.js'
const request = require('request-promise')
const config = require('../../config/environment/index')
const Pages = require('../pages/Pages.model')
const utility = require('./utility')

/*
Endpoint: /api/v1/PagewiseData
Type: Get
Responds: Array
Structure: TotalPagewiseAnalytics
Endpoint: /api/v1/PagewiseData/OnePageAnalytics
Type: Post
Body: pageId
Responds: Array
Structure: TotalPagewiseAnalytics
Endpoint: /api/v1/PagewiseData/AggregateDatewise
Type: Post
Body: startDate
Responds: Array
Structure: PagewiseAggregate
Endpoint: /api/v1/PagewiseData/OnePageAggregateDatewise
Type: Post
Body: startDate, pageId
Responds: Array
Structure: PagewiseAggregate
Endpoint: /api/v1/PagewiseData/topPages
Type: Post
Body: limit
Responds: Array
Structure: TotalPagewiseAnalytics
*/

exports.index = (req, res) => {
  const options = {
    uri: config.kibodashdomain + '/api/v1/PagewiseData',
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
    uri: config.kibodashdomain + '/api/v1/PagewiseData/AggregateDatewise',
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

exports.onePage = (req, res) => {
  const options = {
    method: 'POST',
    uri: config.kibodashdomain + '/api/v1/PagewiseData/OnePageAnalytics',
    body: {
      pageId: req.body.pageId
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

exports.onePageRanged = (req, res) => {
  const options = {
    method: 'POST',
    uri: config.kibodashdomain + '/api/v1/PagewiseData/OnePageAggregateDatewise',
    body: {
      startDate: req.body.startDate,
      pageId: req.body.pageId
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

exports.topPages = (req, res) => {
  const options = {
    method: 'POST',
    uri: config.kibodashdomain + '/api/v1/PagewiseData/topPages',
    body: {
      limit: req.body.limit
    },
    json: true // Automatically parses the JSON string in the response
  }
  request(options)
  .then((result) => {
    let pageIds = utility.getPageIdsFromTopPagesPayload(result.payload)
    if (pageIds) {
      Pages.find({pageId: {$in: pageIds}})
      .populate('userId')
      .exec()
      .then((results) => {
        let finalPayload = utility.mergePayload(results, result.payload)
        return res.status(200).json({status: 'success', payload: finalPayload})
      })
      .catch((err) => {
        logger.serverLog(TAG, `Error in fetching data from KiboDash ${JSON.stringify(err)}`)
        return res.status(500).json({status: 'failed', description: err})
      })
    } else {
      return res.status(500).json({status: 'failed', description: 'Error in finding pageIds'})
    }
  })
  .catch((err) => {
    logger.serverLog(TAG, `Error in fetching data from KiboDash ${JSON.stringify(err)}`)
    return res.status(500).json({status: 'failed', description: err})
  })
}
