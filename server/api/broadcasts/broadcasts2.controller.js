/**
 * Created by sojharo on 19/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/broadcast/broadcasts2.controller.js'
const Broadcasts = require('./broadcasts.model')
const Pages = require('../pages/Pages.model')
const Lists = require('../lists/lists.model')
const URL = require('./../URLforClickedCount/URL.model')
// const PollResponse = require('../polls/pollresponse.model')
// const SurveyResponse = require('../surveys/surveyresponse.model')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
// const SurveyQuestions = require('../surveys/surveyquestions.model')
const Subscribers = require('../subscribers/Subscribers.model')
// const LiveChat = require('../livechat/livechat.model')
// const Session = require('../sessions/sessions.model')
const PageAdminSubscriptions = require('./../pageadminsubscriptions/pageadminsubscriptions.model')
let _ = require('lodash')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const utility = require('./broadcasts.utility')
let request = require('request')
let config = require('./../../config/environment')
const CompanyUsers = require('./../companyuser/companyuser.model')
const needle = require('needle')
/* eslint-disable */
const async = require('asyncawait/async')
const awaitt = require('asyncawait/await')
/* eslint-enable */

function exists (list, content) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(content)) {
      return true
    }
  }
  return false
}

exports.sendConversation = async(function (req, res) {
  logger.serverLog(TAG, `Sending Broadcast ${JSON.stringify(req.body)}`)
  if (!utility.validateInput(req.body)) {
    logger.serverLog(TAG, 'Parameters are missing.')
    return res.status(400)
    .json({status: 'failed', description: 'Please fill all the required fields'})
  }
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
    if (req.body.self) {
      let pagesFindCriteria = {companyId: companyUser.companyId, connected: true}

      if (req.body.isSegmented) {
        if (req.body.segmentationPageIds) {
          pagesFindCriteria = _.merge(pagesFindCriteria, {
            pageId: {
              $in: req.body.segmentationPageIds
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
            PageAdminSubscriptions.findOne({companyId: companyUser.companyId, pageId: page._id, userId: req.user._id}).populate('userId').exec((err, subscriptionUser) => {
              if (err) {
                logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                return res.status(404)
                .json({status: 'failed', description: 'Pages subscription id not found'})
              }
              let messageData = utility.prepareSendAPIPayload(
                subscriptionUser.subscriberId,
                payloadItem, subscriptionUser.userId.name, '', false)

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
      return res.status(200).json({status: 'success', payload: {broadcast: req.body}})
    } else {
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
        let payload = req.body.payload
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

        Pages.find(pagesFindCriteria).populate('userId').exec((err, pages) => {
          if (err) {
            logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
            return res.status(404)
            .json({status: 'failed', description: 'Pages not found'})
          }

          for (let i = 0; i < pages.length; i++) {
            if (!pages[i].userId || (pages[i].userId && !pages[i].userId.facebookInfo)) {
              logger.serverLog(TAG, `ERROR! Facebook Info not found`)
              return res.status(500).json({
                status: 'failed',
                description: `ERROR! Facebook Info not found`
              })
            }
            needle.get(
            `https://graph.facebook.com/v2.10/${pages[i].pageId}?fields=access_token&access_token=${pages[i].userId.facebookInfo.fbToken}`,
            (err, resp) => {
              if (err) {
                logger.serverLog(TAG, `ERROR! unable to get page access_token: ${JSON.stringify(err)}`)
                return res.status(500).json({
                  status: 'failed',
                  description: `ERROR! unable to get page access_token: ${JSON.stringify(err)}`
                })
              }
              let pageAccessToken = resp.body.access_token
              if (req.body.isList === true) {
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
                  let subsFindCriteria = {pageId: pages[i]._id}
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
                    utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                      taggedSubscribers.forEach(subscriber => {
                        // update broadcast sent field
                        let pagebroadcast = new BroadcastPage({
                          pageId: pages[i].pageId,
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
                          let dir = path.resolve(__dirname, '../../../broadcastFiles/')
                          for (let j = 0; j < payload.length; j++) {
                            if (['image', 'audio', 'file', 'video'].indexOf(payload[j].componentType) > -1) {
                              let fileReaderStream = fs.createReadStream(dir + '/userfiles/' + payload[j].fileurl.name)
                              const messageData = {
                                'message': JSON.stringify({
                                  'attachment': {
                                    'type': payload[j].componentType,
                                    'payload': {
                                      'is_reusable': true
                                    }
                                  }
                                }),
                                'filedata': fileReaderStream
                              }
                              request(
                                {
                                  'method': 'POST',
                                  'json': true,
                                  'formData': messageData,
                                  'uri': 'https://graph.facebook.com/v2.6/me/message_attachments?access_token=' + pageAccessToken
                                },
                                function (err, resp) {
                                  if (err) {
                                    logger.serverLog(TAG, `ERROR! unable to upload attachment on Facebook: ${JSON.stringify(err)}`)
                                    return res.status(500).json({
                                      status: 'failed',
                                      description: `ERROR! unable to upload attachment on Facebook: ${JSON.stringify(err)}`
                                    })
                                  } else {
                                    logger.serverLog(TAG, `file uploaded on Facebook: ${JSON.stringify(resp.body)}`)
                                    payload[j].fileurl.attachment_id = resp.body.attachment_id
                                    logger.serverLog(TAG, `broadcast after attachment: ${JSON.stringify(payload[j])}`)
                                  }
                                })
                            }
                            if (payload[j].buttons) {
                              payload[j].buttons.forEach((button, bindex) => {
                                if (!(button.type === 'postback')) {
                                  let URLObject = new URL({
                                    originalURL: button.url,
                                    module: {
                                      id: broadcast._id,
                                      type: 'broadcast'
                                    }
                                  })
                                  URLObject.save((err, savedurl) => {
                                    if (err) logger.serverLog(TAG, err)
                                    let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
                                    payload[j].buttons[bindex].url = newURL
                                  })
                                }
                              })
                            }
                            if (payload[j].componentType === 'media' && payload[j].buttons) {
                              payload[j].buttons.forEach((button, bindex) => {
                                let URLObject = new URL({
                                  originalURL: button.url,
                                  module: {
                                    id: broadcast._id,
                                    type: 'broadcast'
                                  }
                                })
                                URLObject.save((err, savedurl) => {
                                  if (err) logger.serverLog(TAG, err)
                                  let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
                                  payload[j].buttons[bindex].url = newURL
                                })
                              })
                            }
                            if (payload[j].componentType === 'gallery') {
                              payload[j].cards.forEach((card, cindex) => {
                                card.buttons.forEach((button, bindex) => {
                                  let URLObject = new URL({
                                    originalURL: button.url,
                                    module: {
                                      id: broadcast._id,
                                      type: 'broadcast'
                                    }
                                  })
                                  URLObject.save((err, savedurl) => {
                                    if (err) logger.serverLog(TAG, err)
                                    let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
                                    payload[j].cards[cindex].buttons[bindex].url = newURL
                                  })
                                })
                              })
                            }
                            if (payload[j].componentType === 'list') {
                              payload[j].listItems.forEach((element, lindex) => {
                                if (element.buttons && element.buttons.length > 0) {
                                  element.buttons.forEach((button, bindex) => {
                                    let URLObject = new URL({
                                      originalURL: button.url,
                                      module: {
                                        id: broadcast._id,
                                        type: 'broadcast'
                                      }
                                    })
                                    URLObject.save((err, savedurl) => {
                                      if (err) logger.serverLog(TAG, err)
                                      let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
                                      payload[j].listItems[lindex].buttons[bindex].url = newURL
                                    })
                                  })
                                }
                                if (element.default_action) {
                                  let URLObject = new URL({
                                    originalURL: element.default_action.url,
                                    module: {
                                      id: broadcast._id,
                                      type: 'broadcast'
                                    }
                                  })
                                  URLObject.save((err, savedurl) => {
                                    if (err) logger.serverLog(TAG, err)
                                    let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
                                    payload[j].listItems[lindex].default_action.url = newURL
                                  })
                                }
                              })
                            }
                            if (i === (payload.length - 1)) {
                              utility.getBatchData(payload, subscriber.senderId, pages[i], sendBroadcast, subscriber.firstName, subscriber.lastName)
                            }
                          }
                        })
                      })
                    })
                  })
                })
              } else {
                let subscriberFindCriteria = {pageId: pages[i]._id, isSubscribed: true}
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

                Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
                  if (err) {
                    return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                  }
                  utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
                    taggedSubscribers.forEach((subscriber, index) => {
                      // update broadcast sent field
                      let pagebroadcast = new BroadcastPage({
                        pageId: pages[i].pageId,
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
                        try {
                          let updatedPayload = awaitt(updatePayload(payload, broadcast))
                          utility.getBatchData(updatedPayload, subscriber.senderId, pages[i], sendBroadcast, subscriber.firstName, subscriber.lastName)
                        } catch (error) {
                          return res.status(500).json({
                            status: 'failed',
                            description: `ERROR! unable to update payload: ${JSON.stringify(err)}`
                          })
                        }
                      })
                    })
                  })
                })
              }
            })
            if (i === (pages.length - 1)) {
              return res.status(200).json({
                status: 'success',
                payload: {broadcast: broadcast}
              })
            }
          }
        })
      })
    }
  })
})

