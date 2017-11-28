/**
 * Created by sojharo on 27/07/2017.
 */
//
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
const utility = require('./broadcasts.utility')
const mongoose = require('mongoose')
const og = require('open-graph')
let _ = require('lodash')
const TAG = 'api/broadcast/broadcasts.controller.js'
const needle = require('needle')
const request = require('request')
var array = []

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Broadcasts get api is working')
  Broadcasts.find({userId: req.user._id}, (err, broadcasts) => {
    if (err) {
      return res.status(404)
        .json({status: 'failed', description: 'Broadcasts not found'})
    }
    logger.serverLog(TAG, `Total broadcasts ${broadcasts.length}`)
    BroadcastPage.find({userId: req.user._id}, (err, broadcastpages) => {
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

// webhook for facebook
exports.getfbMessage = function (req, res) {
  // This is body in chatwebhook {"object":"page","entry":[{"id":"1406610126036700","time":1501650214088,"messaging":[{"recipient":{"id":"1406610126036700"},"timestamp":1501650214088,"sender":{"id":"1389982764379580"},"postback":{"payload":"{\"poll_id\":121212,\"option\":\"option1\"}","title":"Option 1"}}]}]}

// {"sender":{"id":"1230406063754028"},"recipient":{"id":"272774036462658"},"timestamp":1504089493225,"read":{"watermark":1504089453074,"seq":0}}

  logger.serverLog(TAG,
    `something received from facebook ${JSON.stringify(req.body)}`)
  if (req.body.object && req.body.object === 'page') {
    let payload = req.body.entry[0]
    if (payload.messaging) {
      if (payload.messaging[0].optin) {
        addAdminAsSubscriber(payload)
        return
      }
      const messagingEvents = payload.messaging

      for (let i = 0; i < messagingEvents.length; i++) {
        const event = req.body.entry[0].messaging[i]
        if (event.message &&
          (event.message.is_echo === false || !event.message.is_echo)) {
          const sender = event.sender.id
          const pageId = event.recipient.id
          logger.serverLog(TAG, `getfbmsg ${JSON.stringify(event)}`)
          // get accesstoken of page
          Pages.findOne({pageId: pageId})
            .populate('userId')
            .exec((err, page) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              // fetch subsriber info from Graph API
              // fetch customer details
              if (page === null) {
                return
              }
              logger.serverLog(TAG, `page got ${page.pageName}`)
              const options = {
                url: `https://graph.facebook.com/v2.6/${sender}?access_token=${page.accessToken}`,
                qs: {access_token: page.accessToken},
                method: 'GET'

              }
              needle.get(options.url, options, (error, response) => {
                const subsriber = response.body
                // const options1 = {
                //   url: `https://graph.facebook.com/v2.10/${subsriber.id}?fields=cover}`,
                //   qs: {access_token: page.accessToken},
                //   method: 'GET'
                //
                // }
                // needle.get(options1.url, options1, (error1, response1) => {
                //  const coverphoto = response1.body
                //  logger.serverLog(TAG, `data of subscriber ${JSON.stringify(subsriber)}`)
                //  logger.serverLog(TAG, `cover photo of subscriber ${JSON.stringify(coverphoto)}`)
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
                    //  coverPhoto: coverphoto.source,
                    pageScopedId: '',
                    email: '',
                    senderId: sender,
                    pageId: page._id,
                    isSubscribed: true
                  }

                  Subscribers.findOne({senderId: sender}, (err, subscriber) => {
                    if (err) logger.serverLog(TAG, err)
                    if (subscriber === null) {
                      // subsriber not found, create subscriber
                      Subscribers.create(payload, (err2, subscriberCreated) => {
                        if (err2) {
                          logger.serverLog(TAG, err2)
                        }
                        logger.serverLog(TAG, 'new Subscriber added')
                        createSession(page, subscriberCreated, event)
                      })
                    } else {
                      createSession(page, subscriber, event)
                    }
                  })
                } else {
                  logger.serverLog(TAG, `ERROR ${JSON.stringify(error)}`)
                }
                //  })
                sendautomatedmsg(event, page)
              })
            })
        }

        // if event.post, the response will be of survey or poll. writing a logic to save response of poll
        if (event.postback) {
          logger.serverLog(TAG, JSON.stringify(event.postback))
          let resp = JSON.parse(event.postback.payload)
          if (resp.poll_id) {
            savepoll(event)
          } else if (resp.survey_id) {
            savesurvey(event)
          } else {
          }
        }

        // if this is a read receipt
        if (event.read) {
          updateseenstatus(event)
        }
      }
    } else if (payload.changes) {
      const changeEvents = payload.changes
      // logger.serverLog(TAG,
      //   `in changes condition for facebook post ${JSON.stringify(
      //     changeEvents)}`)
      for (let i = 0; i < changeEvents.length; i++) {
        const event = changeEvents[i]
        if (event.field && event.field === 'feed') {
          if (event.value.verb === 'add' && event.value.item === 'status') {
            AutoPosting.find({accountUniqueName: event.value.sender_id})
              .populate('userId')
              .exec((err, autopostings) => {
                if (err) {
                  return logger.serverLog(TAG,
                    'Internal Server Error on connect')
                }
                logger.serverLog(TAG,
                  `Autoposting records got for fb : ${autopostings.length}`)
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
                    logger.serverLog(TAG,
                      `Pages records got for fb : ${pages.length}`)
                    pages.forEach(page => {
                      logger.serverLog(TAG,
                        `Page in the loop for fb ${page.pageName}`)

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

                      logger.serverLog(TAG,
                        `Subscribers Criteria for segmentation ${JSON.stringify(
                          subscriberFindCriteria)}`)
                      Subscribers.find(subscriberFindCriteria,
                        (err, subscribers) => {
                          if (err) {
                            return logger.serverLog(TAG,
                              `Error ${JSON.stringify(err)}`)
                          }

                          logger.serverLog(TAG,
                            `Total Subscribers of page ${page.pageName} are ${subscribers.length}`)

                          subscribers.forEach(subscriber => {
                            let messageData = {
                              'recipient': JSON.stringify({
                                'id': subscriber.senderId
                              }),
                              'message': JSON.stringify({
                                'text': event.value.message,
                                'metadata': 'This is a meta data for tweet'
                              })
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
                    })
                  })
                })
              })
          }
        }
      }
    }
  }

  return res.status(200).json({status: 'success', description: 'got the data.'})
}

function createSession (page, subscriber, event) {
  Sessions.findOne({page_id: page._id, subscriber_id: subscriber._id},
    (err, session) => {
      if (err) logger.serverLog(TAG, err)
      if (session === null) {
        let newSession = new Sessions({
          subscriber_id: subscriber._id,
          page_id: page._id,
          company_id: page.userId._id
        })
        newSession.save((err, sessionSaved) => {
          if (err) logger.serverLog(TAG, err)
          logger.serverLog(TAG, 'new session created')
          saveLiveChat(page, subscriber, sessionSaved, event)
        })
      } else {
        saveLiveChat(page, subscriber, session, event)
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
    company_id: page.userId._id,
    status: 'unseen', // seen or unseen
    payload: event.message
  }
  let urlInText = utility.parseUrl(event.message.text)
  if (urlInText !== null && urlInText !== '') {
    og(urlInText, function (err, meta) {
      if (err) return logger.serverLog(TAG, err)
      chatPayload.url_meta = meta
      saveChatInDb(page, session, chatPayload, subscriber)
    })
  } else {
    saveChatInDb(page, session, chatPayload, subscriber)
  }
}

function saveChatInDb (page, session, chatPayload, subscriber) {
  let newChat = new LiveChat(chatPayload)
  newChat.save((err, chat) => {
    if (err) return logger.serverLog(TAG, err)
    require('./../../config/socketio').sendChatToAgents({
      room_id: page.userId._id,
      payload: {
        session_id: session._id,
        chat_id: chat._id,
        text: chatPayload.payload.text,
        name: subscriber.firstName + ' ' + subscriber.lastName,
        subscriber: subscriber
      }
    })
    logger.serverLog(TAG, 'new chat message saved')
  })
}

function addAdminAsSubscriber (payload) {
  Pages.update(
    {pageId: payload.id, userId: payload.messaging[0].optin.ref},
    {adminSubscriberId: payload.messaging[0].sender.id},
    {multi: false}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG,
        `The subscriber id of admin is added to the page ${JSON.stringify(
          updated)}`)
    })
}

function updateseenstatus (req) {
  logger.serverLog(TAG, `Inside update seen status ${JSON.stringify(req)}`)
  BroadcastPage.update(
    {pageId: req.recipient.id, subscriberId: req.sender.id},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG,
        `Broadcast seen updated : ${JSON.stringify(
          updated)}`)
    })
  PollPage.update(
    {pageId: req.recipient.id, subscriberId: req.sender.id},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG,
        `Poll seen updated : ${JSON.stringify(
          updated)}`)
    })
  SurveyPage.update(
    {pageId: req.recipient.id, subscriberId: req.sender.id},
    {seen: true},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG,
        `Survey seen updated : ${JSON.stringify(
          updated)}`)
    })
  LiveChat.update(
    {sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id},
    {status: 'seen'},
    {multi: true}, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG,
        `LiveChat seen updated : ${JSON.stringify(
          updated)}`)
    })
}

