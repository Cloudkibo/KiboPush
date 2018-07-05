let mongoose = require('mongoose')
const logger = require('../server/components/logger')
const config = require('../server/config/environment')
const AutomationQueue = require('../server/api/automation_queue/automation_queue.model')
const SurveyQuestions = require('../server/api/surveys/surveyquestions.model')
const Surveys = require('../server/api/surveys/surveys.model')
const Pages = require('../server/api/pages/Pages.model')
const Users = require('../server/api/user/Users.model')
const Subscribers = require('../server/api/subscribers/Subscribers.model')
const SurveyPage = require('../server/api/page_survey/page_survey.model')
const PollPage = require('../server/api/page_poll/page_poll.model')
const Polls = require('../server/api/polls/Polls.model')
const AutoPostingMessages = require('../server/api/autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require('../server/api/autoposting_messages/autoposting_subscriber_messages.model')
const URL = require('../server/api/URLforClickedCount/URL.model')
const TAG = 'scripts/monodb_script.js'

const request = require('request')
let Twit = require('twit')
const needle = require('needle')
const compUtility = require('../server/components/utility')

mongoose = mongoose.connect(config.mongo.uri)

AutomationQueue.find({}, (err, data) => {
  if (err) {
    logger.serverLog(TAG, `queue messages not found ${JSON.stringify(err)}`)
  }
  if (data) {
    for (let i = 0; i < data.length; i++) {
      let message = data[i]
      if (message.scheduledTime.getTime() < new Date().getTime()) {
        if (message.type === 'survey') {
          /* Getting the company user who has connected the facebook account */

          Subscribers.findOne({ '_id': message.subscriberId }, (err, subscriber) => {
            if (err) {
              logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
            }

            Pages.findOne({ '_id': subscriber.pageId }, (err, page) => {
              if (err) {
                logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
              }

              Users.findOne({ '_id': page.userId }, (err, connectedUser) => {
                if (err) {
                  logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                }

                var currentUser = connectedUser
                SurveyQuestions.find({ 'surveyId': message.automatedMessageId }, (err, questions) => {
                  if (err) {
                    logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                  }

                  Surveys.findOne({ '_id': message.automatedMessageId }, (err, survey) => {
                    if (err) {
                      logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
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
                        recipient: { id: subscriber.senderId }, // this is the subscriber id
                        message: messageData
                      }
                      // checks the age of function using callback
                      compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                        if (err) {
                          logger.serverLog(TAG, 'inside error')
                          logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                        }
                        if (isLastMessage) {
                          logger.serverLog(TAG, 'inside scheduler suvery send')
                          needle.post(
                            `https://graph.facebook.com/v2.6/me/messages?access_token=${page.accessToken}`,
                            data, (err, resp) => {
                              if (err) {
                                logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                              }
                              let surveyPage = new SurveyPage({
                                pageId: page.pageId,
                                userId: currentUser._id,
                                subscriberId: subscriber.senderId,
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
                                AutomationQueue.deleteOne({'_id': message._id}, (err, result) => {
                                  if (err) {
                                    logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                  }

                                  logger.serverLog(TAG, 'successfully deleted ' + JSON.stringify(result))
                                })
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
                    } else {
                      logger.serverLog(TAG, 'Survey Questions not found - scheduler')
                    }
                  })
                })
              })
            })
          })
        } else if (message.type === 'poll') {
          /* Getting the company user who has connected the facebook account */
          AutoPostingMessages.findOne({'_id': message.automatedMessageId}, (err, autopostingMessage) => {
            if (err) {
              logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
            }
            Subscribers.findOne({ '_id': message.subscriberId }, (err, subscriber) => {
              if (err) {
                logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
              }
              Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
                if (err) {
                  logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                }
                Users.findOne({'_id': page.userId}, (err, connectedUser) => {
                  if (err) {
                    logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                  }
                  Polls.findOne({'_id': message.automatedMessageId}, (err, poll) => {
                    if (err) {
                      logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                    }
                    let currentUser = connectedUser
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
                    const data = {
                      messaging_type: 'UPDATE',
                      recipient: { id: subscriber.senderId }, // this is the subscriber id
                      message: messageData
                    }

                    // this calls the needle when the last message was older than 30 minutes
                    // checks the age of function using callback
                    compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                      if (err) {
                        logger.serverLog(TAG, 'inside error')
                        logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                      }
                      if (isLastMessage) {
                        needle.post(
                          `https://graph.facebook.com/v2.6/me/messages?access_token=${page.accessToken}`,
                          data, (err, resp) => {
                            if (err) {
                              logger.serverLog(TAG, err)
                              logger.serverLog(TAG,
                                `Error occured at subscriber :${JSON.stringify(
                                  subscriber)}`)
                            }
                            let pollBroadcast = new PollPage({
                              pageId: page.pageId,
                              userId: currentUser._id,
                              companyId: message.companyId,
                              subscriberId: subscriber.senderId,
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

                              AutomationQueue.deleteOne({'_id': message._id}, (err, result) => {
                                if (err) {
                                  logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                }

                                logger.serverLog(TAG, 'successfully deleted ' + JSON.stringify(result))
                              })
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
                  })
                })
              })
            })
          })
        } else if (message.type === 'autoposting-wordpress') {
          AutoPostingMessages.findOne({ '_id': message.automatedMessageId }, (err, autopostingMessage) => {
            if (err) {
              logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
            }
            Subscribers.findOne({'_id': message.subscriberId}, (err, subscriber) => {
              if (err) {
                logger.serverLog(TAG, 'Internal Server Error on connect')
              }
              Pages.findOne({ '_id': subscriber.pageId }, (err, page) => {
                if (err) {
                  logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                }
                let messageData = {}

                URL.findOne({ 'originalURL': autopostingMessage.message_id }, (err, savedurl) => {
                  if (err) logger.serverLog(TAG, err)
                  let newURL = config.domain + '/api/URL/' + savedurl._id
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
                              'title': 'Wordpress blog Post title',
                              'image_url': config.domain + '/img/wordpress.png',
                              'subtitle': 'sent using kibopush.com',
                              'buttons': [
                                {
                                  'type': 'web_url',
                                  'url': newURL,
                                  'title': 'View Wordpress Blog Post'
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
                      logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                    }

                    if (isLastMessage) {
                      logger.serverLog(TAG, 'inside autoposting wordpress send')
                      sendAutopostingMessage(messageData, page, message)
                    } else {
                      // Logic to add into queue will go here
                      logger.serverLog(TAG, 'inside adding to autoposting queue')
                      let timeNow = new Date()
                      message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                      message.save((error) => {
                        if (error) {
                          logger.serverLog(TAG, {
                            status: 'failed',
                            description: 'Automation Queue autoposting-wordpress Message create failed',
                            error
                          })
                        }
                      })
                    }
                  })
                })

                let newSubscriberMsg = new AutopostingSubscriberMessages({
                  pageId: page.pageId,
                  companyId: message.companyId,
                  autopostingId: autopostingMessage.autopostingId,
                  autoposting_messages_id: autopostingMessage._id,
                  subscriberId: subscriber.senderId
                })

                newSubscriberMsg.save((err, savedSubscriberMsg) => {
                  if (err) logger.serverLog(TAG, err)
                  logger.serverLog(TAG, `autoposting subsriber message saved for subscriber id ${subscriber.senderId}`)
                })
              })
            })
          })
        } else if (message.type === 'autoposting-twitter') {
          let twitterClient = new Twit({
            consumer_key: config.twitter.consumer_key,
            consumer_secret: config.twitter.consumer_secret,
            access_token: config.twitter.consumer_token,
            access_token_secret: config.twitter.consumer_token_secret
          })
          AutoPostingMessages.findOne({ '_id': message.automatedMessageId }, (err, autopostingMessage) => {
            if (err) {
              logger.serverLog(TAG, 'Internal Server Error on connect')
            }
            twitterClient.get('statuses/show/:id', { id: autopostingMessage.message_id }, (err, tweet) => {
              if (err) {
                logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
              }
              Subscribers.findOne({'_id': message.subscriberId}, (err, subscriber) => {
                if (err) {
                  logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                }
                Pages.findOne({'_id': subscriber.pageId}, (err, page) => {
                  if (err) {
                    logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                  }
                  let messageData = {}
                  if (!tweet.entities.media) { // (tweet.entities.urls.length === 0 && !tweet.entities.media) {
                    messageData = {
                      'messaging_type': 'UPDATE',
                      'recipient': JSON.stringify({
                        'id': subscriber.senderId
                      }),
                      'message': JSON.stringify({
                        'text': tweet.text,
                        'metadata': 'This is a meta data for tweet'
                      })
                    }
                    // Logic to control the autoposting when last activity is less than 30 minutes
                    compUtility.checkLastMessageAge(subscriber.senderId, (err, isLastMessage) => {
                      if (err) {
                        logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                      }

                      if (isLastMessage) {
                        logger.serverLog(TAG, 'inside autoposting send')
                        sendAutopostingMessage(messageData, page, message)
                      } else {
                        // Logic to add into queue will go here
                        logger.serverLog(TAG, 'inside adding autoposting-twitter to autoposting queue')
                        let timeNow = new Date()
                        message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                        message.save((error) => {
                          if (error) {
                            logger.serverLog(TAG, {
                              status: 'failed',
                              description: 'Automation Queue autoposting-twitter Message create failed',
                              error
                            })
                          }
                        })
                      }
                    })
                  } else {
                    let URLObject = new URL({
                      originalURL: tweet.entities.media[0].url,
                      subscriberId: subscriber._id,
                      module: {
                        id: autopostingMessage._id,
                        type: 'autoposting'
                      }
                    })

                    URLObject.save((err, savedurl) => {
                      if (err) {
                        logger.serverLog(TAG, err)
                      }
                      let newURL = config.domain + '/api/URL/' + savedurl._id
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
                                  'title': tweet.text,
                                  'image_url': tweet.entities.media[0].media_url,
                                  'subtitle': 'sent using kibopush.com',
                                  'buttons': [
                                    {
                                      'type': 'web_url',
                                      'url': newURL,
                                      'title': 'View Tweet'
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
                          logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                        }

                        if (isLastMessage) {
                          logger.serverLog(TAG, 'inside autoposting autoposting twitter send')
                          sendAutopostingMessage(messageData, page, message)
                        } else {
                          // Logic to add into queue will go here
                          logger.serverLog(TAG, 'inside adding to autoposting queue')
                          let timeNow = new Date()
                          message.scheduledTime = timeNow.setMinutes(timeNow.getMinutes() + 30)

                          message.save((error) => {
                            if (error) {
                              logger.serverLog(TAG, {
                                status: 'failed',
                                description: 'Automation Queue autoposting-twitter Message create failed',
                                error
                              })
                            }
                          })
                        }
                      })
                    })
                  }
                  let newSubscriberMsg = new AutopostingSubscriberMessages({
                    pageId: page.pageId,
                    companyId: message.companyId,
                    autopostingId: autopostingMessage.autopostingId,
                    autoposting_messages_id: autopostingMessage._id,
                    subscriberId: subscriber.senderId
                  })

                  newSubscriberMsg.save((err, savedSubscriberMsg) => {
                    if (err) {
                      logger.serverLog(TAG, err)
                    }
                    logger.serverLog(TAG, `autoposting subsriber message saved for subscriber id ${subscriber.senderId}`)
                  })
                })
              })
            })
          })
        } else if (message.type === 'autoposting-fb') {
          // whoever fixes autoposting fb will add following

          /*
          message sequencing
          autoposting-fb
          broadcast
          */
        }
        if (!(i + 1 < data.length)) {
          setTimeout(function (mongoose) { closeDB(mongoose) }, 20000)
        }
      } else if (!(i + 1 < data.length)) {
        // Do work to reschedule the message
        setTimeout(function (mongoose) { closeDB(mongoose) }, 20000)
      }
    }
  }
  // mongoose.disconnect()
})

function closeDB () {
  console.log('last index reached')
  mongoose.disconnect(function (err) {
    if (err) throw err
    console.log('disconnected')
    process.exit()
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
        logger.serverLog(TAG,
          `At send wordpress broadcast ${JSON.stringify(
            err)}`)
      } else {
        if (res.statusCode !== 200) {
          logger.serverLog(TAG,
            `At send wordpress broadcast response ${JSON.stringify(
              res.body.error)}`)
        } else {
          AutomationQueue.deleteOne({'_id': savedMsg._id}, (err, result) => {
            if (err) {
              logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
            }

            logger.serverLog(TAG, 'successfully deleted ' + JSON.stringify(result))
          })
          // logger.serverLog(TAG,
          //   `At send tweet broadcast response ${JSON.stringify(
          //   res.body.message_id)}`, true)
        }
      }
    })
  // AutopostingMessages.update({_id: savedMsg._id}, {payload: messageData}, (err, updated) => {
  //   if (err) {
  //     logger.serverLog(TAG, `ERROR at updating AutopostingMessages ${JSON.stringify(err)}`)
  //   }
  // })
}
