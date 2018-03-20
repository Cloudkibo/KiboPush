/**
 * Created by sojharo on 27/07/2017.
 */
//
const PhoneNumber = require('../growthtools/growthtools.model')
const Lists = require('../lists/lists.model')
const logger = require('../../components/logger')
const Broadcasts = require('./broadcasts.model')
const Pages = require('../pages/Pages.model')
const PollResponse = require('../polls/pollresponse.model')
const SurveyResponse = require('../surveys/surveyresponse.model')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const PollPage = require('../page_poll/page_poll.model')
const SurveyPage = require('../page_survey/page_survey.model')
const Surveys = require('../surveys/surveys.model')
const SurveyQuestions = require('../surveys/surveyquestions.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Workflows = require('../workflows/Workflows.model')
const AutoPosting = require('../autoposting/autopostings.model')
const Sessions = require('../sessions/sessions.model')
const LiveChat = require('../livechat/livechat.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const PageAdminSubscriptions = require('./../pageadminsubscriptions/pageadminsubscriptions.model')
const Users = require('./../user/Users.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require('./../autoposting_messages/autoposting_subscriber_messages.model')
const utility = require('./broadcasts.utility')
const mongoose = require('mongoose')
const og = require('open-graph')
let _ = require('lodash')
const TAG = 'api/broadcast/broadcasts.controller.js'
const needle = require('needle')
const request = require('request')
var array = []

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
    Broadcasts.find({companyId: companyUser.companyId}, (err, broadcasts) => {
      if (err) {
        return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
      }
      BroadcastPage.find({companyId: companyUser.companyId}, (err, broadcastpages) => {
        if (err) {
          return res.status(404)
          .json({status: 'failed', description: 'Broadcasts not found'})
        }
        res.status(200).json({
          status: 'success',
          payload: {broadcasts: broadcasts, broadcastpages: broadcastpages}
        })
      })
    })
  })
}

// Get a single broadcast
exports.show = function (req, res) {
  Broadcasts.findById(req.params.id)
    .populate('userId')
    .exec((err, broadcast) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!broadcast) {
        return res.status(404)
          .json({status: 'failed', description: 'Broadcast not found'})
      }
      return res.status(200).json({status: 'success', payload: broadcast})
    })
}

exports.verifyhook = function (req, res) {
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
}

