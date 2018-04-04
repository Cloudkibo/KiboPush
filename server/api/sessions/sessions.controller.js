/**
 * Created by sojharo on 16/10/2017.
 */
const Sessions = require('./sessions.model')
const LiveChat = require('./../livechat/livechat.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Subscribers = require('../subscribers/Subscribers.model')
const logger = require('../../components/logger')
const Pages = require('../pages/Pages.model')
const TeamAgents = require('../teams/team_agents.model')
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

exports.getAll = function (req, res) {
  // get company info
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
    // get user info
    Users.findOne({_id: req.body.userId}, (err, user) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }

      // if individual account get all sessions
      if (user.currentPlan === 'plan_A' || user.currentPlan === 'plan_B') {
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
      } else {
        // if team account and role is buyer or admin, get all sessions
        if (user.role === 'buyer' || user.role === 'admin') {
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
        } else {
          // if team account and role is agent
          // get all unassigned sessions
          Sessions.find({company_id: companyUser.companyId, is_assigned: false})
          .populate('subscriber_id page_id')
          .exec(function (err, unassignedSessions) {
            if (err) {
              return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
            }
            let tempSessions = []
            for (var i = 0; i < unassignedSessions.length; i++) {
              if (unassignedSessions[i].page_id && unassignedSessions[i].page_id.connected && unassignedSessions[i].subscriber_id && unassignedSessions[i].subscriber_id.isSubscribed) {
                tempSessions.push(unassignedSessions[i])
              }
            }
            unassignedSessions = tempSessions
            if (unassignedSessions.length > 0) {
              LiveChat.aggregate([
                {$match: {status: 'unseen', format: 'facebook'}},
                {$group: {_id: '$session_id', count: {$sum: 1}}}
              ], (err2, gotUnreadCount) => {
                if (err2) {
                  return res.status(500)
                  .json({status: 'failed', description: 'Internal Server Error'})
                }

                for (let i = 0; i < gotUnreadCount.length; i++) {
                  for (let j = 0; j < unassignedSessions.length; j++) {
                    if (unassignedSessions[j]._id.toString() === gotUnreadCount[i]._id.toString()) {
                      unassignedSessions[j].set('unreadCount',
                        gotUnreadCount[i].count,
                        {strict: false})
                    }
                  }
                }
              })
            }

            // get sessions assigned to this agent
            Sessions.find({company_id: companyUser.companyId, is_assigned: true, assigned_to: {type: 'agent'}})
            .populate('subscriber_id page_id')
            .exec(function (err, assignToAgentSessions) {
              if (err) {
                return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
              }
              let tempSessions = []
              for (var i = 0; i < assignToAgentSessions.length; i++) {
                if (assignToAgentSessions[i].page_id && assignToAgentSessions[i].page_id.connected && assignToAgentSessions[i].subscriber_id && assignToAgentSessions[i].subscriber_id.isSubscribed) {
                  tempSessions.push(assignToAgentSessions[i])
                }
              }
              assignToAgentSessions = tempSessions
              if (assignToAgentSessions.length > 0) {
                LiveChat.aggregate([
                  {$match: {status: 'unseen', format: 'facebook'}},
                  {$group: {_id: '$session_id', count: {$sum: 1}}}
                ], (err2, gotUnreadCount) => {
                  if (err2) {
                    return res.status(500)
                    .json({status: 'failed', description: 'Internal Server Error'})
                  }

                  for (let i = 0; i < gotUnreadCount.length; i++) {
                    for (let j = 0; j < assignToAgentSessions.length; j++) {
                      if (assignToAgentSessions[j]._id.toString() === gotUnreadCount[i]._id.toString()) {
                        assignToAgentSessions[j].set('unreadCount',
                          gotUnreadCount[i].count,
                          {strict: false})
                      }
                    }
                  }
                })
              }

              // get all sessions assigned to team
              TeamAgents.find({agentId: user._id}, {_id: 0, companyId: 0, agentId: 0, join_date: 0, teamId: 1}, (err, teams) => {
                if (err) {
                  return res.status(500)
                  .json({status: 'failed', description: 'Internal Server Error'})
                }
                Sessions.find({company_id: companyUser.companyId, is_assigned: true, assigned_to: {type: 'team', id: {$in: teams}}})
                .populate('subscriber_id page_id')
                .exec(function (err, assignToTeamSessions) {
                  if (err) {
                    return res.status(500)
                    .json({status: 'failed', description: 'Internal Server Error'})
                  }
                  let tempSessions = []
                  for (var i = 0; i < assignToTeamSessions.length; i++) {
                    if (assignToTeamSessions[i].page_id && assignToTeamSessions[i].page_id.connected && assignToTeamSessions[i].subscriber_id && assignToTeamSessions[i].subscriber_id.isSubscribed) {
                      tempSessions.push(assignToTeamSessions[i])
                    }
                  }
                  assignToTeamSessions = tempSessions
                  if (assignToTeamSessions.length > 0) {
                    LiveChat.aggregate([
                      {$match: {status: 'unseen', format: 'facebook'}},
                      {$group: {_id: '$session_id', count: {$sum: 1}}}
                    ], (err2, gotUnreadCount) => {
                      if (err2) {
                        return res.status(500)
                        .json({status: 'failed', description: 'Internal Server Error'})
                      }

                      for (let i = 0; i < gotUnreadCount.length; i++) {
                        for (let j = 0; j < assignToTeamSessions.length; j++) {
                          if (assignToTeamSessions[j]._id.toString() === gotUnreadCount[i]._id.toString()) {
                            assignToTeamSessions[j].set('unreadCount',
                              gotUnreadCount[i].count,
                              {strict: false})
                          }
                        }
                      }

                      let allSessions = unassignedSessions.concat(assignToAgentSessions, assignToTeamSessions)

                      return res.status(200).json({
                        status: 'success',
                        payload: allSessions
                      })
                    })
                  } else {
                    let allSessions = unassignedSessions.concat(assignToAgentSessions, assignToTeamSessions)
                    return res.status(200).json({
                      status: 'success',
                      payload: allSessions
                    })
                  }
                })
              })
            })
          })
        }
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
      {assigned_to: assignedTo, is_assigned: true}, (err, updated) => {
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
      {assigned_to: assignedTo, is_assigned: true}, (err, updated) => {
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
