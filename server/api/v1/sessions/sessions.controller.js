/**
 * Created by sojharo on 16/10/2017.
 */
const Sessions = require('./sessions.model')
const LiveChat = require('./../livechat/livechat.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Subscribers = require('../subscribers/Subscribers.model')
const logger = require('../../../components/logger')
const Pages = require('../pages/Pages.model')
const TAG = 'api/sessions/sessions.controller.js'
const Users = require('./../user/Users.model')
const Notifications = require('./../notifications/notifications.model')
const needle = require('needle')
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
          {$sort: { datetime: 1 }}
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
          LiveChat.aggregate([
            {$sort: { datetime: 1 }},
            {$group: {_id: '$session_id', payload: { $last: '$payload' }, replied_by: { $last: '$replied_by' }, datetime: { $last: '$datetime' }}}
          ], (err2, gotLastMessage) => {
            if (err2) {
              return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
            }
            for (let a = 0; a < gotLastMessage.length; a++) {
              for (let b = 0; b < sessions.length; b++) {
                if (sessions[b]._id.toString() === gotLastMessage[a]._id.toString()) {
                  sessions[b].set('lastPayload',
                    gotLastMessage[a].payload,
                    {strict: false})
                  sessions[b].set('lastRepliedBy',
                    gotLastMessage[a].replied_by,
                    {strict: false})
                  sessions[b].set('lastDateTime',
                    gotLastMessage[a].datetime,
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
        return res.status(200).json({
          status: 'success',
          payload: sessions
        })
      }
    })
  })
}

exports.getNewSessions = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at find company user ${JSON.stringify(err)}`)
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
    let findCriteria = {
      company_id: companyUser.companyId,
      status: 'new'
    }
    let sortCriteria = {
      last_activity_time: -1
    }
    if (req.body.filter && req.body.filter_criteria.page_value !== '') {
      findCriteria = Object.assign(findCriteria, {page_id: req.body.filter_criteria.page_value})
    }
    if (req.body.filter) {
      sortCriteria = {
        last_activity_time: req.body.filter_criteria.sort_value
      }
    }
    if (!req.body.first_page) {
      findCriteria = Object.assign(findCriteria, {_id: {$gt: req.body.last_id}})
    }
    Sessions.find(findCriteria)
    .populate('subscriber_id page_id')
    .exec(function (err, sessionsData) {
      if (err) {
        logger.serverLog(TAG, `ERROR at find sessions count ${JSON.stringify(err)}`)
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      let tempSessionsData = []
      for (var a = 0; a < sessionsData.length; a++) {
        let fullName = ''
        if (sessionsData[a] && sessionsData[a].subscriber_id) {
          fullName = sessionsData[a].subscriber_id.firstName + ' ' + sessionsData[a].subscriber_id.lastName
        }
        if (sessionsData[a].page_id && sessionsData[a].page_id.connected && sessionsData[a].subscriber_id &&
          sessionsData[a].subscriber_id.isSubscribed && ((req.body.filter_criteria.search_value !== '' && fullName.toLowerCase().includes(req.body.filter_criteria.search_value)) || req.body.filter_criteria.search_value === '')) {
          tempSessionsData.push(sessionsData[a])
        }
      }
      sessionsData = tempSessionsData
      Sessions.find(findCriteria).sort(sortCriteria).limit(req.body.number_of_records)
      .populate('subscriber_id page_id')
      .exec(function (err, sessions) {
        if (err) {
          logger.serverLog(TAG, `ERROR at find sessions ${JSON.stringify(err)}`)
          return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
        }
        let tempSessions = []
        for (var i = 0; i < sessions.length; i++) {
          let fullName = ''
          if (sessions[i] && sessions[i].subscriber_id) {
            fullName = sessions[i].subscriber_id.firstName + ' ' + sessions[i].subscriber_id.lastName
          }
          if (sessions[i].page_id && sessions[i].page_id.connected && sessions[i].subscriber_id &&
            sessions[i].subscriber_id.isSubscribed && ((req.body.filter_criteria.search_value !== '' &&
            fullName.toLowerCase().includes(req.body.filter_criteria.search_value)) ||
            req.body.filter_criteria.search_value === '')) {
            tempSessions.push(sessions[i])
          }
        }
        sessions = tempSessions
        if (sessions.length > 0) {
          LiveChat.aggregate([
            {$match: {company_id: companyUser.companyId.toString(), status: 'unseen', format: 'facebook'}},
            {$sort: { datetime: 1 }}
          ], (err2, gotUnreadCount) => {
            if (err2) {
              logger.serverLog(TAG, `ERROR at livechat aggregate 1 ${JSON.stringify(err2)}`)
              return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
            }
            for (let i = 0; i < gotUnreadCount.length; i++) {
              for (let j = 0; j < sessions.length; j++) {
                if (sessions[j]._id.toString() === gotUnreadCount[i].session_id.toString()) {
                  sessions[j].set('unreadCount',
                    gotUnreadCount[i].count,
                    {strict: false})
                }
              }
            }
            LiveChat.aggregate([
              {$sort: { datetime: 1 }},
              {$group: {_id: '$session_id', payload: { $last: '$payload' }, replied_by: { $last: '$replied_by' }, datetime: { $last: '$datetime' }}}
            ], (err2, gotLastMessage) => {
              if (err2) {
                logger.serverLog(TAG, `ERROR at livechat aggregate 2 ${JSON.stringify(err2)}`)
                return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
              }
              for (let a = 0; a < gotLastMessage.length; a++) {
                for (let b = 0; b < sessions.length; b++) {
                  if (sessions[b]._id.toString() === gotLastMessage[a]._id.toString()) {
                    sessions[b].set('lastPayload',
                      gotLastMessage[a].payload,
                      {strict: false})
                    sessions[b].set('lastRepliedBy',
                      gotLastMessage[a].replied_by,
                      {strict: false})
                    sessions[b].set('lastDateTime',
                      gotLastMessage[a].datetime,
                      {strict: false})
                  }
                }
              }
              return res.status(200).json({
                status: 'success',
                payload: {openSessions: sessions, count: sessionsData.length}
              })
            })
          })
        } else {
          return res.status(200).json({
            status: 'success',
            payload: {openSessions: sessions, count: sessionsData.length}
          })
        }
      })
    })
  })
}

exports.getResolvedSessions = function (req, res) {
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
    let findCriteria = {
      company_id: companyUser.companyId,
      status: 'resolved'
    }
    let sortCriteria = {
      request_time: 1
    }
    if (req.body.filter && req.body.filter_criteria.page_value !== '') {
      findCriteria = Object.assign(findCriteria, {page_id: req.body.filter_criteria.page_value})
    }
    if (req.body.filter) {
      sortCriteria = {
        request_time: req.body.filter_criteria.sort_value
      }
    }
    if (!req.body.first_page) {
      findCriteria = Object.assign(findCriteria, {_id: {$gt: req.body.last_id}})
    }
    Sessions.find(findCriteria)
    .populate('subscriber_id page_id')
    .exec(function (err, sessionsData) {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      let tempSessionsData = []
      for (var a = 0; a < sessionsData.length; a++) {
        let fullName = ''
        if (sessionsData[a] && sessionsData[a].subscriber_id) {
          fullName = sessionsData[a].subscriber_id.firstName + ' ' + sessionsData[a].subscriber_id.lastName
        }
        if (sessionsData[a].page_id && sessionsData[a].page_id.connected && sessionsData[a].subscriber_id &&
          sessionsData[a].subscriber_id.isSubscribed && ((req.body.filter_criteria.search_value !== '' && fullName.toLowerCase().includes(req.body.filter_criteria.search_value)) || req.body.filter_criteria.search_value === '')) {
          tempSessionsData.push(sessionsData[a])
        }
      }
      sessionsData = tempSessionsData
      Sessions.find(findCriteria).sort(sortCriteria).limit(req.body.number_of_records)
      .populate('subscriber_id page_id')
      .exec(function (err, sessions) {
        if (err) {
          return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
        }
        let tempSessions = []
        for (var i = 0; i < sessions.length; i++) {
          let fullName = ''
          if (sessions[i] && sessions[i].subscriber_id) {
            fullName = sessions[i].subscriber_id.firstName + ' ' + sessions[i].subscriber_id.lastName
          }
          if (sessions[i].page_id && sessions[i].page_id.connected && sessions[i].subscriber_id &&
            sessions[i].subscriber_id.isSubscribed && ((req.body.filter_criteria.search_value !== '' &&
            fullName.toLowerCase().includes(req.body.filter_criteria.search_value)) ||
            req.body.filter_criteria.search_value === '')) {
            tempSessions.push(sessions[i])
          }
        }
        sessions = tempSessions
        if (sessions.length > 0) {
          LiveChat.aggregate([
            {$match: {company_id: companyUser.companyId.toString(), status: 'unseen', format: 'facebook'}},
            {$sort: { datetime: 1 }}
          ], (err2, gotUnreadCount) => {
            if (err2) {
              return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
            }
            for (let i = 0; i < gotUnreadCount.length; i++) {
              for (let j = 0; j < sessions.length; j++) {
                if (sessions[j]._id.toString() === gotUnreadCount[i].session_id.toString()) {
                  sessions[j].set('unreadCount',
                    gotUnreadCount[i].count,
                    {strict: false})
                }
              }
            }
            LiveChat.aggregate([
              {$sort: { datetime: 1 }},
              {$group: {_id: '$session_id', payload: { $last: '$payload' }, replied_by: { $last: '$replied_by' }, datetime: { $last: '$datetime' }}}
            ], (err2, gotLastMessage) => {
              if (err2) {
                return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
              }
              for (let a = 0; a < gotLastMessage.length; a++) {
                for (let b = 0; b < sessions.length; b++) {
                  if (sessions[b]._id.toString() === gotLastMessage[a]._id.toString()) {
                    sessions[b].set('lastPayload',
                      gotLastMessage[a].payload,
                      {strict: false})
                    sessions[b].set('lastRepliedBy',
                      gotLastMessage[a].replied_by,
                      {strict: false})
                    sessions[b].set('lastDateTime',
                      gotLastMessage[a].datetime,
                      {strict: false})
                  }
                }
              }
              return res.status(200).json({
                status: 'success',
                payload: {closedSessions: sessions, count: sessionsData.length}
              })
            })
          })
        } else {
          return res.status(200).json({
            status: 'success',
            payload: {closedSessions: sessions, count: sessionsData.length}
          })
        }
      })
    })
  })
}

// get fb session
exports.show = function (req, res) {
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
          LiveChat.aggregate([
            {$match: {company_id: companyUser.companyId.toString(), status: 'unseen', format: 'facebook'}},
            {$sort: { datetime: 1 }}
          ], (err2, gotUnreadCount) => {
            if (err2) {
              return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
            }
            for (let i = 0; i < gotUnreadCount.length; i++) {
              if (session._id.toString() === gotUnreadCount[i].session_id.toString()) {
                session.set('unreadCount',
                  gotUnreadCount[i].count,
                  {strict: false})
              }
            }
            LiveChat.aggregate([
              {$sort: { datetime: 1 }},
              {$group: {_id: '$session_id', payload: { $last: '$payload' }, replied_by: { $last: '$replied_by' }, datetime: { $last: '$datetime' }}}
            ], (err2, gotLastMessage) => {
              if (err2) {
                return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
              }
              for (let a = 0; a < gotLastMessage.length; a++) {
                if (session._id.toString() === gotLastMessage[a]._id.toString()) {
                  session.set('lastPayload',
                    gotLastMessage[a].payload,
                    {strict: false})
                  session.set('lastRepliedBy',
                    gotLastMessage[a].replied_by,
                    {strict: false})
                  session.set('lastDateTime',
                    gotLastMessage[a].datetime,
                    {strict: false})
                }
              }
              return res.status(200).json({
                status: 'success',
                payload: session
              })
            })
          })
        })
      } else {
        return res.status(404).json({
          status: 'failed',
          description: 'Session with given id is not found on server.'
        })
      }
    })
  })
}

// get fb session
exports.changeStatus = function (req, res) {
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
    // todo tell fb users that message is read
    Sessions.update(
      {_id: req.body._id},
      {status: req.body.status}, (err, updated) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'session_status',
            payload: {
              session_id: req.body._id,
              user_id: req.user._id,
              user_name: req.user.name,
              status: req.body.status
            }
          }
        })
        res.status(200).json({status: 'success', payload: updated})
      })
  })
}
exports.markread = function (req, res) {
  // todo tell fb users that message is read
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
    Sessions.findOne({_id: req.params.id}).populate('subscriber_id page_id').exec((err, session) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      Pages.findOne({companyId: companyUser.companyId, connected: true}, (err, userPage) => {
        if (err) {
          logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (userPage && userPage.userId) {
          Users.findOne({_id: userPage.userId}, (err, connectedUser) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            var currentUser
            if (req.user.facebookInfo) {
              currentUser = req.user
            } else {
              currentUser = connectedUser
            }
            needle.get(
            `https://graph.facebook.com/v2.10/${session.page_id.pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
            (err, resp) => {
              if (err) {
                logger.serverLog(TAG,
                `Page accesstoken from graph api Error${JSON.stringify(err)}`)
              }
              const data = {
                messaging_type: 'UPDATE',
                recipient: {id: session.subscriber_id.senderId}, // this is the subscriber id
                sender_action: 'mark_seen'
              }
              if (resp && resp.body) {
                needle.post(
                  `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                  data, (err, resp1) => {
                    if (err) {
                      logger.serverLog(TAG, err)
                      logger.serverLog(TAG,
                        `Error occured at subscriber :${JSON.stringify(
                          session.subscriber_id)}`)
                    }
                  })
              }
            })
          })
        }
      })
    })
  })
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
    // todo tell fb users that message is read
    Pages.findOne({ _id: req.body.page_id }, (err, userPage) => {
      if (err) {
        logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      Subscribers.findOne({_id: req.body.subscriber_id}, (err, subscriber) => {
        if (err) {
          logger.serverLog(TAG,
            `Subscribers update subscription: ${JSON.stringify(
              err)}`)
        }
        Subscribers.update({_id: req.body.subscriber_id},
          {isSubscribed: false, unSubscribedBy: 'agent'}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG,
                `Subscribers update subscription: ${JSON.stringify(
                  err)}`)
            }
            saveNotifications(subscriber, req.user)
              /* Getting the company user who has connected the facebook account */
            Users.findOne({_id: userPage.userId}, (err, connectedUser) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              var currentUser
              if (req.user.facebookInfo) {
                currentUser = req.user
              } else {
                currentUser = connectedUser
              }
              needle.get(
              `https://graph.facebook.com/v2.10/${userPage.pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
              (err, resp) => {
                if (err) {
                  logger.serverLog(TAG,
                    `Page access token from graph api error ${JSON.stringify(
                    err)}`)
                }
                const messageData = {
                  text: 'We have unsubscribed you from our page. We will notify you when we subscribe you again. Thanks'
                }
                const data = {
                  messaging_type: 'UPDATE',
                  recipient: {id: subscriber.senderId}, // this is the subscriber id
                  message: messageData
                }
                needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                data, (err, resp) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: JSON.stringify(err)
                    })
                  }
                  require('./../../config/socketio').sendMessageToClient({
                    room_id: companyUser.companyId,
                    body: {
                      action: 'unsubscribe',
                      payload: {
                        subscriber_id: req.body.subscriber_id,
                        user_id: req.user._id,
                        user_name: req.user.name
                      }
                    }
                  })
                  res.status(200).json({status: 'success', payload: updated})
                })
              })
            })
          })
      })
    })
  })
}