// TODO This is very important to do
// webhook for facebook
exports.getfbMessage = function (req, res) {
  // This is body in chatwebhook {"object":"page","entry":[{"id":"1406610126036700","time":1501650214088,"messaging":[{"recipient":{"id":"1406610126036700"},"timestamp":1501650214088,"sender":{"id":"1389982764379580"},"postback":{"payload":"{\"poll_id\":121212,\"option\":\"option1\"}","title":"Option 1"}}]}]}

// {"sender":{"id":"1230406063754028"},"recipient":{"id":"272774036462658"},"timestamp":1504089493225,"read":{"watermark":1504089453074,"seq":0}}
  let subscriberByPhoneNumber = false
  let phoneNumber = ''
  logger.serverLog(TAG,
    `something received from facebook ${JSON.stringify(req.body)}`, true)
  if (req.body.entry && req.body.entry[0].messaging && req.body.entry[0].messaging[0] && req.body.entry[0].messaging[0].prior_message && req.body.entry[0].messaging[0].prior_message.source === 'customer_matching') {
    subscriberByPhoneNumber = true
    phoneNumber = req.body.entry[0].messaging[0].prior_message.identifier
    Pages.find({pageId: req.body.entry[0].id}, (err, pages) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      pages.forEach((page) => {
        PhoneNumber.update({number: req.body.entry[0].messaging[0].prior_message.identifier, pageId: page._id, companyId: page.companyId}, {
          hasSubscribed: true
        }, (err2, phonenumbersaved) => {
          if (err2) {
            logger.serverLog(TAG, err2)
          }
        })
      })
    })
  }

  if (req.body.entry && req.body.entry[0].messaging && req.body.entry[0].messaging[0] && req.body.entry[0].messaging[0].message && req.body.entry[0].messaging[0].message.quick_reply) {
    let resp = JSON.parse(req.body.entry[0].messaging[0].message.quick_reply.payload)
    if (resp.poll_id) {
      savepoll(req.body.entry[0].messaging[0], resp)
    }
  }

  if (req.body.object && req.body.object === 'page') {
    let payload = req.body.entry[0]
    if (payload.messaging) {
      if (payload.messaging[0].optin) {
        addAdminAsSubscriber(payload)
        return
      }
      const messagingEvents = payload.messaging

      for (let i = 0; i < messagingEvents.length; i++) {
        let itIsMessage = false
        const event = req.body.entry[0].messaging[i]

        if (event.sender && event.recipient && event.postback && event.postback.payload &&
          event.postback.payload === '<GET_STARTED_PAYLOAD>') {
          itIsMessage = true
        }
        if (event.message &&
          (event.message.is_echo === false || !event.message.is_echo)) {
          itIsMessage = true
        }
        if (event.message && event.message.app_id) {
          itIsMessage = true
        }
        if (itIsMessage) {
          const sender = event.sender.id
          const pageId = event.recipient.id
          // handleMessageFromSomeOtherApp(event)
          // get accesstoken of page
          Pages.find({pageId: pageId, connected: true})
            .populate('userId')
            .exec((err, pages) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              pages.forEach((page) => {
                needle.get(
                  `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
                  (err, resp2) => {
                    if (err) {
                      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                    }
                    let pageAccessToken = resp2.body.access_token
                    const options = {
                      url: `https://graph.facebook.com/v2.6/${sender}?access_token=${pageAccessToken}`,
                      qs: {access_token: page.accessToken},
                      method: 'GET'

                    }
                    needle.get(options.url, options, (error, response) => {
                      const subsriber = response.body
                      if (!error) {
                        if (event.sender && event.recipient && event.postback && event.postback.payload &&
                          event.postback.payload === '<GET_STARTED_PAYLOAD>') {
                          if (page.welcomeMessage && page.isWelcomeMessageEnabled) {
                            page.welcomeMessage.forEach(payloadItem => {
                              if (payloadItem.componentType === 'text') {
                                if (payloadItem.text.includes('[Username]')) {
                                  payloadItem.text = payloadItem.text.replace('[Username]', response.body.first_name + ' ' + response.body.last_name)
                                }
                              }
                              let messageData = utility.prepareSendAPIPayload(
                                subsriber.id,
                                payloadItem, false)

                              logger.serverLog(TAG,
                                `Payload for Messenger Send API for test: ${JSON.stringify(
                                  messageData)}`)
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
                                      `At send test message broadcast ${JSON.stringify(err)}`)
                                  } else {
                                    logger.serverLog(TAG,
                                      `At send test message broadcast response ${JSON.stringify(
                                        res)}`)
                                  }
                                })
                            })
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
                          //  coverPhoto: coverphoto.source,
                          pageScopedId: '',
                          email: '',
                          senderId: sender,
                          pageId: page._id,
                          isSubscribed: true
                        }
                        if (subscriberByPhoneNumber) {
                          payload.phoneNumber = phoneNumber
                          payload.isSubscribedByPhoneNumber = true
                        }
                        Subscribers.findOne({senderId: sender}, (err, subscriber) => {
                          if (err) logger.serverLog(TAG, err)
                          if (subscriber === null) {
                            // subsriber not found, create subscriber
                            Subscribers.create(payload, (err2, subscriberCreated) => {
                              if (err2) {
                                logger.serverLog(TAG, err2)
                              }
                              if (subscriberByPhoneNumber) {
                                updateList(phoneNumber, sender, page)
                              }
                              if (!(event.postback && event.postback.title === 'Get Started')) {
                                createSession(page, subscriberCreated, event)
                              }
                              require('./../../config/socketio').sendMessageToClient({
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
                          } else {
                            if (subscriberByPhoneNumber === true) {
                              Subscribers.update({senderId: sender}, {phoneNumber: req.body.entry[0].messaging[0].prior_message.identifier, isSubscribedByPhoneNumber: true}, (err, subscriber) => {
                                if (err) logger.serverLog(TAG, err)
                              })
                            }
                            if (!(event.postback && event.postback.title === 'Get Started')) {
                              createSession(page, subscriber, event)
                            }
                          }
                        })
                      } else {
                        logger.serverLog(TAG, `ERROR ${JSON.stringify(error)}`)
                      }
                    })
                  })
              })
            })
        }

        // if event.post, the response will be of survey or poll. writing a logic to save response of poll

        if (event.postback) {
          try {
            let resp = JSON.parse(event.postback.payload)
            if (resp.poll_id) {
              // savepoll(event)
            } else if (resp.survey_id) {
              savesurvey(event)
            } else if (resp.unsubscribe) {
              handleUnsubscribe(resp, event)
            } else {
              sendReply(event)
            }
          } catch (e) {
            logger.serverLog(TAG, `Parse Error : ${e}`)
            logger.serverLog(TAG, 'Parse Error: ' + JSON.stringify(event.postback.payload))
          }
        }

        // if this is a read receipt
        if (event.read) {
          updateseenstatus(event)
        }
      }
    } else if (payload.changes) {
      const changeEvents = payload.changes
      for (let i = 0; i < changeEvents.length; i++) {
        const event = changeEvents[i]
        if (event.field && event.field === 'feed') {
          if (event.value.verb === 'add' && (['status', 'photo', 'video', 'share'].indexOf(event.value.item) > -1)) {
            if (event.value.item === 'share') {
              og(event.value.link, (err, meta) => {
                if (err) {
                  logger.serverLog(TAG, `Error: ${err}`)
                }
                logger.serverLog(TAG, `Url Meta: ${JSON.stringify(meta)}`)
                if (meta && meta.image && meta.image.url) {
                  event.value.image = meta.image.url
                }
                handleThePagePostsForAutoPosting(event)
              })
            } else if (event.value.item === 'video' && event.value.message) {
              handleThePagePostsForAutoPosting(event, 'status')
              handleThePagePostsForAutoPosting(event)
            } else {
              handleThePagePostsForAutoPosting(event)
            }
          }
        }
      }
    }
  }

  return res.status(200).json({status: 'success', description: 'got the data.'})
}
function updateList (phoneNumber, sender, page) {
  PhoneNumber.find({number: phoneNumber, hasSubscribed: true, pageId: page, companyId: page.companyId}, (err, number) => {
    if (err) {
    }
    if (number.length > 0) {
      let subscriberFindCriteria = {isSubscribedByPhoneNumber: true, senderId: sender, isSubscribed: true, phoneNumber: phoneNumber, pageId: page._id}
      Subscribers.find(subscriberFindCriteria).populate('pageId').exec((err, subscribers) => {
        if (err) {
        }
        let temp = []
        for (let i = 0; i < subscribers.length; i++) {
          temp.push(subscribers[i]._id)
        }
        Lists.update({listName: number[0].fileName, companyId: page.companyId}, {
          content: temp
        }, (err2, savedList) => {
          if (err) {
          }
        })
      })
    }
  })
}
function handleThePagePostsForAutoPosting (event, status) {
  AutoPosting.find({accountUniqueName: event.value.sender_id, isActive: true})
  .populate('userId')
  .exec((err, autopostings) => {
    if (err) {
      return logger.serverLog(TAG,
        'Internal Server Error on connect')
    }
    autopostings.forEach(postingItem => {
      let pagesFindCriteria = {
        userId: postingItem.userId._id,
        connected: true
      }

      if (postingItem.isSegmented) {
        if (postingItem.segmentationPageIds) {
          pagesFindCriteria = _.merge(pagesFindCriteria, {
            pageId: {
              $in: postingItem.segmentationPageIds
            }
          })
        }
      }
      Pages.find(pagesFindCriteria, (err, pages) => {
        if (err) {
          logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        }
        pages.forEach(page => {
          let subscriberFindCriteria = {
            pageId: page._id,
            isSubscribed: true
          }

          if (postingItem.isSegmented) {
            if (postingItem.segmentationGender.length > 0) {
              subscriberFindCriteria = _.merge(
                subscriberFindCriteria,
                {
                  gender: {
                    $in: postingItem.segmentationGender
                  }
                })
            }
            if (postingItem.segmentationLocale.length > 0) {
              subscriberFindCriteria = _.merge(
                subscriberFindCriteria, {
                  locale: {
                    $in: postingItem.segmentationLocale
                  }
                })
            }
          }
          Subscribers.find(subscriberFindCriteria,
            (err, subscribers) => {
              if (err) {
                return logger.serverLog(TAG,
                  `Error ${JSON.stringify(err)}`)
              }

              logger.serverLog(TAG,
                `Total Subscribers of page ${page.pageName} are ${subscribers.length}`)

              if (subscribers.length > 0) {
                let newMsg = new AutopostingMessages({
                  pageId: page._id,
                  companyId: postingItem.companyId,
                  autoposting_type: 'facebook',
                  payload: event,
                  autopostingId: postingItem._id,
                  sent: subscribers.length,
                  seen: 0,
                  clicked: 0
                })

                newMsg.save((err, savedMsg) => {
                  if (err) logger.serverLog(TAG, err)

                  subscribers.forEach(subscriber => {
                    let messageData = {}
                    let newSubscriberMsg = new AutopostingSubscriberMessages({
                      pageId: page.pageId,
                      companyId: postingItem.companyId,
                      autopostingId: postingItem._id,
                      autoposting_messages_id: savedMsg._id,
                      subscriberId: subscriber.senderId,
                      payload: event
                    })

                    newSubscriberMsg.save((err, savedSubscriberMsg) => {
                      if (err) logger.serverLog(TAG, err)
                    })

                    if (event.value.item === 'status' || status) {
                      messageData = {
                        'recipient': JSON.stringify({
                          'id': subscriber.senderId
                        }),
                        'message': JSON.stringify({
                          'text': event.value.message,
                          'metadata': 'This is metadata'
                        })
                      }
                    } else if (event.value.item === 'share') {
                      messageData = {
                        'recipient': JSON.stringify({
                          'id': subscriber.senderId
                        }),
                        'message': JSON.stringify({
                          'attachment': {
                            'type': 'template',
                            'payload': {
                              'template_type': 'generic',
                              'elements': [
                                {
                                  'title': (event.value.message) ? event.value.message : event.value.sender_name,
                                  'image_url': event.value.image,
                                  'subtitle': 'kibopush.com',
                                  'buttons': [
                                    {
                                      'type': 'web_url',
                                      'url': event.value.link,
                                      'title': 'View Link'
                                    }
                                  ]
                                }
                              ]
                            }
                          }
                        })
                      }
                    } else if (event.value.item === 'photo') {
                      messageData = {
                        'recipient': JSON.stringify({
                          'id': subscriber.senderId
                        }),
                        'message': JSON.stringify({
                          'attachment': {
                            'type': 'template',
                            'payload': {
                              'template_type': 'generic',
                              'elements': [
                                {
                                  'title': (event.value.message) ? event.value.message : event.value.sender_name,
                                  'image_url': event.value.link,
                                  'subtitle': 'kibopush.com',
                                  'buttons': [
                                    {
                                      'type': 'web_url',
                                      'url': 'https://www.facebook.com/' + event.value.sender_id,
                                      'title': 'View Page'
                                    }
                                  ]
                                }
                              ]
                            }
                          }
                        })
                      }
                    } else if (event.value.item === 'video') {
                      messageData = {
                        'recipient': JSON.stringify({
                          'id': subscriber.senderId
                        }),
                        'message': JSON.stringify({
                          'attachment': {
                            'type': 'video',
                            'payload': {
                              'url': event.value.link,
                              'is_reusable': false
                            }
                          }
                        })
                      }
                    }
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
                          `At send fb post broadcast ${JSON.stringify(
                            err)}`)
                        } else {
                          if (res.statusCode !== 200) {
                            logger.serverLog(TAG,
                            `At send fb post broadcast response ${JSON.stringify(
                              res.body.error)}`)
                          } else {
                            logger.serverLog(TAG,
                            `At send fb post broadcast response ${JSON.stringify(
                              res.body.message_id)}`)
                          }
                        }
                      })
                  })
                })
              }
            })
        })
      })
    })
  })
}

