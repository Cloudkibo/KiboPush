/**
 * Created by sojharo on 16/10/2017.
 */
const Sessions = require('./sessions.model')
const LiveChat = require('./../livechat/livechat.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Subscribers = require('../subscribers/Subscribers.model')
const logger = require('../../components/logger')
const TAG = 'api/sessions/sessions.controller.js'
const _ = require('lodash')

// get list of fb sessions
exports.index = function (req, res) {
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
    Sessions.find({company_id: companyUser.companyId})
    .populate('subscriber_id page_id')
    .exec(function (err, sessions) {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      let tempSessions = []
      for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].page_id && sessions[i].page_id.connected && sessions[i].subscriber_id && sessions[i].subscriber_id.isSubscribed) {
          tempSessions.push(sessions[i])
        }
      }
      sessions = tempSessions
      if (sessions.length > 0) {
        LiveChat.aggregate([
          {$match: {status: 'unseen', format: 'facebook'}},
          {$group: {_id: '$session_id', count: {$sum: 1}}}
        ], (err2, gotUnreadCount) => {
          if (err2) {
            return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
          }

          for (let i = 0; i < gotUnreadCount.length; i++) {
            for (let j = 0; j < sessions.length; j++) {
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
      } else {
        return res.status(200).json({
          status: 'success',
          payload: sessions
        })
      }
    })
  })
}

// get fb session
exports.show = function (req, res) {
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
exports.changeStatus = function (req, res) {
  // todo tell fb users that message is read
  Sessions.update(
    {_id: req.body._id},
    {status: req.body.status}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      res.status(200).json({status: 'success', payload: updated})
    })
}
exports.markread = function (req, res) {
  // todo tell fb users that message is read
  LiveChat.update(
    {session_id: req.params.id},
    {status: 'seen'},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      res.status(200).json({status: 'success', payload: updated})
    })
}
exports.unSubscribe = function (req, res) {
  // todo tell fb users that message is read
  Subscribers.update({_id: req.params.id},
    {isSubscribed: false}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG,
          `Subscribers update subscription: ${JSON.stringify(
            err)}`)
      }
      res.status(200).json({status: 'success', payload: updated})
    })
}

exports.assignAgent = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'agentId')) parametersMissing = true
  if (!_.has(req.body, 'agentName')) parametersMissing = true
  if (!_.has(req.body, 'sessionId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  let assignedTo = {
    type: 'agent',
    id: req.body.agentId,
    name: req.body.agentName
  }

  Sessions.update(
    {_id: req.body.sessionId},
    {assigned_to: assignedTo}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      res.status(200).json({status: 'success', payload: updated})
    })
}

exports.assignTeam = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'teamId')) parametersMissing = true
  if (!_.has(req.body, 'teamName')) parametersMissing = true
  if (!_.has(req.body, 'sessionId')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  let assignedTo = {
    type: 'team',
    id: req.body.teamId,
    name: req.body.teamName
  }

  Sessions.update(
    {_id: req.body.sessionId},
    {assigned_to: assignedTo}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      res.status(200).json({status: 'success', payload: updated})
    })
}