function saveNotifications (subscriber, user) {
  CompanyUsers.findOne({domain_email: user.domain_email},
    (err, companyUser) => {
      if (err) {
        logger.serverLog(TAG,
          `Internal server error ${JSON.stringify(
          err)}`)
      }
      if (!companyUser) {
        logger.serverLog(TAG,
          `The user account does not belong any company. Please contact support ${JSON.stringify(
          err)}`)
      }
      CompanyUsers.find({companyId: companyUser.companyId})
        .populate('userId')
        .exec((err, members) => {
          if (err) {
            logger.serverLog(TAG,
              `Internal server error ${JSON.stringify(
              err)}`)
          }
          members.forEach(member => {
            let notification = new Notifications({
              message: `Subscriber ${subscriber.firstName + ' ' + subscriber.lastName} has been unsubscribed by ${user.name}`,
              category: {type: 'unsubscribe', id: subscriber._id},
              agentId: member.userId._id,
              companyId: subscriber.companyId
            })
            notification.save((err, savedNotification) => {
              if (err) {
                logger.serverLog(TAG,
                  `Error at saving notification ${JSON.stringify(
                  err)}`)
              }
            })
          })
        })
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

    let assignedTo = {
      type: 'agent',
      id: req.body.agentId,
      name: req.body.agentName
    }

    Sessions.update(
      {_id: req.body.sessionId},
      {assigned_to: assignedTo, is_assigned: req.body.isAssigned}, (err, updated) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'session_assign',
            payload: {
              session_id: req.body.sessionId,
              user_id: req.user._id,
              user_name: req.user.name,
              assigned_to: assignedTo
            }
          }
        })
        res.status(200).json({status: 'success', payload: updated})
      })
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

    let assignedTo = {
      type: 'team',
      id: req.body.teamId,
      name: req.body.teamName
    }

    Sessions.update(
      {_id: req.body.sessionId},
      {assigned_to: assignedTo, is_assigned: req.body.isAssigned}, (err, updated) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'session_assign',
            payload: {
              session_id: req.body.sessionId,
              user_id: req.user._id,
              user_name: req.user.name,
              assigned_to: assignedTo
            }
          }
        })
        res.status(200).json({status: 'success', payload: updated})
      })
  })
}
