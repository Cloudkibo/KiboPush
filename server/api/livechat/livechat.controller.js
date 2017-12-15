'use strict'

const logger = require('../../components/logger')
const TAG = 'api/livechat/livechat.controller.js'
const og = require('open-graph')
let request = require('request')
let LiveChat = require('./livechat.model')
let Sessions = require('./../sessions/sessions.model')
let Subscribers = require('./../subscribers/Subscribers.model')
let utility = require('./../broadcasts/broadcasts.utility')
const _ = require('lodash')

// Get list of Facebook Chat Messages
exports.index = function (req, res) {
  LiveChat.find({session_id: req.params.session_id}, (err, fbchats) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    return res.status(200).json({
      status: 'success',
      payload: fbchats
    })
  })
}

exports.create = function (req, res) {
  logger.serverLog(TAG,
    `Inside Send chat, req body = ${JSON.stringify(req.body)}`)

  let parametersMissing = false

  if (!_.has(req.body, 'sender_id')) parametersMissing = true
  if (!_.has(req.body, 'recipient_id')) parametersMissing = true
  if (!_.has(req.body, 'sender_fb_id')) parametersMissing = true
  if (!_.has(req.body, 'recipient_fb_id')) parametersMissing = true
  if (!_.has(req.body, 'session_id')) parametersMissing = true
  if (!_.has(req.body, 'company_id')) parametersMissing = true
  if (!_.has(req.body, 'payload')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  const chatMessage = new LiveChat({
    sender_id: req.body.sender_id, // this is the page id: _id of Pageid
    recipient_id: req.body.recipient_id, // this is the subscriber id: _id of subscriberId
    sender_fb_id: req.body.sender_fb_id, // this is the (facebook) :page id of pageId
    recipient_fb_id: req.body.recipient_fb_id, // this is the (facebook) subscriber id : pageid of subscriber id
    session_id: req.body.session_id,
    company_id: req.body.company_id, // this is admin id till we have companies
    payload: req.body.payload, // this where message content will go
    url_meta: req.body.url_meta,
    status: 'unseen' // seen or unseen
  })

  chatMessage.save((err, chatMessage) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Broadcasts not created'})
    }

    Sessions.findOne({_id: req.body.session_id})
      .populate('page_id')
      .exec((err, session) => {
        if (err) {
          logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          return res.status(404)
            .json({status: 'failed', description: 'Pages not found'})
        }
        logger.serverLog(TAG, `Page got ${session.page_id.pageName}`)

        Subscribers.findOne({_id: req.body.recipient_id}, (err, subscriber) => {
          if (err) {
            return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          }

          logger.serverLog(TAG,
            `At Subscriber fetched ${subscriber.firstName} ${subscriber.lastName} for payload ${req.body.payload.componentType}`)
          let messageData = utility.prepareSendAPIPayload(
            subscriber.senderId,
            req.body.payload, true)

          request(
            {
              'method': 'POST',
              'json': true,
              'formData': messageData,
              'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
              session.page_id.accessToken
            },
            (err, res) => {
              if (err) {
                return logger.serverLog(TAG,
                  `At send message live chat ${JSON.stringify(err)}`)
              } else {
                if (res.statusCode !== 200) {
                  logger.serverLog(TAG,
                    `At send message live chat response ${JSON.stringify(
                      res.body.error)}`)
                } else {
                  logger.serverLog(TAG,
                    `At send message live chat response ${JSON.stringify(
                      res.body.message_id)}`)
                }
              }
            })
        })
      })
    return res.status(200).json({status: 'success', payload: chatMessage})
  })
}

// Updates an existing message in the DB.
exports.update = function (req, res) {
  LiveChat.findOne({_id: req.body.id}, (err, message) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    message.urlmeta = req.body.urlmeta
    message.save(err => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      return res.status(201).json({
        status: 'success',
        payload: message
      })
    })
  })
}

exports.geturlmeta = function (req, res) {
  var url = req.body.url
  logger.serverLog(TAG, `Url for Meta: ${url}`)
  og(url, (err, meta) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'Meta data not found'})
    }
    logger.serverLog(TAG, `Url Meta: ${meta}`)
    res.status(200).json({status: 'success', payload: meta})
  })
}
