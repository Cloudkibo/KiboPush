const logger = require('../../../components/logger')
const TAG = 'api/messengerEvents/subscriber.controller.js'
const needle = require('needle')
const webhookUtility = require('../../v1/webhooks/webhooks.utility')
const { sendBroadcast } = require('../../v1/broadcasts/broadcasts2.controller')
const broadcastUtility = require('../../v1/broadcasts/broadcasts.utility')
const botController = require('./../../v1/smart_replies/bots.controller')
const Sessions = require('../../v1/sessions/sessions.model')
const LiveChat = require('../../v1/livechat/livechat.model')
const utility = require('../../v1/broadcasts/broadcasts.utility')
const og = require('open-graph')
const Bots = require('../../v1/smart_replies/Bots.model')
const { callApi } = require('../utility')

exports.subscriber = function (req, res) {
  res.status(200).json({
    status: 'success',
    description: `received the payload`
  })
  logger.serverLog(TAG, `in subscriber ${JSON.stringify(req.body)}`)
  let phoneNumber = ''
  let subscriberSource = 'direct_message'
  for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
    const event = req.body.entry[0].messaging[i]
    const sender = event.sender.id
    const pageId = event.recipient.id
    if (event.message && event.message.tags && event.message.tags.source === 'customer_chat_plugin') {
      subscriberSource = 'chat_plugin'
    }
    if (event.prior_message && event.prior_message.source === 'customer_matching') {
      subscriberSource = 'customer_matching'
      phoneNumber = event.prior_message.identifier
    }
    callApi(`pages/query`, 'post', { pageId: pageId, connected: true }, req.headers.authorization)
      .then(pages => {
        pages.forEach((page) => {
          if (subscriberSource === 'customer_matching') {
            callApi(`phone/update`, 'put', {query: {number: req.body.entry[0].messaging[0].prior_message.identifier, pageId: page._id, companyId: page.companyId}, newPayload: {hasSubscribed: true}, options: {}}, req.headers.authorization)
              .then(phonenumberupdated => {
                logger.serverLog(TAG, `phone number updated successfully ${JSON.stringify(phonenumberupdated)}`)
              })
              .catch(err => {
                logger.serverLog(TAG, `Failed to update phone number ${JSON.stringify(err)}`)
              })
          }
          needle.get(
            `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
            (err, resp2) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              let pageAccessToken = resp2.body.access_token
              const options = {
                url: `https://graph.facebook.com/v2.6/${sender}?access_token=${pageAccessToken}`,
                qs: { access_token: page.accessToken },
                method: 'GET'

              }
              needle.get(options.url, options, (error, response) => {
                logger.serverLog(TAG, `Subscriber response git from facebook: ${JSON.stringify(response.body)}`)
                const subsriber = response.body
                if (!error && !response.error) {
                  if (event.sender && event.recipient && event.postback &&
                    event.postback.payload &&
                    event.postback.payload === '<GET_STARTED_PAYLOAD>') {
                    if (page.welcomeMessage &&
                      page.isWelcomeMessageEnabled) {
                      logger.serverLog(TAG, `Going to send welcome message`)
                      broadcastUtility.getBatchData(page.welcomeMessage, sender, page, sendBroadcast, subsriber.first_name, subsriber.last_name)
                    }
                  }
                  const payload = {
                    firstName: subsriber.first_name,
                    lastName: subsriber.last_name,
                    locale: subsriber.locale,
                    gender: subsriber.gender,
                    userId: page.userId,
                    provider: 'facebook',
                    timezone: subsriber.timezone,
                    profilePic: subsriber.profile_pic,
                    companyId: page.companyId,
                    pageScopedId: '',
                    email: '',
                    senderId: sender,
                    pageId: page._id,
                    isSubscribed: true
                  }
                  if (subscriberSource === 'customer_matching') {
                    payload.phoneNumber = phoneNumber
                    payload.source = 'customer_matching'
                  } else if (subscriberSource === 'chat_plugin') {
                    payload.source = 'chat_plugin'
                  }
                  callApi(`pages/query`, 'post', { _id: page._id, connected: true }, req.headers.authorization)
                    .then(pageFound => {
                      pageFound = pageFound[0]
                      if (subsriber === null) {
                        // subsriber not found, create subscriber
                        callApi(`company/${page.companyId}`, 'get', {}, req.headers.authorization)
                          .then(company => {
                            callApi(`featureUsage/getPlanUsage`, 'post', {planId: company.planId}, req.headers.authorization)
                              .then(planUsage => {
                                planUsage = planUsage[0]
                                callApi(`featureUsage/getCompanyUsage`, 'post', {companyId: page.companyId}, req.headers.authorization)
                                  .then(companyUsage => {
                                    companyUsage = companyUsage[0]
                                    if (planUsage.subscribers !== -1 && companyUsage.subscribers >= planUsage.subscribers) {
                                      webhookUtility.limitReachedNotification('subscribers', company)
                                    } else {
                                      callApi(`subscribers`, 'post', payload, req.headers.authorization)
                                        .then(subscriberCreated => {
                                          callApi(`featureUsage/updateCompanyUsage`, 'post', {query: {companyId: page.companyId}, newPayload: { $inc: { subscribers: 1 } }, options: {}}, req.headers.authorization)
                                            .then(updated => {
                                              logger.serverLog(TAG, `company usage incremented successfully ${JSON.stringify(err)}`)
                                            })
                                            .catch(err => {
                                              logger.serverLog(TAG, `Failed to update company usage ${JSON.stringify(err)}`)
                                            })
                                          callApi(`webhooks/query`, 'post', { pageId: pageId }, req.headers.authorization)
                                            .then(webhook => {
                                              if (webhook && webhook.isEnabled) {
                                                needle.get(webhook.webhook_url, (err, r) => {
                                                  if (err) {
                                                    logger.serverLog(TAG, err)
                                                  } else if (r.statusCode === 200) {
                                                    if (webhook && webhook.optIn.NEW_SUBSCRIBER) {
                                                      var data = {
                                                        subscription_type: 'NEW_SUBSCRIBER',
                                                        payload: JSON.stringify({ subscriber: subsriber, recipient: pageId, sender: sender })
                                                      }
                                                      needle.post(webhook.webhook_url, data,
                                                        (error, response) => {
                                                          if (error) logger.serverLog(TAG, err)
                                                        })
                                                    }
                                                  } else {
                                                    webhookUtility.saveNotification(webhook)
                                                  }
                                                })
                                              }
                                            })
                                            .catch(err => {
                                              logger.serverLog(TAG, err)
                                            })
                                          if (subscriberSource === 'customer_matching') {
                                            updateList(phoneNumber, sender, page)
                                          }
                                          if (!(event.postback &&
                                            event.postback.title === 'Get Started')) {
                                            createSession(page, subscriberCreated, event)
                                          }
                                          require('./../../../config/socketio')
                                            .sendMessageToClient({
                                              room_id: page.companyId,
                                              body: {
                                                action: 'dashboard_updated',
                                                payload: {
                                                  subscriber_id: subscriberCreated._id,
                                                  company_id: page.companyId
                                                }
                                              }
                                            })
                                        })
                                        .catch(err => {
                                          logger.serverLog(TAG, `Failed to create subscriber ${JSON.stringify(err)}`)
                                        })
                                    }
                                  })
                                  .catch(err => {
                                    logger.serverLog(TAG, `Failed to fetch company usage ${JSON.stringify(err)}`)
                                  })
                              })
                              .catch(err => {
                                logger.serverLog(TAG, `Failed to fetch plan usage ${JSON.stringify(err)}`)
                              })
                          })
                          .catch(err => {
                            logger.serverLog(TAG, `Failed to fetch company ${JSON.stringify(err)}`)
                          })
                      } else {
                        if (!subsriber.isSubscribed) {
                          // subscribing the subscriber again in case he
                          // or she unsubscribed and removed chat
                          callApi(`subscribers/update`, 'put', {query: { senderId: sender }, newPayload: {isSubscribed: true, isEnabledByPage: true}, options: {}}, req.headers.authorization)
                            .then(subscriber => {
                              logger.serverLog(TAG, subscriber)
                            })
                        }
                        if (!(event.postback &&
                          event.postback.title === 'Get Started')) {
                          createSession(page, subsriber, event)
                        }
                      }
                    })
                    .catch(err => {
                      logger.serverLog(TAG, `Failed to update page ${JSON.stringify(err)}`)
                    })
                } else {
                  if (error) {
                    logger.serverLog(TAG, `ERROR in fetching subscriber info ${JSON.stringify(error)}`)
                  }
                }
              })
            })
        })
      })
      .catch(err => {
        logger.serverLog(TAG, `Failed to fetch pages ${JSON.stringify(err)}`)
      })
  }
}
function updateList (phoneNumber, sender, page) {
  callApi(`phone/query`, 'post', {number: phoneNumber, hasSubscribed: true, pageId: page, companyId: page.companyId})
    .then(number => {
      if (number.length > 0) {
        let subscriberFindCriteria = {
          source: 'customer_matching',
          senderId: sender,
          isSubscribed: true,
          phoneNumber: phoneNumber,
          pageId: page._id
        }
        callApi(`subscribers/query`, 'post', subscriberFindCriteria)
          .then(subscribers => {
            let temp = []
            for (let i = 0; i < subscribers.length; i++) {
              temp.push(subscribers[i]._id)
            }
            callApi(`lists/update`, 'put', {query: { listName: number[0].fileName, companyId: page.companyId }, newPayload: {content: temp}, options: {}})
              .then(savedList => {
                logger.serverLog(TAG, `list updated successfully ${JSON.stringify(savedList)}`)
              })
              .catch(err => {
                logger.serverLog(TAG, `Failed to update list ${JSON.stringify(err)}`)
              })
          })
          .catch(err => {
            logger.serverLog(TAG, `Failed to update update subscriber ${JSON.stringify(err)}`)
          })
      }
    })
}
function createSession (page, subscriber, event) {
  callApi(`company/${page.companyId}`)
    .then(company => {
      if (!(company.automated_options === 'DISABLE_CHAT')) {
        Sessions.findOne({ page_id: page._id, subscriber_id: subscriber._id },
          (err, session) => {
            if (err) logger.serverLog(TAG, err)
            if (session === null) {
              callApi(`featureUsage/getPlanUsage`, 'post', {planId: company.planId})
                .then(planUsage => {
                  planUsage = planUsage[0]
                  callApi(`featureUsage/getCompanyUsage`, 'post', {companyId: page.companyId})
                    .then(companyUsage => {
                      companyUsage = companyUsage[0]
                      if (planUsage.sessions !== -1 && companyUsage.sessions >= planUsage.sessions) {
                        webhookUtility.limitReachedNotification('sessions', company)
                      } else {
                        let newSession = new Sessions({
                          subscriber_id: subscriber._id,
                          page_id: page._id,
                          company_id: page.companyId
                        })
                        newSession.save((err, sessionSaved) => {
                          if (err) logger.serverLog(TAG, err)
                          logger.serverLog(TAG, 'new session created')
                          callApi(`featureUsage/updateCompanyUsage`, 'put', {query: {companyId: page.companyId}, newPayload: { $inc: { sessions: 1 } }, options: {}})
                            .then(updated => {
                              logger.serverLog(TAG, `company usage incremented successfully ${JSON.stringify(updated)}`)
                            })
                            .catch(err => {
                              logger.serverLog(TAG, `Failed to update company usage ${JSON.stringify(err)}`)
                            })
                          saveLiveChat(page, subscriber, sessionSaved, event)
                        })
                      }
                    })
                    .catch(err => {
                      logger.serverLog(TAG, `Failed to fetch company usage ${JSON.stringify(err)}`)
                    })
                })
                .catch(err => {
                  logger.serverLog(TAG, `Failed to fetch plan usage ${JSON.stringify(err)}`)
                })
            } else {
              session.last_activity_time = Date.now()
              if (session.status === 'resolved') {
                session.status = 'new'
              }
              session.save((err) => {
                if (err) logger.serverLog(TAG, err)
                saveLiveChat(page, subscriber, session, event)
              })
            }
          })
      }
    })
    .catch(err => {
      logger.serverLog(TAG, `Failed to fetch company ${JSON.stringify(err)}`)
    })
}
function saveLiveChat (page, subscriber, session, event) {
  let chatPayload = {
    format: 'facebook',
    sender_id: subscriber._id,
    recipient_id: page.userId._id,
    sender_fb_id: subscriber.senderId,
    recipient_fb_id: page.pageId,
    session_id: session && session._id ? session._id : '',
    company_id: page.companyId,
    status: 'unseen', // seen or unseen
    payload: event.message
  }
  Bots.findOne({ 'pageId': subscriber.pageId.toString() }, (err, bot) => {
    if (err) {
      logger.serverLog(TAG, err)
    }
    if (bot) {
      if (bot.blockedSubscribers.indexOf(subscriber._id) === -1) {
        logger.serverLog(TAG, 'going to send bot reply')
        botController.respond(page.pageId, subscriber.senderId, event.message.text)
      }
    }
  })
  callApi(`webhooks/query`, 'post', { pageId: page.pageId })
  .then(webhook => {
    if (webhook && webhook.isEnabled) {
      logger.serverLog(TAG, `webhook in live chat ${webhook}`)
      needle.get(webhook.webhook_url, (err, r) => {
        if (err) {
          logger.serverLog(TAG, err)
          logger.serverLog(TAG, `response ${r.statusCode}`)
        } else if (r.statusCode === 200) {
          if (webhook && webhook.optIn.POLL_CREATED) {
            var data = {
              subscription_type: 'LIVE_CHAT_ACTIONS',
              payload: JSON.stringify({
                format: 'facebook',
                subscriberId: subscriber.senderId,
                pageId: page.pageId,
                session_id: session._id,
                company_id: page.companyId,
                payload: event.message
              })
            }
            needle.post(webhook.webhook_url, data,
              (error, response) => {
                if (error) logger.serverLog(TAG, err)
              })
          }
        } else {
          webhookUtility.saveNotification(webhook)
        }
      })
    }
  })
  .catch(err => {
    logger.serverLog(TAG, err)
  })
  if (event.message) {
    let urlInText = utility.parseUrl(event.message.text)
    if (urlInText !== null && urlInText !== '') {
      og(urlInText, function (err, meta) {
        if (err) return logger.serverLog(TAG, err)
        chatPayload.url_meta = meta
        saveChatInDb(page, session, chatPayload, subscriber, event)
      })
    } else {
      saveChatInDb(page, session, chatPayload, subscriber, event)
    }
  }
}

