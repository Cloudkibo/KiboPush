/**
 * Created by sojharo on 27/07/2017.
 */

//  const GrowthTools = require('./growthTools.model')
const PhoneNumber = require('./growthtools.model')
const Pages = require('../pages/Pages.model')
const logger = require('../../components/logger')
const TAG = 'api/growthtools/growthTools.controller.js'
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')
const crypto = require('crypto')
let request = require('request')
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
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  serverPath += '.' + fext[fext.length - 1]

  let dir = path.resolve(__dirname, '../../../broadcastFiles/')

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }
  fs.rename(
    req.files.file.path,
    dir + '/userfiles' + serverPath,
    err => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      let respSent = false
      fs.createReadStream(dir + '/userfiles' + serverPath)
        .pipe(csv())
        .on('data', function (data) {
          if (data.phone_numbers && data.names) {
            var result = data.phone_numbers.replace(/[- )(]/g, '')
            // var savePhoneNumber = new PhoneNumber({
            //   name: data.name,
            //   number: result,
            //   userId: req.user._id
            // })
            PhoneNumber.update({number: result}, {
              name: data.name,
              number: result,
              userId: req.user._id
            }, {upsert: true}, (err2, phonenumbersaved) => {
              if (err2) {
                return res.status(500).json({
                  status: 'failed',
                  description: 'phone number create failed'
                })
              }
            })
            let pagesFindCriteria = {userId: req.user._id, connected: true, pageId: req.body.pageId}
            Pages.find(pagesFindCriteria, (err, pages) => {
              if (err) {
                logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
              }
              logger.serverLog(TAG, `Pages ${JSON.stringify(pages)}`)
              pages.forEach(page => {
                let messageData = {
                  'recipient': JSON.stringify({
                    'phone_number': result
                  }),
                  'message': JSON.stringify({
                    'text': req.body.text,
                    'metadata': 'This is a meta data'
                  })
                }
                request(
                  {
                    'method': 'POST',
                    'json': true,
                    'formData': messageData,
                    'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                    page.accessToken
                  },
                  function (err, res) {
                    if (err) {
                      return logger.serverLog(TAG,
                        `At invite to messenger using phone ${JSON.stringify(
                          err)}`)
                    } else {
                      logger.serverLog(TAG,
                        `At invite to messenger using phone ${JSON.stringify(
                          res)}`)
                    }
                  })
              })
            })

            if (respSent === false) {
              respSent = true
              return res.status(201)
                .json({
                  status: 'success',
                  description: 'Contacts were invited to your messenger'
                })
            }
          } else {
            return res.status(404)
              .json({status: 'failed', description: 'Incorrect column names'})
          }
        })
      fs.unlinkSync(dir + '/userfiles' + serverPath)

      //  logger.serverLog(TAG,
      //    `file uploaded, sending response now: ${JSON.stringify(serverPath)}`)
      //  return res.status(201).json({status: 'success', payload: serverPath})
    }
  )
}
