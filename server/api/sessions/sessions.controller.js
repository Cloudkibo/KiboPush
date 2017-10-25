/**
 * Created by sojharo on 16/10/2017.
 */
let _ = require('lodash')
const Sessions = require('./sessions.model')
const LiveChat = require('./../livechat/livechat.model')
const logger = require('../../components/logger')
const TAG = 'api/sessions/sessions.controller.js'

// get list of fb sessions
exports.index = function (req, res) {
  logger.serverLog(TAG,
    `Inside get sessions, req body = ${JSON.stringify(req.body)}`)
  Sessions.find({company_id: req.body.company_id})
    .populate('subscriber_id page_id')
    .exec(function (err, sessions) {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (sessions.length > 0) {
        LiveChat.find({session_id: sessions[0]._id}, (err, chats) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
          }
          sessions[0] = _.merge(sessions[0], { chats })
          return res.status(200).json({
            status: 'success',
            payload: sessions
          })
        })
      } else {
        return res.status(201).json({
          status: 'success',
          payload: sessions
        })
      }
    })
}

// get fb session
exports.show = function (req, res) {
  logger.serverLog(TAG,
    `Inside show session, req body = ${JSON.stringify(req.params)}`)
  Sessions.findOne({_id: req.params.id})
  .populate('subscriber_id page_id')
  .exec(function (err, session) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (session) {
      LiveChat.find({session_id: session._id}, (err, chats) => {
        if (err) {
          return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
        }
        session = _.merge(session, { chats })
        return res.status(200).json({
          status: 'success',
          payload: session
        })
      })
    } else {
      return res.status(404).json({
        status: 'failed',
        description: 'Session with given id is not found on server.'
      })
    }
  })
}

// get fb session
exports.markread = function (req, res) {
  logger.serverLog(TAG,
    `Inside mark read, req body = ${JSON.stringify(req.params)}`)
  LiveChat.update(
    {session_id: req.params.id},
    {status: 'seen'},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG,
        `The session read status marked read ${JSON.stringify(
          updated)}`)
      res.status(200).json({status: 'success', payload: updated})
    })
}
