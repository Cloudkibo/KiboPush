/**
 * Created by sojharo on 19/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/broadcast/broadcasts2.controller.js'
const Broadcasts = require('./broadcasts.model')
const URL = require('./URL.model')
const Pages = require('../pages/Pages.model')
const Lists = require('../lists/lists.model')

// const PollResponse = require('../polls/pollresponse.model')
// const SurveyResponse = require('../surveys/surveyresponse.model')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
// const SurveyQuestions = require('../surveys/surveyquestions.model')
const Subscribers = require('../subscribers/Subscribers.model')
const LiveChat = require('../livechat/livechat.model')
const Session = require('../sessions/sessions.model')
const PageAdminSubscriptions = require('./../pageadminsubscriptions/pageadminsubscriptions.model')
let _ = require('lodash')
// const needle = require('needle')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const utility = require('./broadcasts.utility')
let request = require('request')
let config = require('./../../config/environment')
const CompanyUsers = require('./../companyuser/companyuser.model')

function exists (list, content) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(content)) {
      return true
    }
  }
  return false
}

exports.sendConversation = function (req, res) {
  logger.serverLog(TAG,
    `Inside Send Broadcast, req body = ${JSON.stringify(req.body)}`)

  if (!utility.validateInput(req.body)) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters or components are missing'})
  }

  if (req.body.self) {
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
      let pagesFindCriteria = {companyId: companyUser.companyId, connected: true}

      if (req.body.isSegmented) {
        if (req.body.pageIds) {
          pagesFindCriteria = _.merge(pagesFindCriteria, {
            pageId: {
              $in: req.body.pageIds
            }
          })
        }
      }

      Pages.find(pagesFindCriteria, (err, pages) => {
        if (err) {
          logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          return res.status(404)
          .json({status: 'failed', description: 'Pages not found'})
        }

        pages.forEach(page => {
          req.body.payload.forEach(payloadItem => {
            PageAdminSubscriptions.findOne({companyId: companyUser.companyId, pageId: page._id, userId: req.user._id}, (err, subscriptionUser) => {
              if (err) {
                logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                return res.status(404)
                .json({status: 'failed', description: 'Pages subscription id not found'})
              }
              let messageData = utility.prepareSendAPIPayload(
                subscriptionUser.subscriberId,
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
          })
        })
      })
      return res.status(200)
      .json({status: 'success', payload: {broadcast: req.body}})
    })
  } else {
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
      const broadcast = new Broadcasts(utility.prepareBroadCastPayload(req, companyUser.companyId))

      broadcast.save((err, broadcast) => {
        if (err) {
          return res.status(500)
          .json({status: 'failed', description: 'Broadcasts not created'})
        }

        require('./../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'new_broadcast',
            payload: {
              broadcast_id: broadcast._id,
              user_id: req.user._id,
              user_name: req.user.name
            }
          }
        })

        let pagesFindCriteria = {companyId: companyUser.companyId, connected: true}

        if (req.body.isSegmented) {
          if (req.body.segmentationPageIds.length > 0) {
            if (req.body.segmentationPageIds[0].length > 0) {
              let pageCriteria = req.body.segmentationPageIds
              if (typeof (req.body.segmentationPageIds) === 'object') {
                pageCriteria = req.body.segmentationPageIds[0]
              }
              pagesFindCriteria = _.merge(pagesFindCriteria, {
                pageId: {
                  $in: pageCriteria
                }
              })
            }
          }
        }
        logger.serverLog(TAG,
          `Page Criteria for segmentation ${JSON.stringify(pagesFindCriteria)}`)

        Pages.find(pagesFindCriteria, (err, pages) => {
          if (err) {
            logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
            return res.status(404)
            .json({status: 'failed', description: 'Pages not found'})
          }

          pages.forEach(page => {
            logger.serverLog(TAG, `Page in the loop ${page.pageName}`)

            if (req.body.isList === true) {
              logger.serverLog(TAG, `inside isList`)
              let ListFindCriteria = {}
              ListFindCriteria = _.merge(ListFindCriteria,
                {
                  _id: {
                    $in: req.body.segmentationList
                  }
                })
              Lists.find(ListFindCriteria, (err, lists) => {
                if (err) {
                  return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                }
                let subsFindCriteria = {pageId: page._id}
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
                  req.body.payload.forEach(payloadItem => {
                    subscribers.forEach(subscriber => {
                      logger.serverLog(TAG,
                        `At Subscriber fetched ${subscriber.firstName} ${subscriber.lastName} for payload ${payloadItem.componentType}`)

                      Session.findOne({subscriber_id: subscriber._id, page_id: page._id, company_id: req.user._id}, (err, session) => {
                        if (err) {
                          return logger.serverLog(TAG,
                            `At get session ${JSON.stringify(err)}`)
                        }
                        if (!session) {
                          return logger.serverLog(TAG,
                            `No chat session was found for broadcast`)
                        }
                        const chatMessage = new LiveChat({
                          sender_id: page._id, // this is the page id: _id of Pageid
                          recipient_id: subscriber._id, // this is the subscriber id: _id of subscriberId
                          sender_fb_id: page.pageId, // this is the (facebook) :page id of pageId
                          recipient_fb_id: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                          session_id: session._id,
                          company_id: req.user._id, // this is admin id till we have companies
                          payload: payloadItem, // this where message content will go
                          status: 'unseen' // seen or unseen
                        })
                        chatMessage.save((err, chatMessageSaved) => {
                          if (err) {
                            return logger.serverLog(TAG,
                              `At get session ${JSON.stringify(err)}`)
                          }
                          logger.serverLog(TAG, 'Chat message saved for broadcast sent')
                        })
                      })
                      // update broadcast sent field
                      let pagebroadcast = new BroadcastPage({
                        pageId: page.pageId,
                        userId: req.user._id,
                        subscriberId: subscriber.senderId,
                        broadcastId: broadcast._id,
                        seen: false,
                        companyId: companyUser.companyId
                      })

                      pagebroadcast.save((err2, savedpagebroadcast) => {
                        if (err2) {
                          logger.serverLog(TAG, {
                            status: 'failed',
                            description: 'PageBroadcast create failed',
                            err2
                          })
                        }
                        let messageData = utility.prepareSendAPIPayload(
                          subscriber.senderId,
                          payloadItem)
                        request(
                          {
                            'method': 'POST',
                            'json': true,
                            'formData': messageData,
                            'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                            page.accessToken
                          },
                          function (err, resp) {
                            if (err) {
                              return logger.serverLog(TAG,
                                `At send message broadcast ${JSON.stringify(err)}`)
                            } else {
                              if (resp.statusCode !== 200) {
                                logger.serverLog(TAG,
                                  `At send message broadcast response ${JSON.stringify(
                                    resp.body.error)}`)
                              } else {
                                logger.serverLog(TAG,
                                  `At send message broadcast response ${JSON.stringify(
                                    resp.body.message_id)}`)
                              }
                            }
                          })
                      })
                    })
                  })
                })
              })
            } else {
              let subscriberFindCriteria = {pageId: page._id, isSubscribed: true}
              if (req.body.isSegmented) {
                if (req.body.segmentationGender.length > 0) {
                  subscriberFindCriteria = _.merge(subscriberFindCriteria,
                    {
                      gender: {
                        $in: req.body.segmentationGender
                      }
                    })
                }
                if (req.body.segmentationLocale.length > 0) {
                  subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                    locale: {
                      $in: req.body.segmentationLocale
                    }
                  })
                }
              }
              logger.serverLog(TAG,
                `Subscribers Criteria for segmentation ${JSON.stringify(
                  subscriberFindCriteria)}`)

              Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
                if (err) {
                  return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                }

                logger.serverLog(TAG,
                  `Total Subscribers of page ${page.pageName} are ${subscribers.length}`)
                logger.serverLog(TAG,
                  `isList ${JSON.stringify(req.body.listNumbers)}`)
                req.body.payload.forEach(payloadItem => {
                  subscribers.forEach(subscriber => {
                    logger.serverLog(TAG,
                      `At Subscriber fetched ${subscriber.firstName} ${subscriber.lastName} for payload ${payloadItem.componentType}`)

                    Session.findOne({subscriber_id: subscriber._id, page_id: page._id, company_id: req.user._id}, (err, session) => {
                      if (err) {
                        return logger.serverLog(TAG,
                          `At get session ${JSON.stringify(err)}`)
                      }
                      if (!session) {
                        return logger.serverLog(TAG,
                          `No chat session was found for broadcast`)
                      }
                      const chatMessage = new LiveChat({
                        sender_id: page._id, // this is the page id: _id of Pageid
                        recipient_id: subscriber._id, // this is the subscriber id: _id of subscriberId
                        sender_fb_id: page.pageId, // this is the (facebook) :page id of pageId
                        recipient_fb_id: subscriber.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
                        session_id: session._id,
                        company_id: req.user._id, // this is admin id till we have companies
                        payload: payloadItem, // this where message content will go
                        status: 'unseen' // seen or unseen
                      })
                      chatMessage.save((err, chatMessageSaved) => {
                        if (err) {
                          return logger.serverLog(TAG,
                            `At get session ${JSON.stringify(err)}`)
                        }
                        logger.serverLog(TAG, 'Chat message saved for broadcast sent')
                      })
                    })
                    // update broadcast sent field
                    let pagebroadcast = new BroadcastPage({
                      pageId: page.pageId,
                      userId: req.user._id,
                      subscriberId: subscriber.senderId,
                      broadcastId: broadcast._id,
                      seen: false,
                      companyId: companyUser.companyId
                    })

                    pagebroadcast.save((err2, savedpagebroadcast) => {
                      if (err2) {
                        logger.serverLog(TAG, {
                          status: 'failed',
                          description: 'PageBroadcast create failed',
                          err2
                        })
                      }
                      if (payloadItem.buttons) {
                        for (var i = 0; i < payloadItem.buttons.length; i++) {
                          let url = new URL({
                            broadcastId: savedpagebroadcast._id,
                            originalURL: payloadItem.buttons[i].url
                          })
                          url.save((err2, savedurl) => {
                            if (err2) {
                              logger.serverLog(TAG, {
                                status: 'failed',
                                description: 'url create failed',
                                err2
                              })
                            }
                            // logger.serverLog(TAG,
                            //   `url saved ${JSON.stringify(savedurl)}`)
                            // payloadItem.buttons[0].url = 'https://staging.kibopush.com/link/' + savedurl._id
                          })
                        }
                      }
                      URL.find({}, (err, urls) => {
                        if (err) {
                          return res.status(500).json({
                            status: 'failed',
                            description: `Internal Server Error ${JSON.stringify(err)}`
                          })
                        }
                        // if (payloadItem.buttons && urls.length > 0) {
                        //   logger.serverLog(TAG,
                        //     `inside if ${JSON.stringify(payloadItem)}`)
                        //   payloadItem.buttons[0].url = 'https://staging.kibopush.com/link/'
                        //   logger.serverLog(TAG,
                        //     `payloaditem ${JSON.stringify(payloadItem)}`)
                        // }
                        logger.serverLog(TAG,
                          `payloaditem ${JSON.stringify(payloadItem)}`)
                        let messageData = utility.prepareSendAPIPayload(
                          subscriber.senderId,
                          payloadItem)
                        logger.serverLog(TAG,
                          `messageData ${JSON.stringify(messageData)}`)
                        request(
                          {
                            'method': 'POST',
                            'json': true,
                            'formData': messageData,
                            'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                            page.accessToken
                          },
                          function (err, resp) {
                            if (err) {
                              return logger.serverLog(TAG,
                                `At send message broadcast ${JSON.stringify(err)}`)
                            } else {
                              if (resp.statusCode !== 200) {
                                logger.serverLog(TAG,
                                  `At send message broadcast response ${JSON.stringify(
                                    resp.body.error)}`)
                              } else {
                                logger.serverLog(TAG,
                                  `At send message broadcast response ${JSON.stringify(
                                    resp.body.message_id)}`)
                              }
                            }
                          })
                      })
                    })
                  })
                })
              })
            }
          })
          return res.status(200)
          .json({status: 'success', payload: {broadcast: broadcast}})
        })
      })
    })
  }
}

exports.upload = function (req, res) {
  logger.serverLog(TAG,
    `upload file route called. file is: ${JSON.stringify(req.files)}`)

  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  serverPath += '.' + fext[fext.length - 1].toLowerCase()

  let dir = path.resolve(__dirname, '../../../broadcastFiles/')

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }

  fs.rename(
    req.files.file.path,
    dir + '/userfiles/' + serverPath,
    err => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      logger.serverLog(TAG,
        `file uploaded, sending response now: ${JSON.stringify({
          id: serverPath,
          url: `${config.domain}/api/broadcasts/download/${serverPath}`
        })}`)
      return res.status(201).json({
        status: 'success',
        payload: {
          id: serverPath,
          url: `${config.domain}/api/broadcasts/download/${serverPath}`
        }
      })
    }
  )
}

exports.download = function (req, res) {
  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
  try {
    res.sendfile(req.params.id, {root: dir})
  } catch (err) {
    logger.serverLog(TAG,
      `Inside Download file, err = ${JSON.stringify(err)}`)
    res.status(404)
      .json({status: 'success', payload: 'Not Found ' + JSON.stringify(err)})
  }
}

exports.delete = function (req, res) {
  logger.serverLog(TAG,
    `Inside delete file Broadcast`)
  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
  // unlink file
  fs.unlink(dir + '/' + req.params.id, function (err) {
    if (err) {
      logger.serverLog(TAG, err)
      return res.status(404)
        .json({status: 'failed', description: 'File not found'})
    } else {
      logger.serverLog(TAG, 'file deleted')
      return res.status(200)
        .json({status: 'success', payload: 'File deleted successfully'})
    }
  })
}
