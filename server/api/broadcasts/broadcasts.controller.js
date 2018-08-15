/**
 * Created by sojharo on 27/07/2017.
 */
//
const Sequences = require('../sequenceMessaging/sequence.model')
const SequenceSubscribers = require('../sequenceMessaging/sequenceSubscribers.model')
const SequenceMessages = require('../sequenceMessaging/message.model')
const SequenceMessageQueue = require('../SequenceMessageQueue/SequenceMessageQueue.model')
const PhoneNumber = require('../growthtools/growthtools.model')
const Lists = require('../lists/lists.model')
const botController = require('./../smart_replies/bots.controller')
const Bots = require('./../smart_replies/Bots.model')
const WaitingSubscriber = require('./../smart_replies/waitingSubscribers.model')
const logger = require('../../components/logger')
const Broadcasts = require('./broadcasts.model')
const Pages = require('../pages/Pages.model')
const PollResponse = require('../polls/pollresponse.model')
const SurveyResponse = require('../surveys/surveyresponse.model')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const AutomationQueue = require('./../automation_queue/automation_queue.model')
const PollPage = require('../page_poll/page_poll.model')
//  const Polls = require('../polls/Polls.model')
const SurveyPage = require('../page_survey/page_survey.model')
const Surveys = require('../surveys/surveys.model')
const SurveyQuestions = require('../surveys/surveyquestions.model')
const Subscribers = require('../subscribers/Subscribers.model')
const AutoPosting = require('../autoposting/autopostings.model')
const Sessions = require('../sessions/sessions.model')
const LiveChat = require('../livechat/livechat.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const CompanyProfile = require('../companyprofile/companyprofile.model')
const FacebookPosts = require('./../facebook_posts/facebook_posts.model')
const PageAdminSubscriptions = require(
  './../pageadminsubscriptions/pageadminsubscriptions.model')
const Users = require('./../user/Users.model')
const URL = require('./../URLforClickedCount/URL.model')
const AutopostingMessages = require(
  './../autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require(
  './../autoposting_messages/autoposting_subscriber_messages.model')
const Webhooks = require(
  './../webhooks/webhooks.model')
const SequenceSubscriberMessages = require('./../sequenceMessaging/sequenceSubscribersMessages.model')
const { sendBroadcast } = require('./broadcasts2.controller')
const utility = require('./broadcasts.utility')
const compUtility = require('../../components/utility')
const mongoose = require('mongoose')
const og = require('open-graph')
let _ = require('lodash')
const TAG = 'api/broadcast/broadcasts.controller.js'
const needle = require('needle')
const request = require('request')
const webhookUtility = require('./../webhooks/webhooks.utility')
let config = require('./../../config/environment')
var array = []

exports.index = function (req, res) {
  CompanyUsers.findOne({ domain_email: req.user.domain_email },
    (err, companyUser) => {
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
      let search = ''
      let findCriteria = {}
      let startDate = new Date()  // Current date
      startDate.setDate(startDate.getDate() - req.body.filter_criteria.days)
      startDate.setHours(0)   // Set the hour, minute and second components to 0
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      let finalCriteria = {}
      let recordsToSkip = 0
      if (!req.body.filter) {
        findCriteria = {
          companyId: companyUser.companyId,
          'datetime': req.body.filter_criteria.days !== '0' ? {
            $gte: startDate
          } : { $exists: true }
        }
      } else {
        search = new RegExp('.*' + req.body.filter_criteria.search_value + '.*', 'i')
        if (req.body.filter_criteria.type_value === 'miscellaneous') {
          findCriteria = {
            companyId: companyUser.companyId,
            'payload.1': { $exists: true },
            title: req.body.filter_criteria.search_value !== '' ? { $regex: search } : { $exists: true },
            'datetime': req.body.filter_criteria.days !== '0' ? {
              $gte: startDate
            } : { $exists: true }
          }
        } else {
          findCriteria = {
            companyId: companyUser.companyId,
            $and: [{'payload.0.componentType': req.body.filter_criteria.type_value !== '' ? req.body.filter_criteria.type_value : { $exists: true }}, {'payload.1': { $exists: false }}],
            title: req.body.filter_criteria.search_value !== '' ? { $regex: search } : { $exists: true },
            'datetime': req.body.filter_criteria.days !== '0' ? {
              $gte: startDate
            } : { $exists: true }
          }
        }
      }
      if (req.body.first_page === 'first') {
        finalCriteria = [
          { $match: findCriteria },
          { $sort: { datetime: -1 } },
          { $skip: recordsToSkip },
          { $limit: req.body.number_of_records }
        ]
      } else if (req.body.first_page === 'next') {
        recordsToSkip = Math.abs(((req.body.requested_page - 1) - (req.body.current_page))) * req.body.number_of_records
        finalCriteria = [
          { $match: { $and: [findCriteria, { _id: { $lt: mongoose.Types.ObjectId(req.body.last_id) } }] } },
          { $sort: { datetime: -1 } },
          { $skip: recordsToSkip },
          { $limit: req.body.number_of_records }
        ]
      } else if (req.body.first_page === 'previous') {
        recordsToSkip = Math.abs(((req.body.requested_page) - (req.body.current_page - 1))) * req.body.number_of_records
        finalCriteria = [
          { $match: { $and: [findCriteria, { _id: { $gt: mongoose.Types.ObjectId(req.body.last_id) } }] } },
          { $sort: { datetime: 1 } },
          { $skip: recordsToSkip },
          { $limit: req.body.number_of_records }
        ]
      }
      Broadcasts.aggregate([
        { $match: findCriteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ], (err, broadcastsCount) => {
        if (err) {
          return res.status(404)
            .json({ status: 'failed', description: 'BroadcastsCount not found' })
        }
        Broadcasts.aggregate(finalCriteria)
            .exec((err, broadcasts) => {
              if (err) {
                return res.status(404)
                  .json({ status: 'failed', description: 'Broadcasts not found' })
              }
              BroadcastPage.find({ companyId: companyUser.companyId },
                (err, broadcastpages) => {
                  if (err) {
                    return res.status(404)
                      .json({ status: 'failed', description: 'Broadcasts not found' })
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: { broadcasts: req.body.first_page === 'previous' ? broadcasts.reverse() : broadcasts, count: broadcastsCount && broadcastsCount.length > 0 ? broadcastsCount[0].count : 0, broadcastpages: broadcastpages }
                  })
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
          .json({ status: 'failed', description: 'Internal Server Error' })
      }
      if (!broadcast) {
        return res.status(404)
          .json({ status: 'failed', description: 'Broadcast not found' })
      }
      return res.status(200).json({ status: 'success', payload: broadcast })
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
  logger.serverLog(TAG,
    `something received from facebook FIRST ${JSON.stringify(req.body)}`)

  let subscriberSource = 'direct_message'
  let phoneNumber = ''
  if (req.body.entry && req.body.entry[0].messaging &&
    req.body.entry[0].messaging[0] &&
    req.body.entry[0].messaging[0].prior_message &&
    req.body.entry[0].messaging[0].prior_message.source ===
    'customer_matching') {
    subscriberSource = 'customer_matching'
    phoneNumber = req.body.entry[0].messaging[0].prior_message.identifier
    Pages.find({ pageId: req.body.entry[0].id }, (err, pages) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      pages.forEach((page) => {
        PhoneNumber.update({
          number: req.body.entry[0].messaging[0].prior_message.identifier,
          pageId: page._id,
          companyId: page.companyId
        }, {
          hasSubscribed: true
        }, (err2, phonenumbersaved) => {
          if (err2) {
            logger.serverLog(TAG, err2)
          }
        })
      })
    })
  }

  if (req.body.entry && req.body.entry[0].messaging &&
    req.body.entry[0].messaging[0] &&
    req.body.entry[0].messaging[0].message && req.body.entry[0].messaging[0].message.tags &&
    req.body.entry[0].messaging[0].message.tags.source ===
    'customer_chat_plugin') {
    subscriberSource = 'chat_plugin'
  }

  if (req.body.entry && req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.item ===
    'comment') {
    sendCommentReply(req.body)
  }

  if (req.body.entry && req.body.entry[0].messaging &&
    req.body.entry[0].messaging[0] && req.body.entry[0].messaging[0].message &&
    req.body.entry[0].messaging[0].message.quick_reply) {
    let resp = JSON.parse(
      req.body.entry[0].messaging[0].message.quick_reply.payload)
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

        if (event.sender && event.recipient && event.postback &&
          event.postback.payload &&
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
          Pages.find({ pageId: pageId, connected: true })
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
                            utility.getBatchData(page.welcomeMessage, sender, page, sendBroadcast, subsriber.first_name, subsriber.last_name)
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
                        if (subscriberSource === 'customer_matching') {
                          payload.phoneNumber = phoneNumber
                          payload.source = 'customer_matching'
                        } else if (subscriberSource === 'chat_plugin') {
                          payload.source = 'chat_plugin'
                        }
                        Pages.findOne({ _id: page._id, connected: true },
                          (err, pageFound) => {
                            if (err) logger.serverLog(TAG, err)
                            Subscribers.findOne({ senderId: sender, companyId: pageFound.companyId },
                              (err, subscriber) => {
                                if (err) logger.serverLog(TAG, err)
                                else if (subscriber === null) {
                                  // subsriber not found, create subscriber
                                  Subscribers.create(payload,
                                    (err2, subscriberCreated) => {
                                      if (err2) {
                                        logger.serverLog(TAG, err2)
                                      } else {
                                        Webhooks.findOne({ pageId: pageId }).populate('userId').exec((err, webhook) => {
                                          if (err) logger.serverLog(TAG, err)
                                          else if (webhook && webhook.isEnabled) {
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
                                      }
                                      if (subscriberSource === 'customer_matching') {
                                        updateList(phoneNumber, sender, page)
                                      }
                                      if (!(event.postback &&
                                        event.postback.title === 'Get Started')) {
                                        createSession(page, subscriberCreated,
                                          event)
                                      }
                                      require('./../../config/socketio')
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
                                } else {
                                  if (subscriberSource === 'customer_matching') {
                                    // Subscribers.update({senderId: sender}, {
                                    //   phoneNumber: req.body.entry[0].messaging[0].prior_message.identifier,
                                    //   source: 'customer_matching',
                                    //   isSubscribed: true,
                                    //   isEnabledByPage: true
                                    // }, (err, subscriber) => {
                                    //   if (err) return logger.serverLog(TAG, err)
                                    //   logger.serverLog(TAG, subscriber)
                                    // })
                                  } else if (!subscriber.isSubscribed) {
                                    // subscribing the subscriber again in case he
                                    // or she unsubscribed and removed chat
                                    Subscribers.update({ senderId: sender }, {
                                      isSubscribed: true,
                                      isEnabledByPage: true
                                    }, (err, subscriber) => {
                                      if (err) return logger.serverLog(TAG, err)
                                      logger.serverLog(TAG, subscriber)
                                    })
                                  }
                                  if (!(event.postback &&
                                    event.postback.title === 'Get Started')) {
                                    createSession(page, subscriber, event)
                                  }
                                }
                              })
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
        }

        // if event.post, the response will be of survey or poll. writing a logic to save response of poll

        if (event.postback) {
          try {
            if (event.postback.payload !== '<GET_STARTED_PAYLOAD>') {
              let resp = JSON.parse(event.postback.payload)
              if (resp.poll_id) {
                // savepoll(event)
              } else if (resp.survey_id) {
                savesurvey(event)
              } else if (resp.unsubscribe) {
                handleUnsubscribe(resp, event)
              } else if (resp.action === 'subscribe') {
                subscribeToSequence(resp.sequenceId, event)
              } else if (resp.action === 'unsubscribe') {
                unsubscribeFromSequence(resp.sequenceId, event)
              } else if (resp.action === 'waitingSubscriber') {   // This is for waiting bot subscriber
                saveToWaitingSubscribers(resp, event)
              } else {
                sendMenuReply(event)
              }
            }
          } catch (e) {
            logger.serverLog(TAG, `Parse Error : ${e}`)
            logger.serverLog(TAG,
              'Parse Error: ' + JSON.stringify(event.postback.payload))
          }
        }

        // if this is a read receipt
        if (event.read) {
          updateseenstatus(event)
        }
      }
    } else if (payload.changes) {
      logger.serverLog(TAG, 'This seems to PAGE POST OF AUTOPOSTING')
      const changeEvents = payload.changes
      for (let i = 0; i < changeEvents.length; i++) {
        const event = changeEvents[i]
        if (event.field && event.field === 'feed') {
          logger.serverLog(TAG, 'This indeed is PAGE POST OF AUTOPOSTING')
          if (event.value.verb === 'add' &&
            (['status', 'photo', 'video', 'share'].indexOf(event.value.item) >
              -1)) {
            if (event.value.item === 'share' && event.value.link) {
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

  if (req.body.object && req.body.object === 'page' && req.body.entry && req.body.entry[0] &&
    req.body.entry[0].changes && req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].field && req.body.entry[0].changes[0].field === 'name' &&
    req.body.entry[0].changes[0].value) {
    let pageId = req.body.entry[0].id
    let newPageName = req.body.entry[0].changes[0].value
    logger.serverLog(TAG, `Page name update request ${JSON.stringify(req.body)}`)
    Pages.update({ pageId: pageId }, { $set: { pageName: newPageName } }, { multi: true }, (err, page) => {
      if (err) {
        logger.serverLog(TAG, `Error in updating page name ${JSON.stringify(err)}`)
      } else {
        logger.serverLog(TAG, `Page name updated: ${JSON.stringify(page)}`)
      }
    })
  }
  return res.status(200).json({ status: 'success', description: 'got the data.' })
}
function updateList (phoneNumber, sender, page) {
  PhoneNumber.find({
    number: phoneNumber,
    hasSubscribed: true,
    pageId: page,
    companyId: page.companyId
  }, (err, number) => {
    if (err) {
    }
    if (number.length > 0) {
      let subscriberFindCriteria = {
        source: 'customer_matching',
        senderId: sender,
        isSubscribed: true,
        phoneNumber: phoneNumber,
        pageId: page._id
      }
      Subscribers.find(subscriberFindCriteria)
        .populate('pageId')
        .exec((err, subscribers) => {
          if (err) {
          }
          let temp = []
          for (let i = 0; i < subscribers.length; i++) {
            temp.push(subscribers[i]._id)
          }
          Lists.update(
            { listName: number[0].fileName, companyId: page.companyId }, {
              content: temp
            }, (err2, savedList) => {
              if (err) {
              }
            })
        })
    }
  })
}

function sendCommentReply (body) {
  let send = true
  let postId = body.entry[0].changes[0].value.post_id
  FacebookPosts.findOne({
    post_id: postId
  }).populate('pageId userId').exec((err, post) => {
    if (err) {
    }
    FacebookPosts.update({ post_id: postId }, { $inc: { count: 1 } }, (err, updated) => {
      if (err) {
      }
      logger.serverLog(TAG,
        `updated value ${JSON.stringify(updated)}`)
      logger.serverLog(TAG,
        `response from comment on facebook ${JSON.stringify(post)}`)
      if (post && post.pageId) {
        if (body.entry[0].changes[0].value.message) {
          if (post.includedKeywords && post.includedKeywords.length > 0) {
            send = false
            for (let i = 0; i < post.includedKeywords.length; i++) {
              if (body.entry[0].changes[0].value.message.toLowerCase().includes(post.includedKeywords[i].toLowerCase())) {
                logger.serverLog(TAG,
                  `inside if send value ${JSON.stringify(send)}`)
                send = true
                break
              }
            }
          }
          if (post.excludedKeywords && post.excludedKeywords.length > 0) {
            send = true
            for (let i = 0; i < post.includedKeywords.length; i++) {
              if (body.entry[0].changes[0].value.message.toLowerCase().includes(post.excludedKeywords[i].toLowerCase())) {
                send = false
                break
              }
            }
          }
        }
        logger.serverLog(TAG,
          `send value ${JSON.stringify(send)}`)
        if (send) {
          needle.get(
            `https://graph.facebook.com/v2.10/${post.pageId.pageId}?fields=access_token&access_token=${post.userId.facebookInfo.fbToken}`,
            (err, resp) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              let messageData = { message: post.reply }
              needle.post(
                `https://graph.facebook.com/${body.entry[0].changes[0].value.comment_id}/private_replies?access_token=${resp.body.access_token}`,
                messageData, (err, resp) => {
                  if (err) {
                    logger.serverLog(TAG, err)
                  }
                  logger.serverLog(TAG,
                    `response from comment on facebook 2 ${JSON.stringify(resp.body)}`)
                })
              // needle.post(
              //   `https://graph.facebook.com/${body.entry[0].changes[0].value.comment_id}/comments?access_token=${resp.body.access_token}`,
              //   messageData, (err, resp) => {
              //     if (err) {
              //       logger.serverLog(TAG, err)
              //     }
              //     logger.serverLog(TAG,
              //       `response from comment on facebook 3 ${JSON.stringify(resp.body)}`)
              //   })
            })
        }
      }
    })
  })
}

function sendAutopostingMessage (messageData, page, savedMsg) {
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
      // AutopostingMessages.update({_id: savedMsg._id}, {message_id: messageData.post_id},
      //   (err, updated) => {
      //     if (err) {
      //       logger.serverLog(TAG,
      //         `ERROR at updating AutopostingMessages ${JSON.stringify(err)}`)
      //     }
      //   })
    })
}

function handleThePagePostsForAutoPosting (event, status) {
  AutoPosting.find({ accountUniqueName: event.value.sender_id, isActive: true })
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
          if (postingItem.segmentationPageIds && postingItem.segmentationPageIds.length > 0) {
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
              isSubscribed: true,
              isEnabledByPage: true
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

                let newMsg = new AutopostingMessages({
                  pageId: page._id,
                  companyId: postingItem.companyId,
                  autoposting_type: 'facebook',
                  autopostingId: postingItem._id,
                  sent: subscribers.length,
                  message_id: event.value.post_id,
                  seen: 0,
                  clicked: 0
                })

                newMsg.save((err, savedMsg) => {
                  if (err) logger.serverLog(TAG, err)

                  if (subscribers.length > 0) {
                    utility.applyTagFilterIfNecessary({ body: postingItem }, subscribers, (taggedSubscribers) => {
                      taggedSubscribers.forEach(subscriber => {
                        let messageData = {}

                        if (event.value.item === 'status' || status) {
                          messageData = {
                            'messaging_type': 'UPDATE',
                            'recipient': JSON.stringify({
                              'id': subscriber.senderId
                            }),
                            'message': JSON.stringify({
                              'text': event.value.message,
                              'metadata': 'This is metadata'
                            })
                          }
                          // Logic to control the autoposting when last activity is less than 30 minutes
                          compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                            if (err) {
                              logger.serverLog(TAG, 'inside error')
                              return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                            }

                            if (isLastMessage) {
                              logger.serverLog(TAG, 'inside fb autoposting send')
                              sendAutopostingMessage(messageData, page, savedMsg)
                            } else {
                              // Logic to add into queue will go here
                              logger.serverLog(TAG, 'inside adding to fb autoposting queue')
                              let timeNow = new Date()
                              let automatedQueueMessage = new AutomationQueue({
                                automatedMessageId: savedMsg._id,
                                subscriberId: subscriber._id,
                                companyId: savedMsg.companyId,
                                type: 'autoposting-fb',
                                scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                              })

                              automatedQueueMessage.save((error) => {
                                if (error) {
                                  logger.serverLog(TAG, {
                                    status: 'failed',
                                    description: 'Automation Queue autoposting-fb Message create failed',
                                    error
                                  })
                                }
                              })
                            }
                          })
                        } else if (event.value.item === 'share') {
                          let URLObject = new URL({
                            originalURL: event.value.link,
                            subscriberId: subscriber._id,
                            module: {
                              id: savedMsg._id,
                              type: 'autoposting'
                            }
                          })

                          URLObject.save((err, savedurl) => {
                            if (err) logger.serverLog(TAG, err)

                            let newURL = config.domain + '/api/URL/' +
                              savedurl._id

                            messageData = {
                              'messaging_type': 'UPDATE',
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
                                        'title': (event.value.message)
                                          ? event.value.message
                                          : event.value.sender_name,
                                        'image_url': event.value.image,
                                        'subtitle': 'kibopush.com',
                                        'buttons': [
                                          {
                                            'type': 'web_url',
                                            'url': newURL,
                                            'title': 'View Link'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                }
                              })
                            }
                            // Logic to control the autoposting when last activity is less than 30 minutes
                            compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                              if (err) {
                                logger.serverLog(TAG, 'inside error')
                                return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                              }

                              if (isLastMessage) {
                                logger.serverLog(TAG, 'inside fb autoposting send')
                                sendAutopostingMessage(messageData, page, savedMsg)
                              } else {
                                // Logic to add into queue will go here
                                logger.serverLog(TAG, 'inside adding to fb autoposting queue')
                                let timeNow = new Date()
                                let automatedQueueMessage = new AutomationQueue({
                                  automatedMessageId: savedMsg._id,
                                  subscriberId: subscriber._id,
                                  companyId: savedMsg.companyId,
                                  type: 'autoposting-fb',
                                  scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                })

                                automatedQueueMessage.save((error) => {
                                  if (error) {
                                    logger.serverLog(TAG, {
                                      status: 'failed',
                                      description: 'Automation Queue autoposting-fb Message create failed',
                                      error
                                    })
                                  }
                                })
                              }
                            })
                          })
                        } else if (event.value.item === 'photo') {
                          let URLObject = new URL({
                            originalURL: 'https://www.facebook.com/' +
                              event.value.sender_id,
                            subscriberId: subscriber._id,
                            module: {
                              id: savedMsg._id,
                              type: 'autoposting'
                            }
                          })

                          URLObject.save((err, savedurl) => {
                            if (err) logger.serverLog(TAG, err)

                            let newURL = config.domain + '/api/URL/' +
                              savedurl._id
                            messageData = {
                              'messaging_type': 'UPDATE',
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
                                        'title': (event.value.message)
                                          ? event.value.message
                                          : event.value.sender_name,
                                        'image_url': event.value.link,
                                        'subtitle': 'kibopush.com',
                                        'buttons': [
                                          {
                                            'type': 'web_url',
                                            'url': newURL,
                                            'title': 'View Page'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                }
                              })
                            }
                            // Logic to control the autoposting when last activity is less than 30 minutes
                            compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                              if (err) {
                                logger.serverLog(TAG, 'inside error')
                                return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                              }

                              if (isLastMessage) {
                                logger.serverLog(TAG, 'inside fb autoposting send')
                                sendAutopostingMessage(messageData, page, savedMsg)
                              } else {
                                // Logic to add into queue will go here
                                logger.serverLog(TAG, 'inside adding to fb autoposting queue')
                                let timeNow = new Date()
                                let automatedQueueMessage = new AutomationQueue({
                                  automatedMessageId: savedMsg._id,
                                  subscriberId: subscriber._id,
                                  companyId: savedMsg.companyId,
                                  type: 'autoposting-fb',
                                  scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                })

                                automatedQueueMessage.save((error) => {
                                  if (error) {
                                    logger.serverLog(TAG, {
                                      status: 'failed',
                                      description: 'Automation Queue autoposting-fb Message create failed',
                                      error
                                    })
                                  }
                                })
                              }
                            })
                          })
                        } else if (event.value.item === 'video') {
                          messageData = {
                            'messaging_type': 'UPDATE',
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
                          // Logic to control the autoposting when last activity is less than 30 minutes
                          compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                            if (err) {
                              logger.serverLog(TAG, 'inside error')
                              return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                            }

                            if (isLastMessage) {
                              logger.serverLog(TAG, 'inside fb autoposting send')
                              sendAutopostingMessage(messageData, page, savedMsg)
                            } else {
                              // Logic to add into queue will go here
                              logger.serverLog(TAG, 'inside adding to fb autoposting queue')
                              let timeNow = new Date()
                              let automatedQueueMessage = new AutomationQueue({
                                automatedMessageId: savedMsg._id,
                                subscriberId: subscriber._id,
                                companyId: savedMsg.companyId,
                                type: 'autoposting-fb',
                                scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                              })

                              automatedQueueMessage.save((error) => {
                                if (error) {
                                  logger.serverLog(TAG, {
                                    status: 'failed',
                                    description: 'Automation Queue autoposting-fb Message create failed',
                                    error
                                  })
                                }
                              })
                            }
                          })
                        }

                        let newSubscriberMsg = new AutopostingSubscriberMessages({
                          pageId: page.pageId,
                          companyId: postingItem.companyId,
                          autopostingId: postingItem._id,
                          autoposting_messages_id: savedMsg._id,
                          subscriberId: subscriber.senderId
                        })

                        newSubscriberMsg.save((err, savedSubscriberMsg) => {
                          if (err) logger.serverLog(TAG, err)
                        })
                      })
                    })
                  }
                })
              })
          })
        })
      })
    })
}