function saveChatInDb (page, session, chatPayload, subscriber, event) {
  let newChat = new LiveChat(chatPayload)
  newChat.save((err, chat) => {
    if (err) return logger.serverLog(TAG, err)
    require('./../../../config/socketio').sendMessageToClient({
      room_id: page.companyId,
      body: {
        action: 'new_chat',
        payload: {
          session_id: session._id,
          chat_id: chat._id,
          text: chatPayload.payload.text,
          name: subscriber.firstName + ' ' + subscriber.lastName,
          subscriber: subscriber,
          message: chat
        }
      }
    })
    sendautomatedmsg(event, page)
  })
}
function sendautomatedmsg (req, page) {
  // const sender = req.sender.id
  // const page = req.recipient.id
  //  'message_is'
  //  'message_contains'
  //  'message_begins'
  if (req.message && req.message.text) {
    let index = -3
    if (req.message.text.toLowerCase() === 'stop' ||
      req.message.text.toLowerCase() === 'unsubscribe') {
      index = -101
    }
    if (req.message.text.toLowerCase() === 'start' ||
      req.message.text.toLowerCase() === 'subscribe') {
      index = -111
    }

    // user query matched with keywords, send response
    // sending response to sender
    needle.get(
      `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
      (err3, response) => {
        if (err3) {
          logger.serverLog(TAG,
            `Page token error from graph api ${JSON.stringify(err3)}`)
        }
        let messageData = {}
        const Yes = 'yes'
        const No = 'no'
        let unsubscribeResponse = false
        if (index === -101) {
          let buttonsInPayload = []
          buttonsInPayload.push({
            type: 'postback',
            title: 'Yes',
            payload: JSON.stringify({
              unsubscribe: Yes,
              action: Yes,
              userToken: page.userId.facebookInfo.fbToken
            })
          })
          buttonsInPayload.push({
            type: 'postback',
            title: 'No',
            payload: JSON.stringify({
              unsubscribe: Yes,
              action: No,
              userToken: page.userId.facebookInfo.fbToken
            })
          })

          messageData = {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'Are you sure you want to unsubscribe?',
                buttons: buttonsInPayload
              }
            }
          }
          unsubscribeResponse = true
        } else if (index === -111) {
          callApi(`subscribers/query`, 'post', { senderId: req.sender.id, unSubscribedBy: 'subscriber' })
            .the(subscribers => {
              if (subscribers.length > 0) {
                messageData = {
                  text: 'You have subscribed to our broadcasts. Send "stop" to unsubscribe'
                }
                callApi(`subscribers/update`, 'put', {query: { senderId: req.sender.id }, newPayload: { isSubscribed: true }, options: {}})
                  .then(updated => {
                    logger.serverLog(TAG, `subscriber updated successfully ${JSON.stringify(updated)}`)
                  })
                  .cath(err => {
                    logger.serverLog(TAG, `Failed to update subscriber ${JSON.stringify(err)}`)
                  })
                const data = {
                  messaging_type: 'RESPONSE',
                  recipient: { id: req.sender.id }, // this is the subscriber id
                  message: messageData
                }
                needle.post(
                  `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                  data, (err4, respp) => {
                  })
              }
            })
            .cath(err => {
              logger.serverLog(TAG, `Failed to fetch subscribers ${JSON.stringify(err)}`)
            })
        }

        const data = {
          messaging_type: 'RESPONSE',
          recipient: { id: req.sender.id }, // this is the subscriber id
          message: messageData
        }
        if (messageData.text !== undefined || unsubscribeResponse) {
          needle.post(
            `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
            data, (err4, respp) => {
              if (!unsubscribeResponse) {
                callApi(`subscribers/query`, 'post', { senderId: req.sender.id })
                  .then(subscribers => {
                    let subscriber = subscribers[0]
                    Sessions.findOne({
                      subscriber_id: subscriber._id,
                      page_id: page._id,
                      company_id: page.companyId
                    }, (err, session) => {
                      if (err) {
                        return logger.serverLog(TAG,
                          `At get session ${JSON.stringify(err)}`)
                      }
                      if (!session) {
                        return logger.serverLog(TAG,
                          `No chat session was found for workflow`)
                      }
                      const chatMessage = new LiveChat({
                        sender_id: page._id, // this is the page id: _id of Pageid
                        recipient_id: subscriber._id, // this is the subscriber id: _id of subscriberId
                        sender_fb_id: page.pageId, // this is the (facebook) :page id of pageId
                        recipient_fb_id: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                        session_id: session._id,
                        company_id: page.companyId, // this is admin id till we have companies
                        payload: {
                          componentType: 'text',
                          text: messageData.text
                        }, // this where message content will go
                        status: 'unseen' // seen or unseen
                      })
                      callApi(`webhooks/query`, 'post', { pageId: page.pageId })
                      .then(webhook => {
                        if (webhook && webhook.isEnabled) {
                          logger.serverLog(TAG, `webhook in live chat ${webhook}`)
                          needle.get(webhook.webhook_url, (err, r) => {
                            if (err) {
                              logger.serverLog(TAG, err)
                            } else if (r.statusCode === 200) {
                              if (webhook && webhook.optIn.POLL_CREATED) {
                                var data = {
                                  subscription_type: 'LIVE_CHAT_ACTIONS',
                                  payload: JSON.stringify({
                                    pageId: page.pageId, // this is the (facebook) :page id of pageId
                                    subscriberId: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                                    session_id: session._id,
                                    company_id: page.companyId, // this is admin id till we have companies
                                    payload: {
                                      componentType: 'text',
                                      text: messageData.text
                                    }
                                  })
                                }
                                needle.post(webhook.webhook_url, data,
                                  (error, response) => {
                                    if (error) logger.serverLog(TAG, err)
                                  })
                              }
                            } else {
                              webhookUtility.saveNotification(webhook)
                            }
                          })
                        }
                      })
                      .catch(err => {
                        logger.serverLog(TAG, err)
                      })
                      chatMessage.save((err, chatMessageSaved) => {
                        if (err) {
                          return logger.serverLog(TAG,
                            `At save chat${JSON.stringify(err)}`)
                        }
                        session.last_activity_time = Date.now()
                        session.save((err) => {
                          if (err) logger.serverLog(TAG, err)
                        })
                      })
                    })
                  })
                  .cath(err => {
                    logger.serverLog(TAG, `Failed to fetch subscribers ${JSON.stringify(err)}`)
                  })
              }
            })
          require('./../../../config/socketio').sendMessageToClient({
            room_id: page.companyId,
            body: {
              action: 'dashboard_updated',
              payload: {
                company_id: page.companyId
              }
            }
          })
        }
      })
  }
}
