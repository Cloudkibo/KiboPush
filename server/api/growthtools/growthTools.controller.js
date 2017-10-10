/**
 * Created by sojharo on 27/07/2017.
 */

//  const GrowthTools = require('./growthTools.model')

const logger = require('../../components/logger')
const TAG = 'api/growthTools/growthTools.controller.js'
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')
exports.index = function (req, res) {
  logger.serverLog(TAG,
    'Index route is called')
  res.send({name: 'sojharo'})
  // fs.createReadStream('./file.csv')
  // .pipe(csv())
  // .on('data', function (data) {
  //   console.log(data)
  // })
}

exports.upload = function (req, res) {
  logger.serverLog(TAG, req)
  logger.serverLog(TAG,
    `upload file route called. request is: ${JSON.stringify(req)}`)
  logger.serverLog(TAG,
    `upload file route called. file is: ${JSON.stringify(req.files)}`)
  var serverPath = req.files.file.path

  let dir = path.resolve(__dirname, '../../../broadcastFiles/')

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }
  logger.serverLog(TAG,
    `upload file route called. req.files.file.path: ${JSON.stringify(req.files.file.path)}`)
  logger.serverLog(TAG, req.files.file.path)
  logger.serverLog(TAG,
    `upload file route called. req.files.file: ${JSON.stringify(req.files.file)}`)
  logger.serverLog(TAG, req.files.file)
  fs.rename(
    req.files.file.path,
    dir + '/userfiles/' + serverPath,
    err => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      logger.serverLog(TAG,
        `file uploaded, sending response now: ${JSON.stringify(serverPath)}`)
      return res.status(201).json({status: 'success', payload: serverPath})
    }
  )
  var a = fs.createReadStream(req.files.file.path)
  .pipe(csv())
  .on('data', function (data) {
    logger.serverLog(TAG, data)
  })
  logger.serverLog(a)
}
