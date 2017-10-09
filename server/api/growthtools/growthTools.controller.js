/**
 * Created by sojharo on 27/07/2017.
 */

//  const GrowthTools = require('./growthTools.model')

const logger = require('../../components/logger')
const TAG = 'api/growthTools/growthTools.controller.js'
// const crypto = require('crypto')
// const path = require('path')
// const fs = require('fs')

exports.index = function (req, res) {
  logger.serverLog(TAG,
    'Index route is called')
  res.send({name: 'sojharo'})
  // var csv = require('csv-parser')
  // var fs = require('fs')
  // fs.createReadStream('./file.csv')
  // .pipe(csv())
  // .on('data', function (data) {
  //   console.log(data)
  // })
}

exports.upload = function (req, res) {
  logger.serverLog(TAG,
    `upload file route called. file is: ${JSON.stringify(req.files)}`)

  // var today = new Date()
  // var uid = crypto.randomBytes(5).toString('hex')
  // var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
  //   (today.getMonth() + 1) + '' + today.getDate()
  // serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
  //   today.getSeconds()
  // let fext = req.files.file.name.split('.')
  // serverPath += '.' + fext[fext.length - 1]
  //
  // let dir = path.resolve(__dirname, '../../../broadcastFiles/')
  //
  // if (req.files.file.size === 0) {
  //   return res.status(400).json({
  //     status: 'failed',
  //     description: 'No file submitted'
  //   })
  // }
  //
  // fs.rename(
  //   req.files.file.path,
  //   dir + '/userfiles/' + serverPath,
  //   err => {
  //     if (err) {
  //       return res.status(500).json({
  //         status: 'failed',
  //         description: 'internal server error' + JSON.stringify(err)
  //       })
  //     }
  //     logger.serverLog(TAG,
  //       `file uploaded, sending response now: ${JSON.stringify(serverPath)}`)
  //     return res.status(201).json({status: 'success', payload: serverPath})
  //   }
  // )
}
