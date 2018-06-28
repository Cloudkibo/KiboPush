/**
 * Created by sojharo on 23/10/2017.
 */

const config = require('../environment/index')
let Twit = require('twit')
let AutoPosting = require('../../api/autoposting/autopostings.model')
let Pages = require('../../api/pages/Pages.model')
const URL = require('../../api/URLforClickedCount/URL.model')
let Subscribers = require('../../api/subscribers/Subscribers.model')
const AutomationQueue = require('../../api/automation_queue/automation_queue.model')
const AutopostingMessages = require('../../api/autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require('../../api/autoposting_messages/autoposting_subscriber_messages.model')
let request = require('request')
let _ = require('lodash')
let utility = require('../../api/broadcasts/broadcasts.utility')
const compUtility = require('../../components/utility')

const logger = require('../../components/logger')
const TAG = 'config/integrations/twitter.js'

// test twitter ids : [2616186000, 1430793200]

let twitterClient = new Twit({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.consumer_token,
  access_token_secret: config.twitter.consumer_token_secret
})

let stream

function connect () {
  AutoPosting.find({subscriptionType: 'twitter', isActive: true},
    (err, autoposting) => {
      if (err) {
        return logger.serverLog(TAG, 'Internal Server Error on connect')
      }
      if (autoposting.length > 0) {
        let arrUsers = []
        for (let i = 0; i < autoposting.length; i++) {
          arrUsers.push(autoposting[i].payload.id)
        }
        logger.serverLog(TAG, `Twitter Ids to listen: ${arrUsers}`)
        stream = twitterClient.stream('statuses/filter',
          {follow: arrUsers})

        stream.on('tweet', tweet => {
          if (tweet.in_reply_to_status_id !== null || tweet.in_reply_to_user_id !== null || tweet.in_reply_to_screen_name !== null) {
            return
          }
          // logger.serverLog(TAG, `Tweet received : ${JSON.stringify(tweet.user.screen_name)}`)
          AutoPosting.find({accountUniqueName: tweet.user.screen_name, isActive: true})
            .populate('userId companyId')
            .exec((err, autopostings) => {
              if (err) {
                return logger.serverLog(TAG, 'Internal Server Error on connect')
              }
              // logger.serverLog(TAG, `Tweet received and pages listening to it ${autopostings.length} and account is ${tweet.user.screen_name}`)
              autopostings.forEach(postingItem => {
                let pagesFindCriteria = {
                  companyId: postingItem.companyId._id,
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
                      isSubscribed: true
                    }

                    if (postingItem.isSegmented) {
                      if (postingItem.segmentationGender.length > 0) {
                        subscriberFindCriteria = _.merge(subscriberFindCriteria,
                          {
                            gender: {
                              $in: postingItem.segmentationGender
                            }
                          })
                      }
                      if (postingItem.segmentationLocale.length > 0) {
                        subscriberFindCriteria = _.merge(subscriberFindCriteria,
                          {
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

                        if (subscribers.length > 0) {
                          let newMsg = new AutopostingMessages({
                            pageId: page._id,
                            companyId: postingItem.companyId,
                            autoposting_type: 'twitter',
                            autopostingId: postingItem._id,
                            sent: subscribers.length,
                            message_id: tweet.id,
                            seen: 0,
                            clicked: 0
                          })

                          newMsg.save((err, savedMsg) => {
                            if (err) logger.serverLog(TAG, err)
                            utility.applyTagFilterIfNecessary({body: postingItem}, subscribers, (taggedSubscribers) => {
                              taggedSubscribers.forEach(subscriber => {
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
                                      logger.serverLog(TAG, 'inside error')
                                      return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                    }

                                    if (isLastMessage) {
                                      logger.serverLog(TAG, 'inside autoposting send')
                                      sendAutopostingMessage(messageData, page, savedMsg)
                                    } else {
                                      // Logic to add into queue will go here
                                      logger.serverLog(TAG, 'inside adding autoposting-twitter to autoposting queue')
                                      let timeNow = new Date()
                                      let automatedQueueMessage = new AutomationQueue({
                                        automatedMessageId: savedMsg._id,
                                        subscriberId: subscriber._id,
                                        companyId: savedMsg.companyId,
                                        type: 'autoposting-twitter',
                                        scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                      })

                                      automatedQueueMessage.save((error) => {
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
                                      id: savedMsg._id,
                                      type: 'autoposting'
                                    }
                                  })

                                  URLObject.save((err, savedurl) => {
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
                                                'title': tweet.text,
                                                'image_url': tweet.entities.media[0].media_url,
                                                'subtitle': 'kibopush.com',
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
                                        logger.serverLog(TAG, 'inside error')
                                        return logger.serverLog(TAG, 'Internal Server Error on Setup ' + JSON.stringify(err))
                                      }

                                      if (isLastMessage) {
                                        logger.serverLog(TAG, 'inside autoposting autoposting twitter send')
                                        sendAutopostingMessage(messageData, page, savedMsg)
                                      } else {
                                        // Logic to add into queue will go here
                                        logger.serverLog(TAG, 'inside adding to autoposting queue')
                                        let timeNow = new Date()
                                        let automatedQueueMessage = new AutomationQueue({
                                          automatedMessageId: savedMsg._id,
                                          subscriberId: subscriber._id,
                                          companyId: savedMsg.companyId,
                                          type: 'autoposting-twitter',
                                          scheduledTime: timeNow.setMinutes(timeNow.getMinutes() + 30)
                                        })

                                        automatedQueueMessage.save((error) => {
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
                                  companyId: postingItem.companyId,
                                  autopostingId: postingItem._id,
                                  autoposting_messages_id: savedMsg._id,
                                  subscriberId: subscriber.senderId
                                })

                                newSubscriberMsg.save((err, savedSubscriberMsg) => {
                                  if (err) logger.serverLog(TAG, err)
                                  logger.serverLog(TAG, `autoposting subsriber message saved for subscriber id ${subscriber.senderId}`)
                                })
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
          `At send tweet broadcast ${JSON.stringify(
          err)}`)
      } else {
        if (res.statusCode !== 200) {
          logger.serverLog(TAG,
          `At send tweet broadcast response ${JSON.stringify(
            res.body.error)}`)
        } else {
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

function restart () {
  if (stream) stream.stop()
  connect()
}

function findUser (screenName, fn) {
  twitterClient.get('users/show', {screen_name: screenName},
    (err, data, response) => {
      if (err) {
        fn(err)
      }
      if (data.errors) {
        if (data.errors[0].code === 50) {
          fn('User not found on Twitter')
        }
      }
      fn(null, data)
    })
}

exports.connect = connect
exports.findUser = findUser
exports.restart = restart
