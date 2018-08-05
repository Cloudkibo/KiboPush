/**
 * Created by sojharo on 19/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/broadcast/broadcasts2.controller.js'
const Broadcasts = require('./broadcasts.model')
const Pages = require('../pages/Pages.model')
const Lists = require('../lists/lists.model')
const URL = require('./../URLforClickedCount/URL.model')
const mongoose = require('mongoose')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const Subscribers = require('../subscribers/Subscribers.model')
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

function exists (list, content) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(content)) {
      return true
    }
  }
  return false
}

const operation = (index, length) => {
  if (index === length) {
    return true
  } else {
    return false
  }
}

const updatePayload = (self, payload, pageAccessToken, broadcast) => {
  let shouldReturn = false
  logger.serverLog(TAG, `Update Payload: ${JSON.stringify(payload)}`)
  for (let j = 0; j < payload.length; j++) {
    if (['image', 'audio', 'file', 'video', 'media'].indexOf(payload[j].componentType) > -1) {
      let uploadResponse = utility.uploadOnFacebook(payload[j], pageAccessToken)
      let interval = setInterval(() => {
        if (uploadResponse) {
          clearInterval(interval)
          if (uploadResponse.status === 'success') {
            payload[j] = uploadResponse.data
          } else {
            logger.serverLog(TAG, `ERROR! failed to upload attachment on Facebook: ${JSON.stringify(uploadResponse.data)}`)
          }
        }
      }, 1000)
      shouldReturn = operation(j, payload.length - 1)
    } else if (!self && payload[j].componentType === 'list') {
      payload[j].listItems.forEach((element, lindex) => {
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
        if (lindex === (payload[j].listItems.length - 1)) {
          shouldReturn = operation(j, payload.length - 1)
        }
      })
    } else {
      shouldReturn = operation(j, payload.length - 1)
    }
  }
  if (shouldReturn) {
    return payload
  }
}

const sendTestBroadcast = (companyUser, page, payload, req, res) => {
  PageAdminSubscriptions.findOne({companyId: companyUser.companyId, pageId: page._id, userId: req.user._id})
  .populate('userId').exec((err, subscriptionUser) => {
    if (err) {
      logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      return res.status(404)
      .json({status: 'failed', description: 'Pages subscription id not found'})
    }
    let temp = subscriptionUser.userId.facebookInfo.name.split(' ')
    let fname = temp[0]
    let lname = temp[1] ? temp[1] : ''
    utility.getBatchData(payload, subscriptionUser.subscriberId, page, sendBroadcast, fname, lname, res)
  })
}

const sendToSubscribers = (subscriberFindCriteria, req, res, page, broadcast, companyUser, payload) => {
  Subscribers.find(subscriberFindCriteria, (err, subscribers) => {
    if (err) {
      logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    utility.applyTagFilterIfNecessary(req, subscribers, (taggedSubscribers) => {
      taggedSubscribers.forEach((subscriber, index) => {
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
          utility.getBatchData(payload, subscriber.senderId, page, sendBroadcast, subscriber.firstName, subscriber.lastName, res)
        })
      })
    })
  })
}

const sendBroadcast = (batchMessages, page, res) => {
  const r = request.post('https://graph.facebook.com', (err, httpResponse, body) => {
    if (err) {
      logger.serverLog(TAG, `Batch send error ${JSON.stringify(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: `Failed to send broadcast ${JSON.stringify(err)}`
      })
    }
    // Following change is to incorporate persistant menu

    if (res === 'menu') {
      // we don't need to send res for persistant menu
    } else {
      logger.serverLog(TAG, `Batch send response ${JSON.stringify(body)}`)
      return res.status(200)
      .json({status: 'success', description: 'Conversation sent successfully!'})
    }
  })
  const form = r.form()
  form.append('access_token', page.accessToken)
  form.append('batch', batchMessages)
}

exports.sendConversation = function (req, res) {
  logger.serverLog(TAG, `Sending Broadcast ${JSON.stringify(req.body)}`)
  // validate braodcast
  if (!utility.validateInput(req.body)) {
    logger.serverLog(TAG, 'Parameters are missing.')
    return res.status(400)
    .json({status: 'failed', description: 'Please fill all the required fields'})
  }
  // restrict to one page
  if (req.body.segmentationPageIds.length !== 1) {
    return res.status(400)
    .json({status: 'failed', description: 'Please select only one page'})
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
    let pagesFindCriteria = {companyId: companyUser.companyId, connected: true, pageId: req.body.segmentationPageIds[0]}
    Pages.findOne(pagesFindCriteria).populate('userId').exec((err, page) => {
      if (err) {
        logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        return res.status(404)
        .json({status: 'failed', description: 'Pages not found'})
      }
      if (!page.userId || (page.userId && !page.userId.facebookInfo)) {
        logger.serverLog(TAG, `ERROR! Facebook Info not found`)
        return res.status(500).json({
          status: 'failed',
          description: `ERROR! Facebook Info not found`
        })
      }
      needle.get(
      `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${page.userId.facebookInfo.fbToken}`,
      (err, resp) => {
        if (err) {
          logger.serverLog(TAG, `ERROR! unable to get page access_token: ${JSON.stringify(err)}`)
          return res.status(500).json({
            status: 'failed',
            description: `ERROR! unable to get page access_token: ${JSON.stringify(err)}`
          })
        }
        let pageAccessToken = resp.body.access_token
        let payloadData = req.body.payload
        if (req.body.self) {
          let payload = updatePayload(req.body.self, payloadData, pageAccessToken)
          let interval = setInterval(() => {
            if (payload) {
              clearInterval(interval)
              sendTestBroadcast(companyUser, page, payload, req, res)
            }
          }, 3000)
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
            let payload = updatePayload(req.body.self, payloadData, pageAccessToken, broadcast)
            utility.addModuleIdIfNecessary(payloadData, broadcast._id) // add module id in buttons for click count
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
                let interval = setInterval(() => {
                  if (payload) {
                    clearInterval(interval)
                    sendToSubscribers(subsFindCriteria, req, res, page, broadcast, companyUser, payload)
                  }
                }, 3000)
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
              let interval = setInterval(() => {
                if (payload) {
                  clearInterval(interval)
                  sendToSubscribers(subscriberFindCriteria, req, res, page, broadcast, companyUser, payload)
                }
              }, 3000)
            }
          })
        }
      })
    })
  })
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

exports.addButton = function (req, res) {
  if (!_.has(req.body, 'type')) {
    return res.status(500).json({
      status: 'failed',
      description: 'Type is missing.'
    })
  }
  if (!_.has(req.body, 'title')) {
    return res.status(500).json({
      status: 'failed',
      description: 'Title is missing.'
    })
  }
  if (req.body.type === 'web_url' && !(_.has(req.body, 'url'))) {
    return res.status(500).json({
      status: 'failed',
      description: 'Url is required for type web_url.'
    })
  }
  if (req.body.type === 'postback' && !(_.has(req.body, 'sequenceId')) && !(_.has(req.body, 'action'))) {
    return res.status(500).json({
      status: 'failed',
      description: 'SequenceId & action are required for type postback'
    })
  }
  let buttonPayload = {
    title: req.body.title,
    type: req.body.type
  }
  if (req.body.type === 'web_url') {
    // TODO save module id when sending broadcast
    let URLObject = new URL({
      originalURL: req.body.url,
      module: {
        type: 'broadcast'
      }
    })
    URLObject.save((err, savedurl) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Failed to save url object ${err}`
        })
      }
      let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
      buttonPayload.newUrl = newURL
      buttonPayload.url = req.body.url
      return res.status(200).json({
        status: 'success',
        payload: buttonPayload
      })
    })
  } else {
    buttonPayload.payload = JSON.stringify({
      sequenceId: req.body.sequenceId,
      action: req.body.action
    })
    buttonPayload.sequenceValue = req.body.sequenceId
    return res.status(200).json({
      status: 'success',
      payload: buttonPayload
    })
  }
}

exports.editButton = function (req, res) {
  if (!_.has(req.body, 'type')) {
    return res.status(500).json({
      status: 'failed',
      description: 'Type is missing.'
    })
  }
  if (!_.has(req.body, 'title')) {
    return res.status(500).json({
      status: 'failed',
      description: 'Title is missing.'
    })
  }
  if (req.body.type === 'web_url' && !(_.has(req.body, 'newUrl'))) {
    return res.status(500).json({
      status: 'failed',
      description: 'Url is required for type web_url.'
    })
  }
  if (req.body.type === 'postback' && !(_.has(req.body, 'sequenceId')) && !(_.has(req.body, 'action'))) {
    return res.status(500).json({
      status: 'failed',
      description: 'SequenceId & action are required for type postback'
    })
  }
  let buttonPayload = {
    title: req.body.title,
    type: req.body.type
  }
  if (req.body.type === 'web_url') {
    // TODO save module id when sending broadcast
    let temp = req.body.oldUrl.split('/')
    let id = temp[temp.length - 1]
    URL.findOne({_id: mongoose.Types.ObjectId(id)}, (err, url) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Failed to find url object ${err}`
        })
      }
      url.originalURL = req.body.newUrl
      url.save((err, savedurl) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Failed to save url object ${err}`
          })
        }
        let newURL = config.domain + '/api/URL/broadcast/' + savedurl._id
        buttonPayload.newUrl = newURL
        buttonPayload.url = req.body.oldUrl
        return res.status(200).json({
          status: 'success',
          payload: { id: req.body.id, button: buttonPayload }
        })
      })
    })
  } else {
    buttonPayload.payload = JSON.stringify({
      sequenceId: req.body.sequenceId,
      action: req.body.action
    })
    buttonPayload.sequenceValue = req.body.sequenceId
    return res.status(200).json({
      status: 'success',
      payload: { id: req.body.id, button: buttonPayload }
    })
  }
}

exports.deleteButton = function (req, res) {
  URL.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}, (err, deleted) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    return res.status(200).json({
      status: 'success',
      description: 'Url deleted successfully!'
    })
  })
}

exports.sendBroadcast = sendBroadcast
