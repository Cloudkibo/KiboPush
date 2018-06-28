'use strict'

const logger = require('../../components/logger')
const TAG = 'api/livechat/livechat.controller.js'
const og = require('open-graph')
const request = require('request')
const LiveChat = require('./livechat.model')
const Sessions = require('./../sessions/sessions.model')
const Subscribers = require('./../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const mongoose = require('mongoose')
let utility = require('./../broadcasts/broadcasts.utility')
const _ = require('lodash')

// Get list of Facebook Chat Messages
exports.index = function (req, res) {
  LiveChat.aggregate([
    { $match: {session_id: mongoose.Types.ObjectId(req.params.session_id)} },
    { $group: { _id: null, count: { $sum: 1 } } }
  ], (err, chatCount) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'Chat not found'})
    }

    let query = {}
    if (req.body.page === 'next') {
      query = {
        session_id: req.params.session_id,
        _id: {$lt: req.body.last_id}
      }
    } else {
      query = {
        session_id: req.params.session_id
      }
    }
    LiveChat.find(query).sort({ datetime: -1 }).limit(req.body.number)
    .exec(function (err, chat) {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      let fbchats = chat.reverse()
      for (var i = 0; i < fbchats.length; i++) {
        fbchats[i].set('lastPayload', fbchats[fbchats.length - 1].payload, {strict: false})
        fbchats[i].set('lastRepliedBy', fbchats[fbchats.length - 1].replied_by, {strict: false})
        fbchats[i].set('lastDateTime', fbchats[fbchats.length - 1].datetime, {strict: false})
      }
      return res.status(200).json({
        status: 'success',
        payload: {chat: fbchats, count: chatCount.length > 0 ? chatCount[0].count : 0}
      })
    })
  })
}

exports.search = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'session_id')) parametersMissing = true
  if (!_.has(req.body, 'text')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  LiveChat.find({session_id: req.body.session_id, $text: {$search: req.body.text}}).sort({ datetime: -1 }).exec(function (err, chats) {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    return res.status(200).json({
      status: 'success',
      payload: chats
    })
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'sender_id')) parametersMissing = true
  if (!_.has(req.body, 'recipient_id')) parametersMissing = true
  if (!_.has(req.body, 'sender_fb_id')) parametersMissing = true
  if (!_.has(req.body, 'recipient_fb_id')) parametersMissing = true
  if (!_.has(req.body, 'session_id')) parametersMissing = true
  if (!_.has(req.body, 'company_id')) parametersMissing = true
  if (!_.has(req.body, 'payload')) parametersMissing = true
  if (!_.has(req.body, 'replied_by')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
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
      status: 'unseen', // seen or unseen
      replied_by: req.body.replied_by
    })

    chatMessage.save((err, chatMessage) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Message not created'})
      }

      Sessions.findOne({_id: req.body.session_id})
        .populate('page_id')
        .exec((err, session) => {
          if (err) {
            logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
            return res.status(404)
              .json({status: 'failed', description: 'Session not found'})
          }

          Subscribers.findOne({_id: req.body.recipient_id}, (err, subscriber) => {
            if (err) {
              return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
            }

            session.last_activity_time = Date.now()
            session.save((err) => {
              if (err) {
                return logger.serverLog(TAG, `Error at saving session ${JSON.stringify(err)}`)
              }
              logger.serverLog(TAG, `Payload from the client ${JSON.stringify(req.body.payload)}`)
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
                    }
                  }
                })
              if (session.is_assigned && session.assigned_to.type === 'team') {
                require('./../../config/socketio').sendMessageToClient({
                  room_id: companyUser.companyId,
                  body: {
                    action: 'agent_replied',
                    payload: {
                      session_id: req.body.session_id,
                      user_id: req.user._id,
                      user_name: req.user.name
                    }
                  }
                })
              } else if (!session.is_assigned) {
                require('./../../config/socketio').sendMessageToClient({
                  room_id: companyUser.companyId,
                  body: {
                    action: 'agent_replied',
                    payload: {
                      session_id: req.body.session_id,
                      user_id: req.user._id,
                      user_name: req.user.name
                    }
                  }
                })
              }
            })
          })
        })
      return res.status(200).json({status: 'success', payload: chatMessage})
    })
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