const updatePayload = (payload, broadcast, pageAccessToken) => {
  return new Promise((resolve, reject) => {
    let dir = path.resolve(__dirname, '../../../broadcastFiles/')
    for (let j = 0; j <= payload.length; j++) {
      if (j === payload.length) {
        resolve(payload)
      }
      if (['image', 'audio', 'file', 'video'].indexOf(payload[j].componentType) > -1) {
        let fileReaderStream = fs.createReadStream(dir + '/userfiles/' + payload[j].fileurl.name)
        const messageData = {
          'message': JSON.stringify({
            'attachment': {
              'type': payload[j].componentType,
              'payload': {
                'is_reusable': true
              }
            }
          }),
          'filedata': fileReaderStream
        }
        request(
          {
            'method': 'POST',
            'json': true,
            'formData': messageData,
            'uri': 'https://graph.facebook.com/v2.6/me/message_attachments?access_token=' + pageAccessToken
          },
          function (err, resp) {
            if (err) {
              logger.serverLog(TAG, `ERROR! unable to upload attachment on Facebook: ${JSON.stringify(err)}`)
              reject(err)
            } else {
              logger.serverLog(TAG, `file uploaded on Facebook: ${JSON.stringify(resp.body)}`)
              payload[j].fileurl.attachment_id = resp.body.attachment_id
              logger.serverLog(TAG, `broadcast after attachment: ${JSON.stringify(payload[j])}`)
            }
          })
      }
      if (payload[j].buttons) {
        payload[j].buttons.forEach((button, bindex) => {
          if (!(button.type === 'postback')) {
            let URLObject = new URL({
              originalURL: button.url,
              module: {
                id: broadcast._id,
                type: 'broadcast'
              }
            })
            URLObject.save((err, savedurl) => {
              if (err) logger.serverLog(TAG, err)
              let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
              payload[j].buttons[bindex].url = newURL
            })
          }
        })
      }
      if (payload[j].componentType === 'media' && payload[j].buttons) {
        payload[j].buttons.forEach((button, bindex) => {
          let URLObject = new URL({
            originalURL: button.url,
            module: {
              id: broadcast._id,
              type: 'broadcast'
            }
          })
          URLObject.save((err, savedurl) => {
            if (err) logger.serverLog(TAG, err)
            let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
            payload[j].buttons[bindex].url = newURL
          })
        })
      }
      if (payload[j].componentType === 'gallery') {
        payload[j].cards.forEach((card, cindex) => {
          card.buttons.forEach((button, bindex) => {
            let URLObject = new URL({
              originalURL: button.url,
              module: {
                id: broadcast._id,
                type: 'broadcast'
              }
            })
            URLObject.save((err, savedurl) => {
              if (err) logger.serverLog(TAG, err)
              let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
              payload[j].cards[cindex].buttons[bindex].url = newURL
            })
          })
        })
      }
      if (payload[j].componentType === 'list') {
        payload[j].listItems.forEach((element, lindex) => {
          if (element.buttons && element.buttons.length > 0) {
            element.buttons.forEach((button, bindex) => {
              let URLObject = new URL({
                originalURL: button.url,
                module: {
                  id: broadcast._id,
                  type: 'broadcast'
                }
              })
              URLObject.save((err, savedurl) => {
                if (err) logger.serverLog(TAG, err)
                let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
                payload[j].listItems[lindex].buttons[bindex].url = newURL
              })
            })
          }
          if (element.default_action) {
            let URLObject = new URL({
              originalURL: element.default_action.url,
              module: {
                id: broadcast._id,
                type: 'broadcast'
              }
            })
            URLObject.save((err, savedurl) => {
              if (err) logger.serverLog(TAG, err)
              let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
              payload[j].listItems[lindex].default_action.url = newURL
            })
          }
        })
      }
    }
  })
}

