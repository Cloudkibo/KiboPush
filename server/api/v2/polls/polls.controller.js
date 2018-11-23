const logger = require('../../../components/logger')
const PollResponseDataLayer = require('./pollresponse.datalayer')
const PollDataLayer = require('./polls.datalayer')
const PollLogicLayer = require('./polls.logiclayer')
const PollPageDataLayer = require('../page_poll/page_poll.datalayer')
const AutomationQueueDataLayer = require('../automationQueue/automationQueue.datalayer')
const needle = require('needle')
const broadcastUtility = require('../broadcasts/broadcasts.utility')
const TAG = 'api/v1/polls/polls.controller.js'
const utility = require('../utility')
const compUtility = require('../../../components/utility')
const notificationsUtility = require('../notifications/notifications.utility')

exports.index = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', { domain_email: req.user.domain_email }, req.headers.authorization)
    .then(companyUser => {
      PollDataLayer.genericFindForPolls({companyId: companyUser.companyId})
        .then(polls => {
          PollPageDataLayer.genericFind({companyId: companyUser.companyId})
            .then(pollpages => {
              PollResponseDataLayer.aggregateForPollResponse([{$group: {
                _id: {pollId: '$pollId'},
                count: {$sum: 1}}}])
                .then(responsesCount1 => {
                  let responsesCount = PollLogicLayer.prepareResponsesPayload(polls, responsesCount1)
                  res.status(200).json({
                    status: 'success',
                    payload: {polls, pollpages, responsesCount}
                  })
                })
                .catch(error => {
                  return res.status(500).json({status: 'failed', payload: `Failed to aggregate poll responses ${JSON.stringify(error)}`})
                })
            })
            .catch(error => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch poll pages ${JSON.stringify(error)}`})
            })
        })
        .catch(error => {
          return res.status(500).json({status: 'failed', payload: `Failed to fetch polls ${JSON.stringify(error)}`})
        })
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(error)}`})
    })
}
exports.allPolls = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', { domain_email: req.user.domain_email }, req.headers.authorization)
    .then(companyUser => {
      let criterias = PollLogicLayer.getCriterias(req.body, companyUser)
      PollDataLayer.aggregateForPolls(criterias.countCriteria)
        .then(pollsCount => {
          PollDataLayer.aggregateForPolls(criterias.fetchCriteria)
            .then(polls => {
              PollPageDataLayer.genericFind({companyId: companyUser.companyId})
                .then(pollpages => {
                  PollResponseDataLayer.aggregateForPollResponse([{$group: {
                    _id: {pollId: '$pollId'},
                    count: {$sum: 1}
                  }}])
                    .then(responsesCount1 => {
                      let responsesCount = PollLogicLayer.prepareResponsesPayload(polls, responsesCount1)
                      res.status(200).json({
                        status: 'success',
                        payload: {polls: req.body.first_page === 'previous' ? polls.reverse() : polls, pollpages: pollpages, responsesCount: responsesCount, count: polls.length > 0 ? pollsCount[0].count : 0}
                      })
                    })
                    .catch(error => {
                      return res.status(500).json({status: 'failed', payload: `Failed to aggregate poll responses ${JSON.stringify(error)}`})
                    })
                })
                .catch(error => {
                  return res.status(500).json({status: 'failed', payload: `Failed to fetch poll pages ${JSON.stringify(error)}`})
                })
            })
            .catch(error => {
              return res.status(500).json({status: 'failed', payload: `Failed to fetch polls ${JSON.stringify(error)}`})
            })
        })
        .catch(error => {
          return res.status(500).json({status: 'failed', payload: `Failed to fetch pollsCount ${JSON.stringify(error)}`})
        })
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(error)}`})
    })
}
exports.create = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', { domain_email: req.user.domain_email }, req.headers.authorization)
    .then(companyUser => {
      utility.callApi(`companyprofile/query`, 'post', {ownerId: req.user._id}, req.headers.authorization)
        .then(companyProfile => {
          utility.callApi(`featureUsage/planQuery`, 'post', {planId: companyProfile.planId}, req.headers.authorization)
            .then(planUsage => {
              planUsage = planUsage[0]
              utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyProfile._id}, req.headers.authorization)
                .then(companyUsage => {
                  companyUsage = companyUsage[0]
                  if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Your polls limit has reached. Please upgrade your plan to premium in order to create more polls`
                    })
                  }
                  let pollPayload = PollLogicLayer.preparePollsPayload(req.user, companyUser, req.body)
                  let pagesFindCriteria = PollLogicLayer.pagesFindCriteria(companyUser, req.body)
                  utility.callApi(`pages/query`, 'post', pagesFindCriteria, req.headers.authorization)
                    .then(pages => {
                      pages.forEach((page) => {
                        utility.callApi(`webhooks/query`, 'post', {pageId: page.pageId}, req.headers.authorization)
                          .then(webhook => {
                            webhook = webhook[0]
                            if (webhook && webhook.isEnabled) {
                              needle.get(webhook.webhook_url, (err, r) => {
                                if (err) {
                                  return res.status(500).json({
                                    status: 'failed',
                                    description: `Internal Server Error ${JSON.stringify(err)}`
                                  })
                                } else if (r.statusCode === 200) {
                                  if (webhook && webhook.optIn.POLL_CREATED) {
                                    var data = {
                                      subscription_type: 'POLL_CREATED',
                                      payload: JSON.stringify({userId: req.user._id, companyId: companyUser.companyId, statement: req.body.statement, options: req.body.options})
                                    }
                                    needle.post(webhook.webhook_url, data,
                                      (error, response) => {
                                        if (error) {
                                        }
                                      })
                                  }
                                } else {
                                  notificationsUtility.saveNotification(webhook)
                                }
                              })
                            }
                          })
                          .catch(error => {
                            return res.status(500).json({
                              status: 'failed',
                              payload: `Failed to fetch webhooks ${JSON.stringify(error)}`
                            })
                          })
                      })
                    })
                    .catch(error => {
                      return res.status(500).json({
                        status: 'failed',
                        payload: `Failed to fetch pages ${JSON.stringify(error)}`
                      })
                    })
                  PollDataLayer.createForPoll(pollPayload)
                    .then(pollCreated => {
                      require('./../../../config/socketio').sendMessageToClient({
                        room_id: companyUser.companyId,
                        body: {
                          action: 'poll_created',
                          payload: {
                            poll_id: pollCreated._id,
                            user_id: req.user._id,
                            user_name: req.user.name,
                            company_id: companyUser.companyId
                          }
                        }
                      })
                      res.status(201).json({status: 'success', payload: pollCreated})
                    })
                    .catch(error => {
                      return res.status(500).json({
                        status: 'failed',
                        payload: `Failed to create poll ${JSON.stringify(error)}`
                      })
                    })
                })
                .catch(error => {
                  return res.status(500).json({
                    status: 'failed',
                    payload: `Failed to fetch company usage ${JSON.stringify(error)}`
                  })
                })
            })
            .catch(error => {
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to plan usage ${JSON.stringify(error)}`
              })
            })
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to company profile ${JSON.stringify(error)}`
          })
        })
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(error)}`})
    })
}
exports.send = function (req, res) {
  let abort = false
  utility.callApi(`companyUser/query`, 'post', { domain_email: req.user.domain_email }, req.headers.authorization)
    .then(companyUser => {
      utility.callApi(`companyprofile/query`, 'post', {ownerId: req.user._id}, req.headers.authorization)
        .then(companyProfile => {
          utility.callApi(`featureUsage/planQuery`, 'post', {planId: companyProfile.planId}, req.headers.authorization)
            .then(planUsage => {
              planUsage = planUsage[0]
              utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyProfile._id}, req.headers.authorization)
                .then(companyUsage => {
                  companyUsage = companyUsage[0]
                  if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Your polls limit has reached. Please upgrade your plan to premium in order to send more polls`
                    })
                  }
                  utility.callApi(`pages/query`, 'post', {companyId: companyUser.companyId, connected: true}, req.headers.authorization)
                    .then(userPage => {
                      userPage = userPage[0]
                      utility.callApi(`user/${userPage.userId}`, req.headers.authorization)
                        .then(connectedUser => {
                          var currentUser
                          if (req.user.facebookInfo) {
                            currentUser = req.user
                          } else {
                            currentUser = connectedUser
                          }
                          const messageData = PollLogicLayer.prepareMessageData(req.body, req.body._id)
                          let pagesFindCriteria = PollLogicLayer.pagesFindCriteria(companyUser, req.body)
                          utility.callApi(`pages/query`, 'post', pagesFindCriteria, req.headers.authorization)
                            .then(pages => {
                              for (let z = 0; z < pages.length && !abort; z++) {
                                if (req.body.isList === true) {
                                  let ListFindCriteria = PollLogicLayer.ListFindCriteria(req.body)
                                  utility.callApi(`lists/query`, 'post', ListFindCriteria, req.headers.authorization)
                                    .then(lists => {
                                      let subsFindCriteria = PollLogicLayer.subsFindCriteria(pages[z], lists)
                                      utility.callApi(`subscribers/query`, 'post', subsFindCriteria, req.headers.authorization)
                                        .then(subscribers => {
                                          needle.get(
                                            `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`, (err, resp) => {
                                              if (err) {
                                                logger.serverLog(TAG, `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                                              }
                                              broadcastUtility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                                subscribers = taggedSubscribers
                                                for (let j = 0; j < subscribers.length && !abort; j++) {
                                                  utility.callApi(`featureUsage/updateCompany`, 'put', {
                                                    query: {companyId: companyUser.companyId},
                                                    newPayload: { $inc: { polls: 1 } },
                                                    options: {}
                                                  }, req.headers.authorization)
                                                    .then(updated => {
                                                      utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyUser.companyId}, req.headers.authorization)
                                                        .then(companyUsage => {
                                                          companyUsage = companyUsage[0]
                                                          if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                                                            abort = true
                                                          }
                                                          const data = {
                                                            messaging_type: 'UPDATE',
                                                            recipient: JSON.stringify({id: subscribers[j].senderId}), // this is the subscriber id
                                                            message: JSON.stringify(messageData),
                                                            tag: req.body.fbMessageTag
                                                          }
                                                          // this calls the needle when the last message was older than 30 minutes
                                                          // checks the age of function using callback
                                                          compUtility.checkLastMessageAge(subscribers[j].senderId, req, (err, isLastMessage) => {
                                                            if (err) {
                                                              logger.serverLog(TAG, 'inside error')
                                                              return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                                            }
                                                            if (isLastMessage) {
                                                              logger.serverLog(TAG, 'inside poll send' + JSON.stringify(data))
                                                              needle.post(
                                                                `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`, data, (err, resp) => {
                                                                  if (err) {
                                                                    logger.serverLog(TAG, err)
                                                                    logger.serverLog(TAG, `Error occured at subscriber :${JSON.stringify(subscribers[j])}`)
                                                                  }
                                                                  let pollBroadcast = PollLogicLayer.preparePollPagePayload(pages[z], req.user, companyUser, req.body, subscribers[j], req.body._id)
                                                                  PollPageDataLayer.createForPollPage(pollBroadcast)
                                                                    .then(pollCreated => {
                                                                      require('./../../../config/socketio').sendMessageToClient({
                                                                        room_id: companyUser.companyId,
                                                                        body: {
                                                                          action: 'poll_send',
                                                                          poll_id: pollCreated._id,
                                                                          user_id: req.user._id,
                                                                          user_name: req.user.name,
                                                                          company_id: companyUser.companyId
                                                                        }
                                                                      })
                                                                    })
                                                                    .catch(error => {
                                                                      return res.status(500).json({status: 'failed', payload: `Failed to create poll page ${JSON.stringify(error)}`})
                                                                    })
                                                                })
                                                            } else {
                                                              logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                                              let timeNow = new Date()
                                                              AutomationQueueDataLayer.createAutomationQueueObject({
                                                                automatedMessageId: req.body._id,
                                                                subscriberId: subscribers[j]._id,
                                                                companyId: companyUser.companyId,
                                                                type: 'poll',
                                                                scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                                              }).then(saved => {})
                                                                .catch(error => {
                                                                  return res.status(500).json({status: 'failed', payload: `Failed to create automation queue object ${JSON.stringify(error)}`})
                                                                })
                                                            }
                                                          })
                                                        })
                                                        .catch(error => {
                                                          return res.status(500).json({status: 'failed', payload: `Failed to fetch company usage ${JSON.stringify(error)}`})
                                                        })
                                                    })
                                                    .catch(error => {
                                                      return res.status(500).json({status: 'failed', payload: `Failed to update company usage ${JSON.stringify(error)}`})
                                                    })
                                                }
                                              })
                                            })
                                        })
                                        .catch(error => {
                                          return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${JSON.stringify(error)}`})
                                        })
                                    })
                                    .catch(error => {
                                      return res.status(500).json({status: 'failed', payload: `Failed to fetch lists ${JSON.stringify(error)}`})
                                    })
                                } else {
                                  let subscriberFindCriteria = PollLogicLayer.subscriberFindCriteria(pages[z], req.body)
                                  utility.callApi(`subscribers/query`, 'post', subscriberFindCriteria, req.headers.authorization)
                                    .then(subscribers => {
                                      needle.get(
                                        `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                                        (err, resp) => {
                                          if (err) {
                                            logger.serverLog(TAG,
                                              `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                                          }
                                          if (subscribers.length > 0) {
                                            broadcastUtility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                              subscribers = taggedSubscribers
                                              broadcastUtility.applyPollFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                                                subscribers = repliedSubscribers
                                                for (let j = 0; j < subscribers.length && !abort; j++) {
                                                  utility.callApi(`featureUsage/updateCompany`, 'put', {
                                                    query: {companyId: companyUser.companyId},
                                                    newPayload: { $inc: { polls: 1 } },
                                                    options: {}
                                                  }, req.headers.authorization).then(updated => {
                                                    utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyUser.companyId}, req.headers.authorization)
                                                      .then(companyUsage => {
                                                        companyUsage = companyUsage[0]
                                                        if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                                                          abort = true
                                                        }
                                                        const data = {
                                                          messaging_type: 'UPDATE',
                                                          recipient: JSON.stringify({id: subscribers[j].senderId}), // this is the subscriber id
                                                          message: JSON.stringify(messageData),
                                                          tag: req.body.fbMessageTag
                                                        }
                                                        // this calls the needle when the last message was older than 30 minutes
                                                        // checks the age of function using callback
                                                        compUtility.checkLastMessageAge(subscribers[j].senderId, req, (err, isLastMessage) => {
                                                          if (err) {
                                                            logger.serverLog(TAG, 'inside error')
                                                            return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                                          }
                                                          if (isLastMessage) {
                                                            logger.serverLog(TAG, 'inside poll send' + JSON.stringify(data))
                                                            needle.post(
                                                              `https://graph.facebook.com/v2.10/me/messages?access_token=${resp.body.access_token}`,
                                                              data, (err, resp) => {
                                                                if (err) {
                                                                  logger.serverLog(TAG, err)
                                                                  logger.serverLog(TAG,
                                                                    `Error occured at subscriber :${JSON.stringify(
                                                                      subscribers[j])}`)
                                                                }
                                                                let pollBroadcast = PollLogicLayer.preparePollPagePayload(pages[z], req.user, companyUser, req.body, subscribers[j], req.body._id)
                                                                PollPageDataLayer.createForPollPage(pollBroadcast)
                                                                  .then(pollCreated => {
                                                                    require('./../../../config/socketio').sendMessageToClient({
                                                                      room_id: companyUser.companyId,
                                                                      body: {
                                                                        action: 'poll_send',
                                                                        poll_id: pollCreated._id,
                                                                        user_id: req.user._id,
                                                                        user_name: req.user.name,
                                                                        company_id: companyUser.companyId
                                                                      }
                                                                    })
                                                                  })
                                                                  .catch(error => {
                                                                    return res.status(500).json({status: 'failed', payload: `Failed to create poll page ${JSON.stringify(error)}`})
                                                                  })
                                                              })
                                                          } else {
                                                            logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                                            let timeNow = new Date()
                                                            AutomationQueueDataLayer.createAutomationQueueObject({
                                                              automatedMessageId: req.body._id,
                                                              subscriberId: subscribers[j]._id,
                                                              companyId: companyUser.companyId,
                                                              type: 'poll',
                                                              scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                                            }).then(saved => {})
                                                              .catch(error => {
                                                                return res.status(500).json({status: 'failed', payload: `Failed to create automation queue object ${JSON.stringify(error)}`})
                                                              })
                                                          }
                                                        })
                                                      })
                                                      .catch(error => {
                                                        return res.status(500).json({status: 'failed', payload: `Failed to fetch company usage ${JSON.stringify(error)}`})
                                                      })
                                                  })
                                                    .catch(error => {
                                                      return res.status(500).json({status: 'failed', payload: `Failed to update company usage ${JSON.stringify(error)}`})
                                                    })
                                                }
                                              })
                                            })
                                          }
                                        })
                                    })
                                    .catch(error => {
                                      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${JSON.stringify(error)}`})
                                    })
                                }
                              }
                              return res.status(200).json({status: 'success', payload: 'Polls sent successfully.'})
                            })
                            .catch(error => {
                              return res.status(500).json({status: 'failed', payload: `Failed to fetch pages ${JSON.stringify(error)}`})
                            })
                        })
                        .catch(error => {
                          return res.status(500).json({status: 'failed', payload: `Failed to fetch user ${JSON.stringify(error)}`})
                        })
                    })
                    .catch(error => {
                      return res.status(500).json({status: 'failed', payload: `Failed to fetch page ${JSON.stringify(error)}`})
                    })
                })
                .catch(error => {
                  return res.status(500).json({status: 'failed', payload: `Failed to fetch company usage ${JSON.stringify(error)}`})
                })
            })
            .catch(error => {
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to plan usage ${JSON.stringify(error)}`
              })
            })
        })
        .catch(error => {
          return res.status(500).json({status: 'failed', payload: `Failed to company profile ${JSON.stringify(error)}`})
        })
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(error)}`})
    })
}
exports.sendPoll = function (req, res) {
  let abort = false
  utility.callApi(`companyUser/query`, 'post', { domain_email: req.user.domain_email }, req.headers.authorization)
    .then(companyUser => {
      utility.callApi(`companyprofile/query`, 'post', {ownerId: req.user._id}, req.headers.authorization)
        .then(companyProfile => {
          utility.callApi(`featureUsage/planQuery`, 'post', {planId: companyProfile.planId}, req.headers.authorization)
            .then(planUsage => {
              planUsage = planUsage[0]
              utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyProfile._id}, req.headers.authorization)
                .then(companyUsage => {
                  companyUsage = companyUsage[0]
                  if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Your polls limit has reached. Please upgrade your plan to premium in order to send more polls`
                    })
                  }
                  let pollPayload = PollLogicLayer.preparePollsPayload(req.user, companyUser, req.body)
                  PollDataLayer.createForPoll(pollPayload)
                    .then(pollCreated => {
                      require('./../../../config/socketio').sendMessageToClient({
                        room_id: companyUser.companyId,
                        body: {
                          action: 'poll_created',
                          payload: {
                            poll_id: pollCreated._id,
                            user_id: req.user._id,
                            user_name: req.user.name,
                            company_id: companyUser.companyId
                          }
                        }
                      })
                      utility.callApi(`pages/query`, 'post', {companyId: companyUser.companyId, connected: true}, req.headers.authorization)
                        .then(userPage => {
                          userPage = userPage[0]
                          utility.callApi(`user/${userPage.userId}`, 'get', {}, req.headers.authorization)
                            .then(connectedUser => {
                              var currentUser
                              if (req.user.facebookInfo) {
                                currentUser = req.user
                              } else {
                                currentUser = connectedUser
                              }
                              const messageData = PollLogicLayer.prepareMessageData(req.body, pollCreated._id)
                              let pagesFindCriteria = PollLogicLayer.pagesFindCriteria(companyUser, req.body)
                              utility.callApi(`pages/query`, 'post', pagesFindCriteria, req.headers.authorization)
                                .then(pages => {
                                  for (let z = 0; z < pages.length && !abort; z++) {
                                    utility.callApi(`webhooks/query`, 'post', {pageId: pages[z].pageId}, req.headers.authorization)
                                      .then(webhook => {
                                        webhook = webhook[0]
                                        if (webhook && webhook.isEnabled) {
                                          needle.get(webhook.webhook_url, (err, r) => {
                                            if (err) {
                                              return res.status(500).json({
                                                status: 'failed',
                                                description: `Internal Server Error ${JSON.stringify(err)}`
                                              })
                                            } else if (r.statusCode === 200) {
                                              if (webhook && webhook.optIn.POLL_CREATED) {
                                                var data = {
                                                  subscription_type: 'POLL_CREATED',
                                                  payload: JSON.stringify({userId: req.user._id, companyId: companyUser.companyId, statement: req.body.statement, options: req.body.options})
                                                }
                                                needle.post(webhook.webhook_url, data,
                                                  (error, response) => {
                                                    if (error) {
                                                    }
                                                  })
                                              }
                                            } else {
                                              notificationsUtility.saveNotification(webhook)
                                            }
                                          })
                                        }
                                      })
                                    if (req.body.isList === true) {
                                      let ListFindCriteria = PollLogicLayer.ListFindCriteria(req.body)
                                      utility.callApi(`pages/query`, 'post', ListFindCriteria, req.headers.authorization)
                                        .then(lists => {
                                          let subsFindCriteria = PollLogicLayer.subsFindCriteria(pages[z], lists)
                                          utility.callApi(`subscribers/query`, 'post', subsFindCriteria, req.headers.authorization)
                                            .then(subscribers => {
                                              needle.get(
                                                `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`, (err, resp) => {
                                                  if (err) {
                                                    logger.serverLog(TAG, `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                                                  }
                                                  broadcastUtility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                                    subscribers = taggedSubscribers
                                                    for (let j = 0; j < subscribers.length && !abort; j++) {
                                                      utility.callApi(`featureUsage/updateCompany`, 'put', {
                                                        query: {companyId: companyUser.companyId},
                                                        newPayload: { $inc: { polls: 1 } },
                                                        options: {}
                                                      }, req.headers.authorization)
                                                        .then(updated => {
                                                          utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyUser.companyId}, req.headers.authorization)
                                                            .then(companyUsage => {
                                                              companyUsage = companyUsage[0]
                                                              if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                                                                abort = true
                                                              }
                                                              const data = {
                                                                messaging_type: 'UPDATE',
                                                                recipient: JSON.stringify({id: subscribers[j].senderId}), // this is the subscriber id
                                                                message: JSON.stringify(messageData)
                                                                //  tag: req.body.fbMessageTag
                                                              }
                                                              // this calls the needle when the last message was older than 30 minutes
                                                              // checks the age of function using callback
                                                              compUtility.checkLastMessageAge(subscribers[j].senderId, req, (err, isLastMessage) => {
                                                                if (err) {
                                                                  logger.serverLog(TAG, 'inside error')
                                                                  return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                                                }
                                                                if (isLastMessage) {
                                                                  logger.serverLog(TAG, 'inside poll send' + JSON.stringify(data))
                                                                  needle.post(
                                                                    `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`, data, (err, resp) => {
                                                                      if (err) {
                                                                        logger.serverLog(TAG, err)
                                                                        logger.serverLog(TAG, `Error occured at subscriber :${JSON.stringify(subscribers[j])}`)
                                                                      }
                                                                      let pollBroadcast = PollLogicLayer.preparePollPagePayload(pages[z], req.user, companyUser, req.body, subscribers[j], pollCreated._id)
                                                                      PollPageDataLayer.createForPollPage(pollBroadcast)
                                                                        .then(pollCreated => {
                                                                          require('./../../../config/socketio').sendMessageToClient({
                                                                            room_id: companyUser.companyId,
                                                                            body: {
                                                                              action: 'poll_send',
                                                                              poll_id: pollCreated._id,
                                                                              user_id: req.user._id,
                                                                              user_name: req.user.name,
                                                                              company_id: companyUser.companyId
                                                                            }
                                                                          })
                                                                        })
                                                                        .catch(error => {
                                                                          return res.status(500).json({status: 'failed', payload: `Failed to create poll page ${JSON.stringify(error)}`})
                                                                        })
                                                                    })
                                                                } else {
                                                                  logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                                                  let timeNow = new Date()
                                                                  AutomationQueueDataLayer.createAutomationQueueObject({
                                                                    automatedMessageId: pollCreated._id,
                                                                    subscriberId: subscribers[j]._id,
                                                                    companyId: companyUser.companyId,
                                                                    type: 'poll',
                                                                    scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                                                  }).then(saved => {})
                                                                    .catch(error => {
                                                                      return res.status(500).json({status: 'failed', payload: `Failed to create automation queue object ${JSON.stringify(error)}`})
                                                                    })
                                                                }
                                                              })
                                                            })
                                                            .catch(error => {
                                                              return res.status(500).json({status: 'failed', payload: `Failed to fetch company usage ${JSON.stringify(error)}`})
                                                            })
                                                        })
                                                        .catch(error => {
                                                          return res.status(500).json({status: 'failed', payload: `Failed to update company usage ${JSON.stringify(error)}`})
                                                        })
                                                    }
                                                  })
                                                })
                                            })
                                            .catch(error => {
                                              return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${JSON.stringify(error)}`})
                                            })
                                        })
                                        .catch(error => {
                                          return res.status(500).json({status: 'failed', payload: `Failed to fetch lists ${JSON.stringify(error)}`})
                                        })
                                    } else {
                                      let subscriberFindCriteria = PollLogicLayer.subscriberFindCriteria(pages[z], req.body)
                                      utility.callApi(`subscribers/query`, 'post', subscriberFindCriteria, req.headers.authorization)
                                        .then(subscribers => {
                                          needle.get(
                                            `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                                            (err, resp) => {
                                              if (err) {
                                                logger.serverLog(TAG,
                                                  `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                                              }
                                              if (subscribers.length > 0) {
                                                broadcastUtility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                                  subscribers = taggedSubscribers
                                                  broadcastUtility.applyPollFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                                                    subscribers = repliedSubscribers
                                                    for (let j = 0; j < subscribers.length && !abort; j++) {
                                                      utility.callApi(`featureUsage/updateCompany`, 'put', {
                                                        query: {companyId: companyUser.companyId},
                                                        newPayload: { $inc: { polls: 1 } },
                                                        options: {}
                                                      }, req.headers.authorization).then(updated => {
                                                        utility.callApi(`featureUsage/companyQuery`, 'post', {companyId: companyUser.companyId}, req.headers.authorization)
                                                          .then(companyUsage => {
                                                            companyUsage = companyUsage[0]
                                                            if (planUsage.polls !== -1 && companyUsage.polls >= planUsage.polls) {
                                                              abort = true
                                                            }
                                                            const data = {
                                                              messaging_type: 'UPDATE',
                                                              recipient: JSON.stringify({id: subscribers[j].senderId}), // this is the subscriber id
                                                              message: JSON.stringify(messageData)
                                                              // tag: req.body.fbMessageTag
                                                            }
                                                            // this calls the needle when the last message was older than 30 minutes
                                                            // checks the age of function using callback
                                                            compUtility.checkLastMessageAge(subscribers[j].senderId, req, (err, isLastMessage) => {
                                                              if (err) {
                                                                logger.serverLog(TAG, 'inside error')
                                                                return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                                              }
                                                              if (isLastMessage) {
                                                                logger.serverLog(TAG, 'inside poll send' + JSON.stringify(data))
                                                                needle.post(
                                                                  `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                                                  data, (err, resp) => {
                                                                    if (err) {
                                                                      logger.serverLog(TAG, err)
                                                                      logger.serverLog(TAG,
                                                                        `Error occured at subscriber :${JSON.stringify(
                                                                          subscribers[j])}`)
                                                                    }
                                                                    let pollBroadcast = PollLogicLayer.preparePollPagePayload(pages[z], req.user, companyUser, req.body, subscribers[j], pollCreated._id)
                                                                    PollPageDataLayer.createForPollPage(pollBroadcast)
                                                                      .then(pollCreated => {
                                                                        require('./../../../config/socketio').sendMessageToClient({
                                                                          room_id: companyUser.companyId,
                                                                          body: {
                                                                            action: 'poll_send',
                                                                            poll_id: pollCreated._id,
                                                                            user_id: req.user._id,
                                                                            user_name: req.user.name,
                                                                            company_id: companyUser.companyId
                                                                          }
                                                                        })
                                                                      })
                                                                      .catch(error => {
                                                                        return res.status(500).json({status: 'failed', payload: `Failed to create poll page ${JSON.stringify(error)}`})
                                                                      })
                                                                  })
                                                              } else {
                                                                logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                                                let timeNow = new Date()
                                                                AutomationQueueDataLayer.createAutomationQueueObject({
                                                                  automatedMessageId: pollCreated._id,
                                                                  subscriberId: subscribers[j]._id,
                                                                  companyId: companyUser.companyId,
                                                                  type: 'poll',
                                                                  scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                                                }).then(saved => {})
                                                                  .catch(error => {
                                                                    return res.status(500).json({status: 'failed', payload: `Failed to create automation queue object ${JSON.stringify(error)}`})
                                                                  })
                                                              }
                                                            })
                                                          })
                                                          .catch(error => {
                                                            return res.status(500).json({status: 'failed', payload: `Failed to fetch company usage ${JSON.stringify(error)}`})
                                                          })
                                                      })
                                                        .catch(error => {
                                                          return res.status(500).json({status: 'failed', payload: `Failed to update company usage ${JSON.stringify(error)}`})
                                                        })
                                                    }
                                                  })
                                                })
                                              }
                                            })
                                        })
                                        .catch(error => {
                                          return res.status(500).json({status: 'failed', payload: `Failed to fetch subscribers ${JSON.stringify(error)}`})
                                        })
                                    }
                                  }
                                  return res.status(200).json({status: 'success', payload: 'Polls sent successfully.'})
                                })
                                .catch(error => {
                                  return res.status(500).json({status: 'failed', payload: `Failed to fetch pages ${JSON.stringify(error)}`})
                                })
                            })
                            .catch(error => {
                              return res.status(500).json({status: 'failed', payload: `Failed to fetch user ${JSON.stringify(error)}`})
                            })
                        })
                        .catch(error => {
                          return res.status(500).json({status: 'failed', payload: `Failed to fetch page ${JSON.stringify(error)}`})
                        })
                    })
                    .catch(error => {
                      return res.status(500).json({status: 'failed', payload: `Failed to create poll ${JSON.stringify(error)}`})
                    })
                })
                .catch(error => {
                  return res.status(500).json({status: 'failed', payload: `Failed to fetch company usage ${JSON.stringify(error)}`})
                })
            })
            .catch(error => {
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to plan usage ${JSON.stringify(error)}`
              })
            })
        })
        .catch(error => {
          return res.status(500).json({status: 'failed', payload: `Failed to company profile ${JSON.stringify(error)}`})
        })
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(error)}`})
    })
}
exports.deletePoll = function (req, res) {
  PollDataLayer.deleteForPolls(req.params.id)
    .then(poll => {
      PollPageDataLayer.deleteForPollPage({pollId: req.params.id})
        .then(pollpages => {
          PollResponseDataLayer.deleteForPollResponse({pollId: req.params.id})
            .then(pollresponses => {
              return res.status(200).json({status: 'success'})
            })
            .catch(error => {
              return res.status(500).json({status: 'failed', payload: `Failed to delete poll responses ${JSON.stringify(error)}`})
            })
        })
        .catch(error => {
          return res.status(500).json({status: 'failed', payload: `Failed to delete poll pages ${JSON.stringify(error)}`})
        })
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to delete poll ${JSON.stringify(error)}`})
    })
}
exports.getAllResponses = function (req, res) {
  PollResponseDataLayer.genericFindForPollResponse({})
    .then(pollresponses => {
      return res.status(200).json({status: 'success', payload: pollresponses})
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch responses ${JSON.stringify(error)}`})
    })
}
exports.getresponses = function (req, res) {
  PollResponseDataLayer.genericFindForPollResponse({pollId: req.params.id})
    .then(pollresponses => {
      return res.status(200).json({status: 'success', payload: pollresponses})
    })
    .catch(error => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch responses ${JSON.stringify(error)}`})
    })
}