function handleMessageFromSomeOtherApp (event) {
  logger.serverLog(TAG, 'going to save message coming from other app')
  const pageId = event.sender.id
  const receiverId = event.recipient.id
  // get accesstoken of page
  Pages.find({pageId: pageId, connected: true})
  .populate('userId')
  .exec((err, pages) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    pages.forEach((page) => {
      const options = {
        url: `https://graph.facebook.com/v2.6/${receiverId}?access_token=${page.accessToken}`,
        qs: {access_token: page.accessToken},
        method: 'GET'

      }
      needle.get(options.url, options, (error, response) => {
        const subsriber = response.body
        if (!error) {
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
            //  coverPhoto: coverphoto.source,
            pageScopedId: '',
            email: '',
            senderId: receiverId,
            pageId: page._id,
            isSubscribed: true
          }
          Subscribers.findOne({senderId: receiverId}, (err, subscriber) => {
            if (err) logger.serverLog(TAG, err)
            if (subscriber === null) {
              // subsriber not found, create subscriber
              Subscribers.create(payload, (err2, subscriberCreated) => {
                if (err2) {
                  logger.serverLog(TAG, err2)
                }
                if (!(event.postback && event.postback.title === 'Get Started')) {
                  createSession(page, subscriberCreated, event)
                }
                require('./../../config/socketio').sendMessageToClient({
                  room_id: page.companyId,
                  body: {
                    action: 'new_subscriber',
                    payload: {
                      name: subscriberCreated.firstName + ' ' + subscriberCreated.lastName,
                      subscriber: subscriberCreated
                    }
                  }
                })
              })
            } else {
              if (!(event.postback && event.postback.title === 'Get Started')) {
                createSession(page, subscriber, event)
              }
            }
          })
        } else {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(error)}`)
        }
      })
    })
  })
}

function createSession (page, subscriber, event) {
  Sessions.findOne({page_id: page._id, subscriber_id: subscriber._id},
    (err, session) => {
      if (err) logger.serverLog(TAG, err)
      if (session === null) {
        let newSession = new Sessions({
          subscriber_id: subscriber._id,
          page_id: page._id,
          company_id: page.companyId
        })
        newSession.save((err, sessionSaved) => {
          if (err) logger.serverLog(TAG, err)
          logger.serverLog(TAG, 'new session created')
          saveLiveChat(page, subscriber, sessionSaved, event)
        })
      } else {
        session.last_activity_time = Date.now()
        session.save((err) => {
          if (err) logger.serverLog(TAG, err)
          saveLiveChat(page, subscriber, session, event)
        })
      }
    })
}

function saveLiveChat (page, subscriber, session, event) {
  let chatPayload = {
    format: 'facebook',
    sender_id: subscriber._id,
    recipient_id: page.userId._id,
    sender_fb_id: subscriber.senderId,
    recipient_fb_id: page.pageId,
    session_id: session._id,
    company_id: page.companyId,
    status: 'unseen', // seen or unseen
    payload: event.message
  }
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

function saveChatInDb (page, session, chatPayload, subscriber, event) {
  let newChat = new LiveChat(chatPayload)
  newChat.save((err, chat) => {
    if (err) return logger.serverLog(TAG, err)
    require('./../../config/socketio').sendMessageToClient({
      room_id: page.companyId,
      body: {
        action: 'new_chat',
        payload: {
          session_id: session._id,
          chat_id: chat._id,
          text: chatPayload.payload.text,
          name: subscriber.firstName + ' ' + subscriber.lastName,
          subscriber: subscriber
        }
      }
    })
    sendautomatedmsg(event, page)
  })
}

function addAdminAsSubscriber (payload) {
  Users.findOne({_id: payload.messaging[0].optin.ref}, (err, user) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    CompanyUsers.findOne({domain_email: user.domain_email}, (err, companyUser) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      Pages.findOne({pageId: payload.id, companyId: companyUser.companyId}, (err, page) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        let pageAdminSubscription = new PageAdminSubscriptions({
          companyId: companyUser.companyId,
          userId: user._id,
          subscriberId: payload.messaging[0].sender.id,
          pageId: page._id
        })
        pageAdminSubscription.save((err) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          } else {
            require('./../../config/socketio').sendMessageToClient({
              room_id: page.companyId,
              body: {
                action: 'admin_subscriber',
                payload: {
                  subscribed_page: page
                }
              }
            })
          }
        })
      })
    })
  })
}

function updateseenstatus (req) {
  BroadcastPage.update(
    {pageId: req.recipient.id, subscriberId: req.sender.id},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  PollPage.update(
    {pageId: req.recipient.id, subscriberId: req.sender.id},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  SurveyPage.update(
    {pageId: req.recipient.id, subscriberId: req.sender.id},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  LiveChat.update(
    {sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id},
    {status: 'seen'},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  let updateResult = {}
  AutopostingSubscriberMessages.update(
    {susbscriberId: req.sender.id, pageId: req.recipient.id, datetime: {$lte: new Date(req.read.watermark)}},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      updateResult = updated[0]
    })
  AutopostingMessages.update(
    {_id: updateResult.autoposting_messages_id},
    {$inc: {seen: 1}},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
}

function sendReply (req) {
  let parsedData = JSON.parse(req.postback.payload)
  parsedData.forEach(payloadItem => {
    let messageData = utility.prepareSendAPIPayload(
      req.sender.id, payloadItem)
    logger.serverLog(TAG, `utility ${JSON.stringify(messageData)}`)
    Pages.find({pageId: req.recipient.id}, (err, pages) => {
      if (err) {
        return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      }
      request(
        {
          'method': 'POST',
          'json': true,
          'formData': messageData,
          'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
          pages[0].accessToken
        },
        function (err, res) {
          if (err) {
            return logger.serverLog(TAG,
              `At send test message broadcast ${JSON.stringify(err)}`)
          } else {
            logger.serverLog(TAG,
              `At send reply response ${JSON.stringify(
                res)}`)
          }
        })
    })
  })
}

function savepoll (req, resp) {
  // find subscriber from sender id
  // var resp = JSON.parse(req.postback.payload)
  var temp = true
  Subscribers.findOne({senderId: req.sender.id}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber ${JSON.stringify(
          err)}`)
    }
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        if (mongoose.Types.ObjectId(array[i].pollId) === mongoose.Types.ObjectId(resp.poll_id) && mongoose.Types.ObjectId(array[i].subscriberId) === mongoose.Types.ObjectId(subscriber._id)) {
          temp = false
          break
        }
      }
    }
    const pollbody = {
      response: resp.option, // response submitted by subscriber
      pollId: resp.poll_id,
      subscriberId: subscriber._id

    }
    if (temp === true) {
      PollResponse.create(pollbody, (err, pollresponse) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        } else {
          array.push(pollbody)
        }
      })
    }
  })
}

