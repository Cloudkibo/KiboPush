const logger = require('../../../components/logger')
const Pages = require('../pages/Pages.model')
const AutomationQueue = require('./../automation_queue/automation_queue.model')
const Subscribers = require('../subscribers/Subscribers.model')
const AutoPosting = require('../autoposting/autopostings.model')
const URL = require('./../URLforClickedCount/URL.model')
const AutopostingMessages = require(
  './../autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require(
  './../autoposting_messages/autoposting_subscriber_messages.model')
const utility = require('../broadcasts/broadcasts.utility')
const compUtility = require('../../components/utility')
const og = require('open-graph')
let _ = require('lodash')
const request = require('request')
const TAG = 'api/facebookEvents/autoposting.controller.js'
let config = require('./../../../config/environment')

exports.autoposting = function (req, res) {
  for (let i = 0; i < req.body.entry[0].changes.length; i++) {
    const event = req.body.entry[0].changes[i]
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
