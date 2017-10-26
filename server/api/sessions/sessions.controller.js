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

          sessions[0].set('chats', JSON.parse(JSON.stringify(chats)),
            {strict: false})

          LiveChat.aggregate([
            {$match: {status: 'unseen'}},
            {$group: {_id: '$session_id', count: {$sum: 1}}}
          ], (err2, gotUnreadCount) => {
            if (err2) {
              return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
            }

            for (let i = 0; i < gotUnreadCount.length; i++) {
              for (let j = 0; j < sessions.length; j++) {
                logger.serverLog(TAG, 'sessions id and count id being matched')
                if (sessions[j]._id.toString() === gotUnreadCount[i]._id.toString()) {
                  sessions[j].set('unreadCount',
                    gotUnreadCount[i].count,
                    {strict: false})
                }
              }
            }

            return res.status(200).json({
              status: 'success',
              payload: sessions
            })
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
          // todo limit this
          session.set('chats', JSON.parse(JSON.stringify(chats)),
            {strict: false})
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
  // todo tell fb users that message is read
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