function savepoll (req) {
  // find subscriber from sender id
  logger.serverLog(TAG, `Inside savepoll ${JSON.stringify(req)}`)
  var resp = JSON.parse(req.postback.payload)
  var temp = true
  Subscribers.findOne({senderId: req.sender.id}, (err, subscriber) => {
    if (err) {
      logger.serverLog(TAG,
        `Error occurred in finding subscriber ${JSON.stringify(
          err)}`)
    }
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        console.log('responses from polls', array[i].subscriberId)
        console.log('responses from polls', subscriber._id)
        console.log('responses from polls', array[i].pollId)
        console.log('responses from polls', resp.poll_id)
        if (mongoose.Types.ObjectId(array[i].pollId) === mongoose.Types.ObjectId(resp.poll_id) && mongoose.Types.ObjectId(array[i].subscriberId) === mongoose.Types.ObjectId(subscriber._id)) {
          console.log('condition true')
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
    console.log('temp', temp)
    if (temp === true) {
      PollResponse.create(pollbody, (err, pollresponse) => {
        if (err) {
          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
        } else {
          logger.serverLog(TAG, `Poll created ${JSON.stringify(pollresponse)}`)
          array.push(pollbody)
        }
      })
    }
  })
}

function sendautomatedmsg (req, page) {
  logger.serverLog(TAG, 'send_automated_msg called')
  Workflows.find({userId: page.userId._id, isActive: true})
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
      if (req.message.text) {
        var index = -3
        for (let i = 0; i < workflows.length; i++) {
          var userMsg = req.message.text
          var words = userMsg.trim().split(' ')

          if (userMsg.toLowerCase() === 'stop' ||
            userMsg.toLowerCase() === 'unsubscribe') {
            index = -101
            break
          }
          if (userMsg.toLowerCase() === 'start' ||
            userMsg.toLowerCase() === 'subscribe') {
            index = -111
            break
          }

          logger.serverLog(TAG,
            `User message is ${userMsg} compared with ${JSON.stringify(
              workflows[i].keywords)}`)

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
          `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${page.userId.fbToken}`,
          (err3, response) => {
            if (err3) {
              logger.serverLog(TAG,
                `Page token error from graph api ${JSON.stringify(err3)}`)
            }

            logger.serverLog(TAG, `value of index is ${index}`)
            index++
            if (index) {
              index--
              logger.serverLog(TAG, `value of index is ${index}`)
              let messageData = {}
              if (index === -101) {
                messageData = {
                  text: 'You have unsubscribed from our broadcasts. Send "Start" to subscribe again.'
                }
                Subscribers.update({senderId: req.sender.id},
                  {isSubscribed: false}, (err) => {
                    if (err) {
                      logger.serverLog(TAG,
                        `Subscribers update subscription: ${JSON.stringify(
                          err)}`)
                    }
                    logger.serverLog(TAG,
                      `subscription removed for ${req.sender.id}`)
                  })
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
                    logger.serverLog(TAG,
                      `subscription renewed for ${req.sender.id}`)
                  })
              } else if (index > -1) {
                logger.serverLog(TAG,
                  `workflow reply being sent ${workflows[index].reply}`)
                messageData = {
                  text: workflows[index].reply
                }
              }

              const data = {
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  logger.serverLog(TAG,
                    `Sending workflow response to subscriber response ${JSON.stringify(
                      respp.body)}`)

                  Subscribers.findOne({senderId: req.sender.id},
                    (err, subscriber) => {
                      if (err) return logger.serverLog(TAG, err)
                      if (!subscriber) {
                        return logger.serverLog(TAG,
                          `No subscriber was found for workflow`)
                      }
                      Sessions.findOne({
                        subscriber_id: subscriber._id,
                        page_id: page._id,
                        company_id: page.userId._id
                      }, (err, session) => {
                        if (err) {
                          return logger.serverLog(TAG,
                            `At get session ${JSON.stringify(err)}`)
                        }
                        if (!session) {
                          return logger.serverLog(TAG,
                            `No chat session was found for workflow`)
                        }
                        // const chatMessage = new LiveChat({
                        //   sender_id: page._id, // this is the page id: _id of Pageid
                        //   recipient_id: subscriber._id, // this is the subscriber id: _id of subscriberId
                        //   sender_fb_id: page.pageId, // this is the (facebook) :page id of pageId
                        //   recipient_fb_id: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                        //   session_id: session._id,
                        //   company_id: page.userId._id, // this is admin id till we have companies
                        //   payload: {
                        //     componentType: 'text',
                        //     text: messageData.text
                        //   }, // this where message content will go
                        //   status: 'unseen' // seen or unseen
                        // })
                        // chatMessage.save((err, chatMessageSaved) => {
                        //   if (err) {
                        //     return logger.serverLog(TAG,
                        //       `At save chat${JSON.stringify(err)}`)
                        //   }
                        //   logger.serverLog(TAG,
                        //     'Chat message saved for workflow sent')
                        // })
                      })
                    })
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

    SurveyResponse.create(surveybody, (err1, surveyresponse) => {
      if (err1) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err1)}`)
      }
      //  Surveys.update({ _id: mongoose.Types.ObjectId(resp.survey_id) }, { $set: { isresponded: true } })
      // send the next question
      logger.serverLog(TAG,
        `survey respnse create ${JSON.stringify(resp.survey_id)}`)
      SurveyQuestions.find({
        surveyId: resp.survey_id,
        _id: {$gt: resp.question_id}
      }).populate('surveyId').exec((err2, questions) => {
        if (err2) {
          logger.serverLog(TAG, `Survey questions not found ${JSON.stringify(
            err2)}`)
        }
        logger.serverLog(TAG,
          `Questions are ${JSON.stringify(questions)}`)
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
          logger.serverLog(TAG,
              `buttons created${JSON.stringify(buttons)}`)
          needle.get(
            `https://graph.facebook.com/v2.10/${req.recipient.id}?fields=access_token&access_token=${resp.userToken}`,
            (err3, response) => {
              if (err3) {
                logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(
                    err3)}`)
              }

              logger.serverLog(TAG,
                `Page accesstoken from graph api ${JSON.stringify(
                  response.body)}`)
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
              logger.serverLog(TAG, messageData)
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  logger.serverLog(TAG,
                    `Sending survey to subscriber response ${JSON.stringify(
                      respp.body)}`)
                  if (err4) {

                  }
                })
            })
        } else { // else send thank you message
          Surveys.update({_id: mongoose.Types.ObjectId(resp.survey_id)}, {$inc: {isresponded: 1}}, (err, subscriber) => {
            if (err) {
              logger.serverLog(TAG,
                `Error occurred in finding subscriber${JSON.stringify(
                  err)}`)
            }
            logger.serverLog(TAG,
              `updated${JSON.stringify(subscriber)}`)
            Surveys.find({}, (err, subscriber) => {
              if (err) {
                logger.serverLog(TAG,
                  `Error occurred in finding subscriber${JSON.stringify(
                    err)}`)
              }
              logger.serverLog(TAG,
                `all surveys with particular id${JSON.stringify(subscriber)}`)
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

              logger.serverLog(TAG,
                `Page accesstoken from graph api ${JSON.stringify(
                  response.body)}`)
              const messageData = {
                text: 'Thank you. Response submitted successfully.'
              }
              const data = {
                recipient: {id: req.sender.id}, // this is the subscriber id
                message: messageData
              }
              logger.serverLog(TAG, messageData)
              needle.post(
                `https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`,
                data, (err4, respp) => {
                  logger.serverLog(TAG,
                    `Sending survey to subscriber response ${JSON.stringify(
                      respp.body)}`)
                  if (err4) {
                  }
                })
            })
        }
      })
    })
  })
}