function handleUnsubscribe (resp, req) {
  let messageData = {}
  if (resp.action === 'yes') {
    messageData = {
      text: 'You have unsubscribed from our broadcasts. Send "start" to subscribe again.'
    }
    Subscribers.update({senderId: req.sender.id},
      {isSubscribed: false}, (err) => {
        if (err) {
          logger.serverLog(TAG,
            `Subscribers update subscription: ${JSON.stringify(
              err)}`)
        }
      })
  } else {
    messageData = {
      text: 'You can unsubscribe anytime by saying stop.'
    }
  }
  needle.get(
    `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
    (err3, response) => {
      if (err3) {
        logger.serverLog(TAG,
          `Page token error from graph api ${JSON.stringify(err3)}`)
      }
      const data = {
        recipient: {id: req.sender.id}, // this is the subscriber id
        message: messageData
      }
      needle.post(
        `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
        data, (err4, respp) => {
          logger.serverLog(TAG,
            `Sending unsubscribe confirmation response to subscriber  ${JSON.stringify(
              respp.body)}`)
        })
    })
}

function sendautomatedmsg (req, page) {
  Workflows.find({companyId: page.companyId, isActive: true})
    .populate('userId')
    .exec((err, workflows) => {
      if (err) {
        logger.serverLog(TAG, 'Workflows not found')
      }
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
        for (let i = 0; i < workflows.length; i++) {
          var userMsg = req.message.text
          var words = userMsg.trim().split(' ')

          if (workflows[i].condition === 'message_is' &&
            _.indexOf(workflows[i].keywords, userMsg) !== -1) {
            index = i
            break
          } else if (workflows[i].condition === 'message_contains' &&
            _.intersection(words, workflows[i].keywords).length > 0) {
            index = i
            break
          } else if (workflows[i].condition === 'message_begins' &&
            _.indexOf(workflows[i].keywords, words[0]) !== -1) {
            index = i
            break
          }
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
            const Yes = 'yes', No = 'no'
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
              messageData = {
                text: 'You have subscribed to our broadcasts. Send "stop" to unsubscribe'
              }
              Subscribers.update({senderId: req.sender.id},
                {isSubscribed: true}, (err) => {
                  if (err) {
                    logger.serverLog(TAG,
                      `Subscribers update subscription: ${JSON.stringify(
                        err)}`)
                  }
                })
            } else if (index > -1) {
              messageData = {
                text: workflows[index].reply
              }
            }

            const data = {
              recipient: {id: req.sender.id}, // this is the subscriber id
              message: messageData
            }
            if (messageData.text !== undefined || unsubscribeResponse) {
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  if (!unsubscribeResponse) {
                    Subscribers.findOne({senderId: req.sender.id},
                      (err, subscriber) => {
                        if (err) return logger.serverLog(TAG, err)
                        if (!subscriber) {
                        }
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
                  }
                })
              require('./../../config/socketio').sendMessageToClient({
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
    })
}
function savesurvey (req) {
  // this is the response of survey question
  // first save the response of survey
  // find subscriber from sender id
  var resp = JSON.parse(req.postback.payload)

  Subscribers.findOne({senderId: req.sender.id}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber${JSON.stringify(
          err)}`)
    }
    const surveybody = {
      response: resp.option, // response submitted by subscriber
      surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id

    }

    SurveyResponse.update({ surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id}, {response: resp.option}, {upsert: true}, (err1, surveyresponse, raw) => {
    // SurveyResponse.create(surveybody, (err1, surveyresponse) => {
        if (err1) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err1)}`)
        }
        logger.serverLog(TAG,
        `Raw${JSON.stringify(
          surveyresponse)}`)
      //  Surveys.update({ _id: mongoose.Types.ObjectId(resp.survey_id) }, { $set: { isresponded: true } })
      // send the next question
        SurveyQuestions.find({
          surveyId: resp.survey_id,
          _id: {$gt: resp.question_id}
        }).populate('surveyId').exec((err2, questions) => {
          if (err2) {
            logger.serverLog(TAG, `Survey questions not found ${JSON.stringify(
            err2)}`)
          }
          if (questions.length > 0) {
            let firstQuestion = questions[0]
          // create buttons
            const buttons = []
            let nextQuestionId = 'nil'
            if (questions.length > 1) {
              nextQuestionId = questions[1]._id
            }

            for (let x = 0; x < firstQuestion.options.length; x++) {
              buttons.push({
                type: 'postback',
                title: firstQuestion.options[x],
                payload: JSON.stringify({
                  survey_id: resp.survey_id,
                  option: firstQuestion.options[x],
                  question_id: firstQuestion._id,
                  nextQuestionId,
                  userToken: resp.userToken
                })
              })
            }
            needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }
              const messageData = {
                attachment: {
                  type: 'template',
                  payload: {
                    template_type: 'button',
                    text: firstQuestion.statement,
                    buttons

                  }
                }
              }
              const data = {
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  if (err4) {

                  }
                  Sessions.findOne({
                    subscriber_id: subscriber._id,
                    page_id: subscriber.pageId,
                    company_id: subscriber.userId
                  }, (err, session) => {
                    if (err) {
                      return logger.serverLog(TAG,
                        `At get session ${JSON.stringify(err)}`)
                    }
                    // if (!session) {
                    //   return logger.serverLog(TAG,
                    //     `No chat session was found for surveys in webhook`)
                    // }
                    // Pages.findOne({_id: subscriber.pageId}, (err7, page) => {
                    //   if (err7) {
                    //     return logger.serverLog(TAG,
                    //       `At get session ${JSON.stringify(err)}`)
                    //   }
                    //   if (!page) {
                    //     return logger.serverLog(TAG,
                    //       `No page was found for surveys in webhook`)
                    //   }
                    //   const chatMessage = new LiveChat({
                    //     sender_id: subscriber.pageId, // this is the page id: _id of Pageid
                    //     recipient_id: subscriber._id, // this is the subscriber id: _id of subscriberId
                    //     sender_fb_id: page.pageId, // this is the (facebook) :page id of pageId
                    //     recipient_fb_id: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                    //     session_id: session._id,
                    //     company_id: subscriber.companyId, // this is admin id till we have companies
                    //     payload: {
                    //       componentType: 'survey',
                    //       payload: messageData
                    //     }, // this where message content will go
                    //     status: 'unseen' // seen or unseen
                    //   })
                    //   chatMessage.save((err, chatMessageSaved) => {
                    //     if (err) {
                    //       return logger.serverLog(TAG,
                    //         `At save chat${JSON.stringify(err)}`)
                    //     }
                    //     logger.serverLog(TAG,
                    //       'Chat message saved for surveys sent in webhook')
                    //   })
                    // })
                  })
                })
            })
          } else { // else send thank you message
            Surveys.update({_id: mongoose.Types.ObjectId(resp.survey_id)}, {$inc: {isresponded: 1 - surveyresponse.nModified}}, (err, subscriber) => {
              if (err) {
                logger.serverLog(TAG,
                `Error occurred in finding subscriber${JSON.stringify(
                  err)}`)
              }
              Surveys.find({}, (err, subscriber) => {
                if (err) {
                  logger.serverLog(TAG,
                  `Error occurred in finding subscriber${JSON.stringify(
                    err)}`)
                }
              })
            })
            needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }
              const messageData = {
                text: 'Thank you. Response submitted successfully.'
              }
              const data = {
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  if (err4) {
                  }
                  Sessions.findOne({
                    subscriber_id: subscriber._id,
                    page_id: subscriber.pageId,
                    company_id: subscriber.companyId
                  }, (err, session) => {
                    if (err) {
                    }
                    // if (!session) {
                    //   return logger.serverLog(TAG,
                    //     `No chat session was found for surveys in webhook`)
                    // }
                    // Pages.findOne({_id: subscriber.pageId}, (err7, page) => {
                    //   if (err7) {
                    //     return logger.serverLog(TAG,
                    //       `At get session ${JSON.stringify(err)}`)
                    //   }
                    //   if (!page) {
                    //     return logger.serverLog(TAG,
                    //       `No page was found for surveys in webhook`)
                    //   }
                    //   const chatMessage = new LiveChat({
                    //     sender_id: subscriber.pageId, // this is the page id: _id of Pageid
                    //     recipient_id: subscriber._id, // this is the subscriber id: _id of subscriberId
                    //     sender_fb_id: page.pageId, // this is the (facebook) :page id of pageId
                    //     recipient_fb_id: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                    //     session_id: session._id,
                    //     company_id: subscriber.companyId, // this is admin id till we have companies
                    //     payload: {
                    //       componentType: 'survey',
                    //       text: messageData
                    //     }, // this where message content will go
                    //     status: 'unseen' // seen or unseen
                    //   })
                    //   chatMessage.save((err, chatMessageSaved) => {
                    //     if (err) {
                    //       return logger.serverLog(TAG,
                    //         `At save chat${JSON.stringify(err)}`)
                    //     }
                    //     logger.serverLog(TAG,
                    //       'Chat message saved for surveys sent in webhook')
                    //   })
                    // })
                  })
                })
            })
          }
        })
      })
  })
}