// eslint-disable-next-line no-unused-vars
function handleMessageFromSomeOtherApp (event) {
  logger.serverLog(TAG, 'going to save message coming from other app')
  const pageId = event.sender.id
  const receiverId = event.recipient.id
  // get accesstoken of page
  Pages.find({ pageId: pageId, connected: true })
    .populate('userId')
    .exec((err, pages) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      pages.forEach((page) => {
        const options = {
          url: `https://graph.facebook.com/v2.6/${receiverId}?access_token=${page.accessToken}`,
          qs: { access_token: page.accessToken },
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
            Subscribers.findOne({ senderId: receiverId }, (err, subscriber) => {
              if (err) logger.serverLog(TAG, err)
              if (subscriber === null) {
                // subsriber not found, create subscriber
                Subscribers.create(payload, (err2, subscriberCreated) => {
                  if (err2) {
                    logger.serverLog(TAG, err2)
                  }
                  if (!(event.postback &&
                    event.postback.title === 'Get Started')) {
                    createSession(page, subscriberCreated, event)
                  }
                  require('./../../config/socketio').sendMessageToClient({
                    room_id: page.companyId,
                    body: {
                      action: 'new_subscriber',
                      payload: {
                        name: subscriberCreated.firstName + ' ' +
                          subscriberCreated.lastName,
                        subscriber: subscriberCreated
                      }
                    }
                  })
                })
              } else {
                if (!(event.postback &&
                  event.postback.title === 'Get Started')) {
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
  CompanyProfile.findOne({ _id: page.companyId },
    function (err, company) {
      if (err) {
        return logger.serverLog(TAG, err)
      }

      if (!(company.automated_options === 'DISABLE_CHAT')) {
        Sessions.findOne({ page_id: page._id, subscriber_id: subscriber._id },
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

  Webhooks.findOne({ pageId: page.pageId }).populate('userId').exec((err, webhook) => {
    if (err) logger.serverLog(TAG, err)
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
    require('./../../config/socketio').sendMessageToClient({
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

function addAdminAsSubscriber (payload) {
  Users.findOne({ _id: payload.messaging[0].optin.ref }, (err, user) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    CompanyUsers.findOne({ domain_email: user.domain_email },
      (err, companyUser) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        Pages.findOne({ pageId: payload.id, companyId: companyUser.companyId },
          (err, page) => {
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
  logger.serverLog(TAG, `Seen Count Update ${JSON.stringify(req)}`)
  BroadcastPage.update(
    { pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
    { seen: true },
    { multi: true }, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  PollPage.update(
    { pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
    { seen: true },
    { multi: true }, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  SurveyPage.update(
    { pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
    { seen: true },
    { multi: true }, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
    })
  LiveChat.update(
    {
      sender_fb_id: req.recipient.id,
      recipient_fb_id: req.sender.id,
      seen: false,
      datetime: { $lte: new Date(req.read.watermark) }
    },
    { seenDateTime: new Date(req.read.watermark), seen: true },
    { multi: true }, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      LiveChat.findOne({ sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id }, (err, chat) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }
        logger.serverLog(TAG, `CHAT ${req.recipient.id} ${req.sender.id} ${JSON.stringify(chat)}`)
        if (chat) {
          require('./../../config/socketio').sendMessageToClient({
            room_id: chat.company_id,
            body: {
              action: 'message_seen',
              payload: {
                session_id: chat.session_id
              }
            }
          })
        }
      })
    })
  // updating seen count for autoposting
  AutopostingSubscriberMessages.distinct('autoposting_messages_id',
    { subscriberId: req.sender.id, pageId: req.recipient.id, seen: false },
    (err, AutopostingMessagesIds) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      AutopostingSubscriberMessages.update(
        {
          subscriberId: req.sender.id,
          pageId: req.recipient.id,
          seen: false,
          datetime: { $lte: new Date(req.read.watermark) }
        },
        { seen: true },
        { multi: true }, (err, updated) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }

          AutopostingMessagesIds.forEach(autopostingMessagesId => {
            AutopostingMessages.update(
              { _id: autopostingMessagesId },
              { $inc: { seen: 1 } },
              { multi: true }, (err, updated) => {
                if (err) {
                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                }
              })
          })
        })
    })
  // updating seen count for sequence messages
  Subscribers.findOne({ senderId: req.sender.id }).exec((err, subscriber) => {
    if (err) {
      return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    if (subscriber) {
      SequenceSubscriberMessages.distinct('messageId',
       {subscriberId: subscriber._id, seen: false},
        (err, sequenceMessagesIds) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          logger.serverLog('MessageIds', `${JSON.stringify(sequenceMessagesIds)}`)
          logger.serverLog('DateTime', `${JSON.stringify(new Date(req.read.watermark))}`)
          SequenceSubscriberMessages.update(
            {
              subscriberId: subscriber._id,
              seen: false,
              datetime: {$lte: new Date(req.read.watermark)}
            },
           {seen: true},
           {multi: true}, (err, updated) => {
             if (err) {
               logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
             }

             sequenceMessagesIds.forEach(sequenceMessagesId => {
               SequenceMessages.update(
                 {_id: sequenceMessagesId},
                 {$inc: {seen: 1}},
                 {multi: true}, (err, updated) => {
                   if (err) {
                     logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                   }
                 })
             })
           })
        })
    }
  })
}

function sendMenuReply (req) {
  let parsedData = JSON.parse(req.postback.payload)
  Subscribers.findOne({ senderId: req.sender.id }).exec((err, subscriber) => {
    if (err) {
      return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
    }
    Pages.findOne({ pageId: req.recipient.id, connected: true }, (err, page) => {
      if (err) {
        return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      }
       // sending last parameter because to incorporate the changed getBatchData method
      utility.getBatchData(parsedData, subscriber.senderId, page, sendBroadcast, subscriber.firstName, subscriber.lastName, 'menu')
    })
  })
}

function savepoll (req, resp) {
  // find subscriber from sender id
  // var resp = JSON.parse(req.postback.payload)
  var temp = true
  Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber ${JSON.stringify(
          err)}`)
    }
    if (!subscriber || subscriber._id === null) {
      return
    }
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        if (mongoose.Types.ObjectId(array[i].pollId) ===
          mongoose.Types.ObjectId(resp.poll_id) &&
          mongoose.Types.ObjectId(array[i].subscriberId) ===
          mongoose.Types.ObjectId(subscriber._id)) {
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
    Webhooks.findOne({ pageId: req.recipient.id }).populate('userId').exec((err, webhook) => {
      logger.serverLog(TAG, `webhook ${webhook}`)
      if (err) logger.serverLog(TAG, err)
      if (webhook && webhook.isEnabled) {
        needle.get(webhook.webhook_url, (err, r) => {
          if (err) {
            logger.serverLog(TAG, err)
            logger.serverLog(TAG, `response ${r.statusCode}`)
          } else if (r.statusCode === 200) {
            if (webhook && webhook.optIn.POLL_RESPONSE) {
              var data = {
                subscription_type: 'POLL_RESPONSE',
                payload: JSON.stringify({ sender: req.sender, recipient: req.recipient, timestamp: req.timestamp, message: req.message })
              }
              logger.serverLog(TAG, `data for poll response ${data}`)
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
    Subscribers.update({ senderId: req.sender.id },
      { isSubscribed: false }, (err) => {
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
        messaging_type: 'RESPONSE',
        recipient: { id: req.sender.id }, // this is the subscriber id
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
          Subscribers.find({ senderId: req.sender.id, unSubscribedBy: 'subscriber' }, (err, subscribers) => {
            if (err) {
              logger.serverLog(TAG,
                `Subscribers update subscription: ${JSON.stringify(
                  err)}`)
            }
            if (subscribers.length > 0) {
              messageData = {
                text: 'You have subscribed to our broadcasts. Send "stop" to unsubscribe'
              }
              Subscribers.update({ senderId: req.sender.id },
                { isSubscribed: true }, (err) => {
                  if (err) {
                    logger.serverLog(TAG,
                      `Subscribers update subscription: ${JSON.stringify(
                        err)}`)
                  }
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
                Subscribers.findOne({ senderId: req.sender.id },
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
                      Webhooks.findOne({ pageId: page.pageId }).populate('userId').exec((err, webhook) => {
                        if (err) logger.serverLog(TAG, err)
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
}
function savesurvey (req) {
  // this is the response of survey question
  // first save the response of survey
  // find subscriber from sender id
  var resp = JSON.parse(req.postback.payload)

  Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber${JSON.stringify(
          err)}`)
    }

    // eslint-disable-next-line no-unused-vars
    const surveybody = {
      response: resp.option, // response submitted by subscriber
      surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id
    }
    Webhooks.findOne({ pageId: req.recipient.id }).populate('userId').exec((err, webhook) => {
      if (err) logger.serverLog(TAG, err)
      if (webhook && webhook.isEnabled) {
        needle.get(webhook.webhook_url, (err, r) => {
          if (err) {
            logger.serverLog(TAG, err)
          } else if (r.statusCode === 200) {
            if (webhook && webhook.optIn.SURVEY_RESPONSE) {
              var data = {
                subscription_type: 'SURVEY_RESPONSE',
                payload: JSON.stringify({ sender: req.sender, recipient: req.recipient, timestamp: req.timestamp, response: resp.option, surveyId: resp.survey_id, questionId: resp.question_id })
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
    SurveyResponse.update({
      surveyId: resp.survey_id,
      questionId: resp.question_id,
      subscriberId: subscriber._id
    }, { response: resp.option, datetime: Date.now() }, { upsert: true }, (err1, surveyresponse, raw) => {
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
        _id: { $gt: resp.question_id }
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
                messaging_type: 'RESPONSE',
                recipient: { id: req.sender.id }, // this is the subscriber id
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
          Surveys.update({ _id: mongoose.Types.ObjectId(resp.survey_id) },
            { $inc: { isresponded: 1 - surveyresponse.nModified } },
            (err, subscriber) => {
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
                messaging_type: 'RESPONSE',
                recipient: { id: req.sender.id }, // this is the subscriber id
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

function subscribeToSequence (sequenceId, req) {
  Sequences.findOne({ _id: sequenceId }, (err, sequence) => {
    if (err) {
      logger.serverLog(TAG,
        `Internal Server Error ${JSON.stringify(err)}`)
    }

    Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
      if (err) {
        logger.serverLog(TAG,
          `Internal Server Error ${JSON.stringify(err)}`)
      }

      SequenceSubscribers.findOne({ subscriberId: subscriber._id }, (err, sequenceSubscriber) => {
        if (err) {
          logger.serverLog(TAG,
            `Internal Server Error ${JSON.stringify(err)}`)
        }

        // CASE-1 Subscriber already exists
        if (sequenceSubscriber !== {} && sequenceSubscriber !== null) {
          SequenceSubscribers.update({ _id: sequenceSubscriber._id }, { status: 'subscribed' }, (err, updated) => {
            if (err) {
              logger.serverLog(TAG,
                `Internal Server Error ${JSON.stringify(err)}`)
            }
          })
          // CASE-2 Subscriber doesn't exist
        } else {
          SequenceMessages.find({sequenceId: sequenceId}, (err, messages) => {
            if (err) {
              return {
                status: 'Failed',
                description: 'Failed to insert record'
              }
            }

            messages.forEach(message => {
              if (message.schedule.condition === 'immediately') {
                // console.log('we will use the sending script here')
              } else {
                let sequenceQueuePayload = {
                  sequenceId: sequenceId,
                  subscriberId: subscriber._id,
                  companyId: subscriber.companyId,
                  sequenceMessageId: message._id,
                  queueScheduledTime: message.schedule.date,    // Needs to be updated after #3704
                  isActive: message.isActive
                }

                const sequenceMessageForQueue = new SequenceMessageQueue(sequenceQueuePayload)
                sequenceMessageForQueue.save((err, messageQueueCreated) => {
                  if (err) {
                    return {
                      status: 'Failed',
                      description: 'Failed to insert record in Queue'
                    }
                  }
                }) //  save ends here
              }  // else ends here
            })  // Messages Foreach ends here

            let sequenceSubscriberPayload = {
              sequenceId: sequenceId,
              subscriberId: subscriber._id,
              companyId: sequence.companyId,
              status: 'subscribed'
            }
            const sequenceSubcriber = new SequenceSubscribers(sequenceSubscriberPayload)

            // save model to MongoDB
            sequenceSubcriber.save((err, subscriberCreated) => {
              if (err) {
                logger.serverLog(TAG,
                  `Failed to insert record`)
              }
              require('./../../config/socketio').sendMessageToClient({
                room_id: sequence.companyId,
                body: {
                  action: 'sequence_update',
                  payload: {
                    sequence_id: sequenceId
                  }
                }
              })
            })
          })
        }
      })
    })
  })
}

function unsubscribeFromSequence (sequenceId, req) {
  Sequences.findOne({ _id: sequenceId }, (err, sequence) => {
    if (err) {
      logger.serverLog(TAG,
        `Internal Server Error ${JSON.stringify(err)}`)
    }

    Subscribers.findOne({ senderId: req.sender.id }, (err, subscriber) => {
      if (err) {
        logger.serverLog(TAG,
          `Internal Server Error ${JSON.stringify(err)}`)
      }

      SequenceSubscribers.remove({sequenceId: sequenceId})
      .where('subscriberId').equals(subscriber._id)
      .exec((err, updated) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        }

        SequenceMessageQueue.deleteMany({sequenceId: sequenceId, subscriberId: subscriber._id}, (err, result) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }

          require('./../../config/socketio').sendMessageToClient({
            room_id: sequence.companyId,
            body: {
              action: 'sequence_update',
              payload: {
                sequence_id: sequenceId
              }
            }
          })
        })
      })
    })
  })
}

function saveToWaitingSubscribers (payload, req) {
  WaitingSubscriber.findOne({subscriberId: payload.subscriberId, botId: payload.botId}, (err, waitingSubscriber) => {
    if (err) {
      logger.serverLog(TAG, `INTERNAL SERVER ERROR ${JSON.stringify(err)}`)
    }

    if (waitingSubscriber) {
      logger.serverLog(TAG, 'subscriber is already in waiting queue')
      sendWaitingSubResponse('Agent will reply you soon', payload.pageId, payload.subscriberId)
    } else {
      Pages.findOne({pageId: payload.pageId}, (err, page) => {
        if (err) {
          logger.serverLog(TAG, `INTERNAL SERVER ERROR ${JSON.stringify(err)}`)
        }

        let waitingSubscriberPayload = {
          botId: payload.botId,
          subscriberId: payload.subscriberId,
          pageId: page._id,
          intentId: payload.intentId,
          Question: payload.Question
        }
        let waitingSubscriber = new WaitingSubscriber(waitingSubscriberPayload)
        waitingSubscriber.save((err, result) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }

          logger.serverLog(TAG, result)
          sendWaitingSubResponse('Agent will contact you soon', payload.pageId, payload.subscriberId)
        })
      })
    }
  })
}

function sendWaitingSubResponse (message, pageId, subscriberId) {
  Subscribers.findOne({_id: subscriberId}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      return
    }
    if (subscriber === null) {
      return
    }
    logger.serverLog(TAG, `Subscriber Info ${JSON.stringify(subscriber)}`)
    let messageData = utility.prepareSendAPIPayload(
                  subscriber.senderId,
                   {'componentType': 'text', 'text': message + '  (Bot)'}, subscriber.firstName, subscriber.lastName, true)
    Pages.findOne({pageId: pageId}, (err, page) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      request(
        {
          'method': 'POST',
          'json': true,
          'formData': messageData,
          'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                page.accessToken
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
                    logger.serverLog(TAG, 'Response sent to Messenger: ' + message)
                  }
                }
              })
    })
  })
}
