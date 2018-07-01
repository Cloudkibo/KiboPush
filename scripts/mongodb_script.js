const mongoose = require('mongoose')
const logger = require('../server/components/logger')
const config = require('../server/config/environment')
const AutomationQueue = require('../server/api/automation_queue/automation_queue.model')
const SurveyQuestions = require('../server/api/surveys/surveyquestions.model')
const Surveys = require('../server/api/surveys/surveys.model')
const Pages = require('../server/api/pages/Pages.model')
const Users = require('../server/api/user/Users.model')
const Lists = require('../server/api/lists/lists.model')
const Subscribers = require('../server/api/subscribers/Subscribers.model')
const SurveyPage = require('../server/api/page_survey/page_survey.model')
const PollPage = require('../server/api/page_poll/page_poll.model')
const Polls = require('../server/api/polls/Polls.model')
const TAG = 'scripts/monodb_script.js'

let _ = require('lodash')

const needle = require('needle')
const utility = require('../server/api/broadcasts/broadcasts.utility')
const compUtility = require('../server/components/utility')

mongoose.connect(config.mongo.uri)

AutomationQueue.find({}, (err, data) => {
  if (err) {
    return logger.serverLog(TAG, `queue messages not found ${JSON.stringify(err)}`)
  }
  if (data) {
    data.forEach((message) => {
      if (message.scheduledTime.getTime() < new Date().getTime()) {
        if (message.type === 'survey') {
          /* Getting the company user who has connected the facebook account */
          Pages.findOne({ companyId: message.companyId, connected: true }, (err, userPage) => {
            if (err) {
              logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
              return {
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              }
            }

            Users.findOne({ _id: userPage.userId }, (err, connectedUser) => {
              if (err) {
                return {
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                }
              }
              var currentUser = connectedUser

              /*
              Expected request body
              { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
              */
              // we will send only first question to fb subsribers
              // find questions
              SurveyQuestions.find({ surveyId: message.automatedMessageId })
                .populate('surveyId')
                .exec((err2, questions) => {
                  if (err2) {
                    return {
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err2)}`
                    }
                  }
                  Surveys.findOne({ _id: message.automatedMessageId }, (err, survey) => {
                    if (err) {
                      return logger.serverLog(TAG,
                        `At surveys ${JSON.stringify(err)}`)
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
                            survey_id: message.automatedMessageId,
                            option: firstQuestion.options[x],
                            question_id: firstQuestion._id,
                            nextQuestionId,
                            userToken: currentUser.facebookInfo.fbToken
                          })
                        })
                      }
                      let pagesFindCriteria = { companyId: message.companyId, connected: true }
                      if (message.isSegmented) {
                        if (message.segmentationPageIds.length > 0) {
                          pagesFindCriteria = _.merge(pagesFindCriteria, {
                            pageId: {
                              $in: message.segmentationPageIds
                            }
                          })
                        }
                      }
                      Pages.find(pagesFindCriteria).populate('userId').exec((err, pages) => {
                        if (err) {
                          return {
                            status: 'failed',
                            description: `Internal Server Error ${JSON.stringify(err)}`
                          }
                        }
                        for (let z = 0; z < pages.length; z++) {
                          if (message.isList === true) {
                            let ListFindCriteria = {}
                            ListFindCriteria = _.merge(ListFindCriteria,
                              {
                                _id: {
                                  $in: message.segmentationList
                                }
                              })
                            Lists.find(ListFindCriteria, (err, lists) => {
                              if (err) {
                                return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                              }
                              let subsFindCriteria = { pageId: pages[z]._id }
                              let listData = []
                              if (lists.length > 1) {
                                for (let i = 0; i < lists.length; i++) {
                                  for (let j = 0; j < lists[i].content.length; j++) {
                                    if (exists(listData, lists[i].content[j]) === false) {
                                      listData.push(lists[i].content[j])
                                    }
                                  }
                                }
                                subsFindCriteria = _.merge(subsFindCriteria, {
                                  _id: {
                                    $in: listData
                                  }
                                })
                              } else {
                                subsFindCriteria = _.merge(subsFindCriteria, {
                                  _id: {
                                    $in: lists[0].content
                                  }
                                })
                              }
                              Subscribers.find(subsFindCriteria, (err, subscribers) => {
                                if (err) {
                                  return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                                }

                                needle.get(
                                  `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                                  (err, resp) => {
                                    if (err) {
                                      logger.serverLog(TAG,
                                        `Page access token from graph api error ${JSON.stringify(
                                          err)}`)
                                    }
                                    let req = {
                                      'body': {
                                        'segmentationTags': message.segmentationTags,
                                        'segmentationSurvey': message.segmentationSurvey
                                      }
                                    }
                                    utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                      subscribers = taggedSubscribers
                                      utility.applySurveyFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                                        subscribers = repliedSubscribers
                                        for (let j = 0; j < subscribers.length; j++) {
                                          const messageData = {
                                            attachment: {
                                              type: 'template',
                                              payload: {
                                                template_type: 'button',
                                                text: `${survey.description}\nPlease respond to these questions. \n${firstQuestion.statement}`,
                                                buttons
                                              }
                                            }
                                          }
                                          const data = {
                                            messaging_type: 'UPDATE',
                                            recipient: { id: subscribers[j].senderId }, // this is the subscriber id
                                            message: messageData
                                          }

                                          // checks the age of function using callback
                                          compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                                            if (err) {
                                              logger.serverLog(TAG, 'inside error')
                                              return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                            }
                                            if (isLastMessage) {
                                              logger.serverLog(TAG, 'inside scheduler suvery send')
                                              needle.post(
                                                `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                                data, (err, resp) => {
                                                  if (err) {
                                                    return {
                                                      status: 'failed',
                                                      description: JSON.stringify(err)
                                                    }
                                                  }
                                                  let surveyPage = new SurveyPage({
                                                    pageId: pages[z].pageId,
                                                    userId: currentUser._id,
                                                    subscriberId: subscribers[j].senderId,
                                                    surveyId: message._id,
                                                    seen: false,
                                                    companyId: message.companyId
                                                  })

                                                  surveyPage.save((err2) => {
                                                    if (err2) {
                                                      logger.serverLog(TAG, {
                                                        status: 'failed',
                                                        description: 'Scheduler Survey Broadcast create failed',
                                                        err2
                                                      })
                                                    }
                                                  })
                                                })
                                            } else {
                                              logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                              let timeNow = new Date()
                                              message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                                              message.save((error) => {
                                                if (error) {
                                                  logger.serverLog(TAG, {
                                                    status: 'failed',
                                                    description: 'Automation Queue Survey Message create failed',
                                                    error
                                                  })
                                                }
                                              })
                                            }
                                          })
                                        }
                                      })
                                    })
                                  })
                              })
                            })
                          } else {
                            let subscriberFindCriteria = {
                              pageId: pages[z]._id,
                              isSubscribed: true
                            }
                            if (message.isSegmented) {
                              if (message.segmentationGender.length > 0) {
                                subscriberFindCriteria = _.merge(subscriberFindCriteria,
                                  {
                                    gender: {
                                      $in: message.segmentationGender
                                    }
                                  })
                              }
                              if (message.segmentationLocale.length > 0) {
                                subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                                  locale: {
                                    $in: message.segmentationLocale
                                  }
                                })
                              }
                            }
                            Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
                              if (err) {
                                return { status: 'failed', description: 'Subscribers not found' }
                              }

                              needle.get(
                                `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                                (err, resp) => {
                                  if (err) {
                                    logger.serverLog(TAG,
                                      `Page access token from graph api error ${JSON.stringify(
                                        err)}`)
                                  }
                                  let req = {
                                    'body': {
                                      'segmentationTags': message.segmentationTags,
                                      'segmentationSurvey': message.segmentationSurvey
                                    }
                                  }
                                  utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                    subscribers = taggedSubscribers
                                    utility.applySurveyFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                                      subscribers = repliedSubscribers
                                      for (let j = 0; j < subscribers.length; j++) {
                                        const messageData = {
                                          attachment: {
                                            type: 'template',
                                            payload: {
                                              template_type: 'button',
                                              text: `${survey.description}\nPlease respond to these questions. \n${firstQuestion.statement}`,
                                              buttons
                                            }
                                          }
                                        }
                                        const data = {
                                          messaging_type: 'UPDATE',
                                          recipient: { id: subscribers[j].senderId }, // this is the subscriber id
                                          message: messageData
                                        }

                                        // this calls the needle when the last message was older than 30 minutes
                                        // checks the age of function using callback
                                        compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                                          if (err) {
                                            logger.serverLog(TAG, 'inside error')
                                            return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                          }
                                          if (isLastMessage) {
                                            needle.post(
                                              `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                              data, (err, resp) => {
                                                if (err) {
                                                  return {
                                                    status: 'failed',
                                                    description: JSON.stringify(err)
                                                  }
                                                }
                                                let surveyPage = new SurveyPage({
                                                  pageId: pages[z].pageId,
                                                  userId: currentUser._id,
                                                  subscriberId: subscribers[j].senderId,
                                                  surveyId: message._id,
                                                  seen: false,
                                                  companyId: message.companyId
                                                })

                                                surveyPage.save((err2) => {
                                                  if (err2) {
                                                    logger.serverLog(TAG, {
                                                      status: 'failed',
                                                      description: 'Survey Broadcast create failed',
                                                      err2
                                                    })
                                                  }
                                                  // not using now
                                                  // Sessions.findOne({
                                                  //   subscriber_id: subscribers[j]._id,
                                                  //   page_id: pages[z]._id,
                                                  //   company_id: pages[z].userId._id
                                                  // }, (err, session) => {
                                                  //   if (err) {
                                                  //     return logger.serverLog(TAG,
                                                  //       `At get session ${JSON.stringify(err)}`)
                                                  //   }
                                                  //   if (!session) {
                                                  //     return logger.serverLog(TAG,
                                                  //       `No chat session was found for surveys`)
                                                  //   }
                                                  //   const chatMessage = new LiveChat({
                                                  //     sender_id: pages[z]._id, // this is the page id: _id of Pageid
                                                  //     recipient_id: subscribers[j]._id, // this is the subscriber id: _id of subscriberId
                                                  //     sender_fb_id: pages[z].pageId, // this is the (facebook) :page id of pageId
                                                  //     recipient_fb_id: subscribers[j].senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                                                  //     session_id: session._id,
                                                  //     company_id: pages[z].userId._id, // this is admin id till we have companies
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
                                                  //       'Chat message saved for surveys sent')
                                                  //   })
                                                  // })
                                                })
                                              })
                                          } else {
                                            logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                            let timeNow = new Date()
                                            message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                                            message.save((error) => {
                                              if (error) {
                                                logger.serverLog(TAG, {
                                                  status: 'failed',
                                                  description: 'Automation Queue Survey Message create failed',
                                                  error
                                                })
                                              }
                                            })
                                          }
                                        })
                                      }
                                    })
                                  })
                                })
                            })
                          }
                        }
                        return { status: 'success', payload: 'Survey sent successfully.' }
                      })
                    } else {
                      return { status: 'failed', description: 'Survey Questions not found' }
                    }
                  })
                })
            })
          })
        } else if (message.type === 'poll') {
          /* Getting the company user who has connected the facebook account */

          Pages.findOne({ companyId: message.companyId, connected: true }, (err, userPage) => {
            if (err) {
              logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
              return {
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              }
            }

            Users.findOne({ _id: userPage.userId }, (err, connectedUser) => {
              if (err) {
                return {
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                }
              }
              let currentUser = connectedUser

              /*
              Expected request body
              { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
              */

              Polls.findOne({ '_id': message.automatedMessageId }, (err, poll) => {
                if (err) {
                  return {
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  }
                }

                const messageData = {
                  text: poll.statement,
                  quick_replies: [
                    {
                      'content_type': 'text',
                      'title': poll.options[0],
                      'payload': JSON.stringify(
                        { poll_id: poll._id, option: poll.options[0] })
                    },
                    {
                      'content_type': 'text',
                      'title': poll.options[1],
                      'payload': JSON.stringify(
                        { poll_id: poll._id, option: poll.options[1] })
                    },
                    {
                      'content_type': 'text',
                      'title': poll.options[2],
                      'payload': JSON.stringify(
                        { poll_id: poll._id, option: poll.options[2] })
                    }
                  ]
                }

                let pagesFindCriteria = { companyId: message.companyId, connected: true }
                if (poll.isSegmented) {
                  if (poll.segmentationPageIds.length > 0) {
                    pagesFindCriteria = _.merge(pagesFindCriteria, {
                      pageId: {
                        $in: poll.segmentationPageIds
                      }
                    })
                  }
                }
                Pages.find(pagesFindCriteria).populate('userId').exec((err, pages) => {
                  if (err) {
                    logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                    return {
                      status: 'failed',
                      description: `Internal Server Error${JSON.stringify(err)}`
                    }
                  }
                  for (let z = 0; z < pages.length; z++) {
                    if (poll.isList === true) {
                      let ListFindCriteria = {}
                      ListFindCriteria = _.merge(ListFindCriteria,
                        {
                          _id: {
                            $in: poll.segmentationList
                          }
                        })
                      Lists.find(ListFindCriteria, (err, lists) => {
                        if (err) {
                          return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                        }
                        let subsFindCriteria = { pageId: pages[z]._id }
                        let listData = []
                        if (lists.length > 1) {
                          for (let i = 0; i < lists.length; i++) {
                            for (let j = 0; j < lists[i].content.length; j++) {
                              if (exists(listData, lists[i].content[j]) === false) {
                                listData.push(lists[i].content[j])
                              }
                            }
                          }
                          subsFindCriteria = _.merge(subsFindCriteria, {
                            _id: {
                              $in: listData
                            }
                          })
                        } else {
                          subsFindCriteria = _.merge(subsFindCriteria, {
                            _id: {
                              $in: lists[0].content
                            }
                          })
                        }
                        Subscribers.find(subsFindCriteria, (err, subscribers) => {
                          if (err) {
                            return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                          }

                          needle.get(
                            `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                            (err, resp) => {
                              if (err) {
                                logger.serverLog(TAG,
                                  `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                              }
                              let req = {
                                'body': {
                                  'segmentationTags': poll.segmentationTags,
                                  'segmentationSurvey': poll.segmentationSurvey
                                }
                              }
                              utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                subscribers = taggedSubscribers
                                for (let j = 0; j < subscribers.length; j++) {
                                  const data = {
                                    messaging_type: 'UPDATE',
                                    recipient: { id: subscribers[j].senderId }, // this is the subscriber id
                                    message: messageData
                                  }

                                  // this calls the needle when the last message was older than 30 minutes
                                  // checks the age of function using callback
                                  compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                                    if (err) {
                                      logger.serverLog(TAG, 'inside error')
                                      return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                    }
                                    if (isLastMessage) {
                                      needle.post(
                                        `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                        data, (err, resp) => {
                                          if (err) {
                                            logger.serverLog(TAG, err)
                                            logger.serverLog(TAG,
                                              `Error occured at subscriber :${JSON.stringify(
                                                subscribers[j])}`)
                                          }
                                          let pollBroadcast = new PollPage({
                                            pageId: pages[z].pageId,
                                            userId: currentUser._id,
                                            companyId: message.companyId,
                                            subscriberId: subscribers[j].senderId,
                                            pollId: poll._id,
                                            seen: false
                                          })

                                          pollBroadcast.save((err2) => {
                                            if (err2) {
                                              logger.serverLog(TAG, {
                                                status: 'failed',
                                                description: 'PollBroadcast create failed',
                                                err2
                                              })
                                            }
                                          })
                                        })
                                    } else {
                                      logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                      let timeNow = new Date()
                                      message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                                      message.save((error) => {
                                        if (error) {
                                          logger.serverLog(TAG, {
                                            status: 'failed',
                                            description: 'Automation Queue poll Message create failed',
                                            error
                                          })
                                        }
                                      })
                                    }
                                  })
                                }
                              })
                            })
                        })
                      })
                    } else {
                      let subscriberFindCriteria = { pageId: pages[z]._id, isSubscribed: true }

                      if (poll.isSegmented) {
                        if (poll.segmentationGender.length > 0) {
                          subscriberFindCriteria = _.merge(subscriberFindCriteria,
                            {
                              gender: {
                                $in: poll.segmentationGender
                              }
                            })
                        }
                        if (poll.segmentationLocale.length > 0) {
                          subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                            locale: {
                              $in: poll.segmentationLocale
                            }
                          })
                        }
                      }

                      Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
                        if (err) {
                          return logger.serverLog(TAG, `error : ${JSON.stringify(err)}`)
                        }

                        needle.get(
                          `https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
                          (err, resp) => {
                            if (err) {
                              logger.serverLog(TAG,
                                `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                            }
                            if (subscribers.length > 0) {
                              let req = {
                                'body': {
                                  'segmentationTags': poll.segmentationTags,
                                  'segmentationPoll': poll.segmentationPoll
                                }
                              }
                              utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                                subscribers = taggedSubscribers
                                utility.applyPollFilterIfNecessary(req, subscribers, (repliedSubscribers) => {
                                  subscribers = repliedSubscribers
                                  for (let j = 0; j < subscribers.length; j++) {
                                    const data = {
                                      messaging_type: 'UPDATE',
                                      recipient: { id: subscribers[j].senderId }, // this is the subscriber id
                                      message: messageData
                                    }
                                    // this calls the needle when the last message was older than 30 minutes
                                    // checks the age of function using callback
                                    compUtility.checkLastMessageAge(subscribers[j].senderId, (err, isLastMessage) => {
                                      if (err) {
                                        logger.serverLog(TAG, 'inside error')
                                        return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                      }
                                      if (isLastMessage) {
                                        needle.post(
                                          `https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`,
                                          data, (err, resp) => {
                                            if (err) {
                                              logger.serverLog(TAG, err)
                                              logger.serverLog(TAG,
                                                `Error occured at subscriber :${JSON.stringify(
                                                  subscribers[j])}`)
                                            }
                                            console.log('poll is just sent ' + JSON.stringify(resp.body))
                                            let pollBroadcast = new PollPage({
                                              pageId: pages[z].pageId,
                                              userId: currentUser._id,
                                              companyId: message.companyId,
                                              subscriberId: subscribers[j].senderId,
                                              pollId: poll._id,
                                              seen: false
                                            })

                                            pollBroadcast.save((err2) => {
                                              if (err2) {
                                                logger.serverLog(TAG, {
                                                  status: 'failed',
                                                  description: 'PollBroadcast create failed',
                                                  err2
                                                })
                                              }
                                              // not using now
                                              // Sessions.findOne({
                                              //   subscriber_id: subscribers[j]._id,
                                              //   page_id: pages[z]._id,
                                              //   company_id: pages[z].userId._id
                                              // }, (err, session) => {
                                              //   if (err) {
                                              //     return logger.serverLog(TAG,
                                              //       `At get session ${JSON.stringify(err)}`)
                                              //   }
                                              //   if (!session) {
                                              //     return logger.serverLog(TAG,
                                              //       `No chat session was found for polls`)
                                              //   }
                                              //   const chatMessage = new LiveChat({
                                              //     sender_id: pages[z]._id, // this is the page id: _id of Pageid
                                              //     recipient_id: subscribers[j]._id, // this is the subscriber id: _id of subscriberId
                                              //     sender_fb_id: pages[z].pageId, // this is the (facebook) :page id of pageId
                                              //     recipient_fb_id: subscribers[j].senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                                              //     session_id: session._id,
                                              //     company_id: pages[z].userId._id, // this is admin id till we have companies
                                              //     payload: {
                                              //       componentType: 'poll',
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
                                              //       'Chat message saved for poll sent')
                                              //   })
                                              // })
                                            })
                                          })
                                      } else {
                                        logger.serverLog(TAG, 'agent was engaged just 30 minutes ago ')
                                        let timeNow = new Date()
                                        message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                                        message.save((error) => {
                                          if (error) {
                                            logger.serverLog(TAG, {
                                              status: 'failed',
                                              description: 'Automation Queue poll Message create failed',
                                              error
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              })
                            }
                          })
                      })
                    }
                  }
                  return { status: 'success', payload: 'Polls sent successfully.' }
                })
              })
            })
          })
        }
      } else {
        // Do work to reschedule the message
      }
    })
  }
  // mongoose.disconnect()
})

function exists (list, content) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(content)) {
      return true
    }
  }
  return false
}
