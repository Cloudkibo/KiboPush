/**
 * Created by sojharo on 19/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/broadcast/broadcasts2.controller.js'
const Broadcasts = require('./broadcasts.model')
const Pages = require('../pages/Pages.model')
// const PollResponse = require('../polls/pollresponse.model')
// const SurveyResponse = require('../surveys/surveyresponse.model')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
// const SurveyQuestions = require('../surveys/surveyquestions.model')
const Subscribers = require('../subscribers/Subscribers.model')
// const Workflows = require('../workflows/Workflows.model')
let _ = require('lodash')
// const needle = require('needle')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const utility = require('./broadcasts.utility')
let request = require('request')

exports.sendConversation = function (req, res) {
  logger.serverLog(TAG,
    `Inside Send conversation, req body = ${JSON.stringify(req.body)}`)

  const broadcast = new Broadcasts(utility.prepareBroadCastPayload(req))

  broadcast.save((err, broadcast) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Broadcasts not created'})
    }

    let pagesFindCriteria = {userId: req.user._id, connected: true}

    if (req.body.isSegmented) {
      if (req.body.pageIds) {
        _.merge(pagesFindCriteria, {
          pageId: {
            $in: req.body.pageIds
          }
        })
      }
    }

    Pages.find(pagesFindCriteria, (err, pages) => {
      if (err) {
        logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        return res.status(404)
          .json({status: 'failed', description: 'Pages not found'})
      }

      pages.forEach(page => {
        logger.serverLog(TAG, `Page in the loop ${page.pageName}`)

        let subscriberFindCriteria = {pageId: page._id, isSubscribed: true}

        if (req.body.isSegmented) {
          if (req.body.gender) {
            _.merge(subscriberFindCriteria,
              {gender: req.body.gender.toLowerCase()})
          }
          if (req.body.locale) {
            _.merge(subscriberFindCriteria, {locale: req.body.locale})
          }
        }

        Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
          if (err) {
            return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          }

          logger.serverLog(TAG,
            `Total Subscribers of page ${page.pageName} are ${subscribers.length}`)

          subscribers.forEach(subscriber => {
            logger.serverLog(TAG,
              `At Subscriber fetched ${subscriber.firstName} ${subscriber.lastName}`)

            let messageData = utility.prepareSendAPIPayload(subscriber.senderId,
              req.body.payload)

            logger.serverLog(TAG,
              `Payload for Messenger Send API: ${JSON.stringify(messageData)}`)

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
                    `At send message broadcast ${JSON.stringify(err)}`)
                } else {
                  logger.serverLog(TAG,
                    `At send message broadcast response ${JSON.stringify(res)}`)
                }

                logger.serverLog(TAG,
                  'Sent broadcast to subscriber')

                // update broadcast sent field
                let pagebroadcast = new BroadcastPage({
                  pageId: page.pageId,
                  userId: req.user._id,
                  subscriberId: subscriber.senderId,
                  broadcastId: broadcast._id,
                  seen: false
                })

                pagebroadcast.save((err2) => {
                  if (err2) {
                    return res.status(500).json({
                      status: 'failed',
                      description: 'PageBroadcast create failed'
                    })
                  }
                })
              })
          })
        })
      })
    })
    return res.status(200)
      .json({status: 'success', payload: {broadcast: broadcast}})
  })
}

exports.upload = function (req, res) {
  logger.serverLog(TAG,
    `upload file route called. file is: ${JSON.stringify(req.files)}`)

  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  serverPath += '.' + fext[fext.length - 1]

  console.log(__dirname)

  let dir = path.resolve(__dirname, '../../../broadcastFiles/')

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }

  fs.rename(
    req.files.file.path,
    dir + '/userfiles/' + serverPath,
    err => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }

      return res.status(201).json({status: 'success', payload: serverPath})
    }
  )
}

exports.download = function (req, res) {
  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
  try {
    res.sendfile(req.params.id, {root: dir})
  } catch (err) {
    logger.serverLog(TAG,
      `Inside Download file, err = ${JSON.stringify(err)}`)
    res.status(201)
      .json({status: 'success', payload: 'Not Found ' + JSON.stringify(err)})
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG,
    `Inside delete file Broadcast`)
  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
  // unlink file
  fs.unlink(dir + '/' + req.params.id, function (err) {
    if (err) {
      logger.serverLog(TAG, err)
      return res.status(404)
        .json({status: 'failed', description: 'File not found'})
    } else {
      logger.serverLog(TAG, 'file deleted')
      return res.status(200)
        .json({status: 'failed', payload: 'File deleted successfully'})
    }
  })
}