const sendBroadcast = (batchMessages, page) => {
  const r = request.post('https://graph.facebook.com', (err, httpResponse, body) => {
    if (err) {
      return logger.serverLog(TAG, `Batch send error ${JSON.stringify(err)}`)
    }
    logger.serverLog(TAG, `Batch send response ${JSON.stringify(body)}`)
  })
  const form = r.form()
  form.append('access_token', page.accessToken)
  form.append('batch', batchMessages)
}

exports.upload = function (req, res) {
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
  logger.serverLog(TAG,
    `req.files.file ${JSON.stringify(req.files.file.path)}`)
  logger.serverLog(TAG,
    `req.files.file ${JSON.stringify(req.files.file.name)}`)
  logger.serverLog(TAG,
    `dir ${JSON.stringify(dir)}`)
  logger.serverLog(TAG,
    `serverPath ${JSON.stringify(serverPath)}`)
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
      // saving this file to send files with its original name
      // it will be deleted once it is successfully sent
      let readData = fs.createReadStream(dir + '/userfiles/' + serverPath)
      let writeData = fs.createWriteStream(dir + '/userfiles/' + req.files.file.name)
      readData.pipe(writeData)
      logger.serverLog(TAG,
        `file uploaded on KiboPush, sending response ${JSON.stringify({
          id: serverPath,
          url: `${config.domain}/api/broadcasts/download/${serverPath}`
        })}`)
      return res.status(201).json({
        status: 'success',
        payload: {
          id: serverPath,
          name: req.files.file.name,
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

exports.deleteFiles = function (req, res) {
  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
  req.body.forEach((file, i) => {
    fs.unlink(dir + '/' + file, (err) => {
      if (err) {
        logger.serverLog(TAG,
          `delete file, err = ${JSON.stringify(err)}`)
      } else if (i === req.body.length - 1) {
        res.status(404)
          .json({status: 'success', payload: 'Files deleted successfully!'})
      }
    })
  })
}

exports.delete = function (req, res) {
  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
  // unlink file
  fs.unlink(dir + '/' + req.params.id, function (err) {
    if (err) {
      logger.serverLog(TAG, err)
      return res.status(404)
        .json({status: 'failed', description: 'File not found'})
    } else {
      return res.status(200)
        .json({status: 'success', payload: 'File deleted successfully'})
    }
  })
}

exports.sendBroadcast = sendBroadcast
