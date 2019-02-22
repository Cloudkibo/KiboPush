/**
 * Created by sojharo on 19/09/2017.
 */
const SequenceUtility = require('../sequenceMessaging/utility')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const logger = require('../../../components/logger')
const TAG = 'api/broadcast/broadcasts.utility.js'
const utility = require('../../../components/utility')
const TagSubscribers = require('./../tags_subscribers/tags_subscribers.model')
const SurveyResponses = require('./../surveys/surveyresponse.model')
const PollResponses = require('./../polls/pollresponse.model')
const URL = require('./../URLforClickedCount/URL.model')
const request = require('request')
const mongoose = require('mongoose')
const BroadcastPage = require('../page_broadcast/page_broadcast.model')
const PollPage = require('../page_poll/page_poll.model')
const SurveyPage = require('../page_survey/page_survey.model')
const LiveChat = require('../livechat/livechat.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')
const AutopostingSubscriberMessages = require('./../autoposting_messages/autoposting_subscriber_messages.model')
const Sequences = require('../sequenceMessaging/sequence.model')
const SequenceSubscribers = require('../sequenceMessaging/sequenceSubscribers.model')
const SequenceMessages = require('../sequenceMessaging/message.model')
const Subscribers = require('../subscribers/Subscribers.model')
const SequenceSubscriberMessages = require('./../sequenceMessaging/sequenceSubscribersMessages.model')
const youtubedl = require('youtube-dl')
const util = require('util')

function validateInput (body) {
  if (!_.has(body, 'platform')) return false
  if (!_.has(body, 'payload')) return false
  if (!_.has(body, 'title')) return false

  if (body.payload.length === 0) {
    return false
  } else {
    for (let i = 0; i < body.payload.length; i++) {
      if (body.payload[i].componentType === undefined) return false
      if (body.payload[i].componentType === 'text') {
        if (body.payload[i].text === undefined ||
          body.payload[i].text === '') return false
        if (body.payload[i].buttons) {
          for (let j = 0; j < body.payload[i].buttons.length; j++) {
            if (body.payload[i].buttons[j].type === 'web_url') {
              if (!utility.validateUrl(
                body.payload[i].buttons[j].url)) return false
            }
          }
        }
      }
      if (body.payload[i].componentType === 'card') {
        if (body.payload[i].title === undefined ||
          body.payload[i].title === '') return false
        if (body.payload[i].fileurl === undefined ||
          body.payload[i].fileurl === '') return false
        if (body.payload[i].image_url === undefined ||
          body.payload[i].image_url === '') return false
        if (body.payload[i].description === undefined ||
          body.payload[i].description === '') return false
        if (body.payload[i].buttons === undefined) return false
        if (body.payload[i].buttons.length === 0) return false
        if (!utility.validateUrl(body.payload[i].image_url)) return false
        for (let j = 0; j < body.payload[i].buttons.length; j++) {
          if (body.payload[i].buttons[j].type === 'web_url') {
            if (!utility.validateUrl(
              body.payload[i].buttons[j].url)) return false
          }
        }
      }
      if (body.payload[i].componentType === 'media') {
        if (body.payload[i].fileurl === undefined ||
          body.payload[i].fileurl === '') return false
        if (body.payload[i].mediaType === undefined ||
          body.payload[i].mediaType === '') return false
        for (let j = 0; j < body.payload[i].buttons.length; j++) {
          if (body.payload[i].buttons[j].type === 'web_url') {
            if (!utility.validateUrl(
              body.payload[i].buttons[j].url)) return false
          }
        }
      }
      if (body.payload[i].componentType === 'gallery') {
        if (body.payload[i].cards === undefined) return false
        if (body.payload[i].cards.length === 0) return false
        for (let j = 0; j < body.payload[i].cards.length; j++) {
          if (body.payload[i].cards[j].title === undefined ||
            body.payload[i].cards[j].title === '') return false
          if (body.payload[i].cards[j].image_url === undefined ||
            body.payload[i].cards[j].image_url === '') return false
          if (body.payload[i].cards[j].subtitle === undefined ||
            body.payload[i].cards[j].subtitle === '') return false
          if (body.payload[i].cards[j].buttons === undefined) return false
          if (body.payload[i].cards[j].buttons.length === 0) return false
          if (!utility.validateUrl(
            body.payload[i].cards[j].image_url)) return false
          for (let k = 0; k < body.payload[i].cards[j].buttons.length; k++) {
            if (body.payload[i].cards[j].buttons[k].type === 'web_url') {
              if (!utility.validateUrl(
                body.payload[i].cards[j].buttons[k].url)) return false
            }
          }
        }
      }
      if (body.payload[i].componentType === 'list') {
        if (body.payload[i].listItems === undefined) return false
        if (body.payload[i].listItems.length === 0) return false
        if (body.payload[i].topElementStyle === undefined ||
        body.payload[i].topElementStyle === '') return false
        for (let m = 0; m < body.payload[i].buttons.length; m++) {
          if (body.payload[i].buttons[m].type === undefined ||
          body.payload[i].buttons[m].type === '') return false
          if (body.payload[i].buttons[m].title === undefined ||
          body.payload[i].buttons[m].title === '') return false
          if (body.payload[i].buttons[m].type === 'web_url') {
            if (!utility.validateUrl(
              body.payload[i].buttons[m].url)) return false
          }
        }
        for (let j = 0; j < body.payload[i].listItems.length; j++) {
          if (body.payload[i].listItems[j].title === undefined ||
            body.payload[i].listItems[j].title === '') return false
          if (body.payload[i].listItems[j].subtitle === undefined ||
            body.payload[i].listItems[j].subtitle === '') return false
          if (body.payload[i].listItems[j].default_action && (
            body.payload[i].listItems[j].default_action.type === undefined ||
            body.payload[i].listItems[j].default_action.type === '')) return false
          if (body.payload[i].listItems[j].default_action && (
            body.payload[i].listItems[j].default_action.url === undefined ||
            body.payload[i].listItems[j].default_action.url === '')) return false
          if (body.payload[i].listItems[j].image_url && !utility.validateUrl(
              body.payload[i].listItems[j].image_url)) return false
          if (body.payload[i].listItems[j].buttons) {
            for (let k = 0; k < body.payload[i].listItems[j].buttons.length; k++) {
              if (body.payload[i].listItems[j].buttons[k].title === undefined ||
              body.payload[i].listItems[j].buttons[k].title === '') return false
              if (body.payload[i].listItems[j].buttons[k].type === undefined ||
              body.payload[i].listItems[j].buttons[k].type === '') return false
              if (body.payload[i].listItems[j].buttons[k].type === 'web_url') {
                if (!utility.validateUrl(
                    body.payload[i].listItems[j].buttons[k].url)) return false
              }
            }
          }
        }
      }
    }
  }

  return true
}

function prepareSendAPIPayload (subscriberId, body, fname, lname, isResponse) {
  let messageType = isResponse ? 'RESPONSE' : 'UPDATE'
  let payload = {}
  let text = body.text
  if (body.componentType === 'text' && !body.buttons) {
    if (body.text.includes('{{user_full_name}}') || body.text.includes('[Username]')) {
      text = text.replace(
        '{{user_full_name}}', fname + ' ' + lname)
    }
    if (body.text.includes('{{user_first_name}}')) {
      text = text.replace(
        '{{user_first_name}}', fname)
    }
    if (body.text.includes('{{user_last_name}}')) {
      text = text.replace(
        '{{user_last_name}}', lname)
    }
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'text': text,
        'metadata': 'This is a meta data'
      })
    }
    return payload
  } else if (body.componentType === 'text' && body.buttons) {
    if (body.text.includes('{{user_full_name}}') || body.text.includes('[Username]')) {
      text = text.replace(
        '{{user_full_name}}', fname + ' ' + lname)
    }
    if (body.text.includes('{{user_first_name}}')) {
      text = text.replace(
        '{{user_first_name}}', fname)
    }
    if (body.text.includes('{{user_last_name}}')) {
      text = text.replace(
        '{{user_last_name}}', lname)
    }
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'button',
            'text': text,
            'buttons': body.buttons
          }
        }
      })
    }
  } else if (['image', 'audio', 'file', 'video'].indexOf(
    body.componentType) > -1) {
    let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
    let fileReaderStream
    if (body.componentType === 'file') {
      fileReaderStream = fs.createReadStream(dir + '/' + body.fileurl.name)
    } else {
      fileReaderStream = fs.createReadStream(dir + '/' + body.fileurl.id)
    }

    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'attachment': {
          'type': body.componentType,
          'payload': {}
        }
      }),
      'filedata': fileReaderStream
    }
    return payload
    // todo test this one. we are not removing as we need to keep it for live chat
    // if (!isForLiveChat) deleteFile(body.fileurl)
  } else if (['gif', 'sticker', 'thumbsUp'].indexOf(
    body.componentType) > -1) {
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'attachment': {
          'type': 'image',
          'payload': {
            'url': body.fileurl
          }
        }
      })
    }
  } else if (body.componentType === 'card') {
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'generic',
            'elements': [
              {
                'title': body.title,
                'image_url': body.image_url,
                'subtitle': body.description,
                'buttons': body.buttons
              }
            ]
          }
        }
      })
    }
  } else if (body.componentType === 'gallery') {
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'generic',
            'elements': body.cards
          }
        }
      })
    }
  } else if (body.componentType === 'list') {
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'list',
            'top_element_style': body.topElementStyle,
            'elements': body.listItems,
            'buttons': body.buttons
          }
        }
      })
    }
  }
  return payload
}

function prepareBroadCastPayload (req, companyId) {
  let broadcastPayload = {
    platform: req.body.platform,
    payload: req.body.payload,
    userId: req.user._id,
    companyId,
    title: req.body.title
  }
  if (req.body.isSegmented) {
    broadcastPayload.isSegmented = true
    broadcastPayload.segmentationPageIds = (req.body.segmentationPageIds)
      ? req.body.segmentationPageIds
      : null
    broadcastPayload.segmentationGender = (req.body.segmentationGender)
      ? req.body.segmentationGender
      : null
    broadcastPayload.segmentationLocale = (req.body.segmentationLocale)
      ? req.body.segmentationLocale
      : null
    broadcastPayload.segmentationTags = (req.body.segmentationTags)
      ? req.body.segmentationTags
      : null
  }
  if (req.body.isList) {
    broadcastPayload.isList = true
    broadcastPayload.segmentationList = (req.body.segmentationList)
      ? req.body.segmentationList
      : null
  }
  return broadcastPayload
}

/* function deleteFile (fileurl) {
 logger.serverLog(TAG,
 `Inside deletefile file Broadcast, fileurl = ${fileurl}`)
 // unlink file
 fs.unlink(fileurl.id, function (err) {
 if (err) {
 logger.serverLog(TAG, err)
 } else {
 logger.serverLog(TAG, 'file deleted')
 }
 })
 } */

function parseUrl (text) {
  // eslint-disable-next-line no-useless-escape
  let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  let onlyUrl = ''
  if (text) {
    let testUrl = text.match(urlRegex)
    onlyUrl = testUrl && testUrl[0]
  }
  return onlyUrl
}

function applyTagFilterIfNecessary (req, subscribers, fn) {
  if (req.body.segmentationTags && req.body.segmentationTags.length > 0) {
    TagSubscribers.find({ tagId: { $in: req.body.segmentationTags } },
      (err, tagSubscribers) => {
        if (err) {
          return logger.serverLog(TAG,
            `At get tags subscribers ${JSON.stringify(err)}`)
        }
        let subscribersPayload = []
        for (let i = 0; i < subscribers.length; i++) {
          for (let j = 0; j < tagSubscribers.length; j++) {
            if (subscribers[i]._id.toString() ===
              tagSubscribers[j].subscriberId.toString()) {
              subscribersPayload.push({
                _id: subscribers[i]._id,
                firstName: subscribers[i].firstName,
                lastName: subscribers[i].lastName,
                locale: subscribers[i].locale,
                gender: subscribers[i].gender,
                timezone: subscribers[i].timezone,
                profilePic: subscribers[i].profilePic,
                companyId: subscribers[i].companyId,
                pageScopedId: '',
                email: '',
                senderId: subscribers[i].senderId,
                pageId: subscribers[i].pageId,
                datetime: subscribers[i].datetime,
                isEnabledByPage: subscribers[i].isEnabledByPage,
                isSubscribed: subscribers[i].isSubscribed,
                unSubscribedBy: subscribers[i].unSubscribedBy,
                source: subscribers[i].source
              })
            }
          }
        }
        fn(subscribersPayload)
      })
  } else {
    fn(subscribers)
  }
}

function applySurveyFilterIfNecessary (req, subscribers, fn) {
  if (req.body.segmentationSurvey && req.body.segmentationSurvey.length > 0) {
    SurveyResponses.find({ surveyId: { $in: req.body.segmentationSurvey } })
      .populate('subscriberId')
      .exec((err, responses) => {
        if (err) {
          return logger.serverLog(TAG,
            `At get survey responses subscribers ${JSON.stringify(err)}`)
        }
        let subscribersPayload = []
        for (let i = 0; i < subscribers.length; i++) {
          for (let j = 0; j < responses.length; j++) {
            if (subscribers[i]._id.toString() ===
              responses[j].subscriberId._id.toString()) {
              subscribersPayload.push({
                _id: subscribers[i]._id,
                firstName: subscribers[i].firstName,
                lastName: subscribers[i].lastName,
                locale: subscribers[i].locale,
                gender: subscribers[i].gender,
                timezone: subscribers[i].timezone,
                profilePic: subscribers[i].profilePic,
                companyId: subscribers[i].companyId,
                pageScopedId: '',
                email: '',
                senderId: subscribers[i].senderId,
                pageId: subscribers[i].pageId,
                datetime: subscribers[i].datetime,
                isEnabledByPage: subscribers[i].isEnabledByPage,
                isSubscribed: subscribers[i].isSubscribed,
                unSubscribedBy: subscribers[i].unSubscribedBy,
                source: subscribers[i].source
              })
            }
          }
        }
        fn(subscribersPayload)
      })
  } else {
    fn(subscribers)
  }
}
function applyPollFilterIfNecessary (req, subscribers, fn) {
  if (req.body.segmentationPoll && req.body.segmentationPoll.length > 0) {
    PollResponses.find({ pollId: { $in: req.body.segmentationPoll } })
      .populate('subscriberId')
      .exec((err, responses) => {
        if (err) {
          return logger.serverLog(TAG,
            `At get survey responses subscribers ${JSON.stringify(err)}`)
        }
        let subscribersPayload = []
        for (let i = 0; i < subscribers.length; i++) {
          for (let j = 0; j < responses.length; j++) {
            if (subscribers[i]._id.toString() ===
              responses[j].subscriberId._id.toString()) {
              subscribersPayload.push({
                _id: subscribers[i]._id,
                firstName: subscribers[i].firstName,
                lastName: subscribers[i].lastName,
                locale: subscribers[i].locale,
                gender: subscribers[i].gender,
                timezone: subscribers[i].timezone,
                profilePic: subscribers[i].profilePic,
                companyId: subscribers[i].companyId,
                pageScopedId: '',
                email: '',
                senderId: subscribers[i].senderId,
                pageId: subscribers[i].pageId,
                datetime: subscribers[i].datetime,
                isEnabledByPage: subscribers[i].isEnabledByPage,
                isSubscribed: subscribers[i].isSubscribed,
                unSubscribedBy: subscribers[i].unSubscribedBy,
                source: subscribers[i].source
              })
            }
          }
        }
        fn(subscribersPayload)
      })
  } else {
    fn(subscribers)
  }
}

function prepareMessageData (subscriberId, body, fname, lname) {
  let payload = {}
  let text = body.text
  console.log(body.buttons)
  if (body.componentType === 'text' && !body.buttons) {
    if (body.text.includes('{{user_full_name}}') || body.text.includes('[Username]')) {
      text = text.replace(
        '{{user_full_name}}', fname + ' ' + lname)
    }
    if (body.text.includes('{{user_first_name}}')) {
      text = text.replace(
        '{{user_first_name}}', fname)
    }
    if (body.text.includes('{{user_last_name}}')) {
      text = text.replace(
        '{{user_last_name}}', lname)
    }
    payload = {
      'text': text,
      'metadata': 'This is a meta data'
    }
    return payload
  } else if (body.componentType === 'text' && body.buttons) {
    if (body.text.includes('{{user_full_name}}') || body.text.includes('[Username]')) {
      text = text.replace(
        '{{user_full_name}}', fname + ' ' + lname)
    }
    if (body.text.includes('{{user_first_name}}')) {
      text = text.replace(
        '{{user_first_name}}', fname)
    }
    if (body.text.includes('{{user_last_name}}')) {
      text = text.replace(
        '{{user_last_name}}', lname)
    }
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': text,
          'buttons': body.buttons
        }
      }
    }
  } else if (['image', 'audio', 'file', 'video'].indexOf(
    body.componentType) > -1) {
    payload = {
      'attachment': {
        'type': body.componentType,
        'payload': {
          'attachment_id': body.fileurl.attachment_id
        }
      }
    }
    return payload
    // todo test this one. we are not removing as we need to keep it for live chat
    // if (!isForLiveChat) deleteFile(body.fileurl)
  } else if (['gif', 'sticker', 'thumbsUp'].indexOf(
    body.componentType) > -1) {
    payload = {
      'attachment': {
        'type': 'image',
        'payload': {
          'url': body.fileurl
        }
      }
    }
  } else if (body.componentType === 'card') {
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': [
            {
              'title': body.title,
              'image_url': body.image_url,
              'subtitle': body.description,
              'buttons': body.buttons
            }
          ]
        }
      }
    }
  } else if (body.componentType === 'gallery') {
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': body.cards
        }
      }
    }
  } else if (body.componentType === 'list') {
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'list',
          'top_element_style': body.topElementStyle,
          'elements': body.listItems,
          'buttons': body.buttons
        }
      }
    }
  } else if (body.componentType === 'media') {
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'media',
          'elements': [
            {
              'attachment_id': body.fileurl.attachment_id,
              'media_type': body.mediaType,
              'buttons': body.buttons
            }
          ]
        }
      }
    }
  }
  logger.serverLog(TAG,
    `Return Payload ${JSON.stringify(payload)}`)
  return payload
}

/* eslint-disable */
function getBatchData (payload, recipientId, page, sendBroadcast, fname, lname, res, subscriberNumber, subscribersLength, fbMessageTag) {
  let recipient = "recipient=" + encodeURIComponent(JSON.stringify({"id": recipientId}))
  logger.serverLog(TAG, `fbMessageTag: ${JSON.stringify(fbMessageTag)}`)
  let tag = "tag=" + encodeURIComponent(fbMessageTag)
  let messagingType = "messaging_type=" + encodeURIComponent("MESSAGE_TAG")
  let batch = []
  logger.serverLog(TAG, `Payload received to send: ${JSON.stringify(payload)}`)
  payload.forEach((item, index) => {
    // let message = "message=" + encodeURIComponent(JSON.stringify(prepareSendAPIPayload(recipientId, item).message))
    let message = "message=" + encodeURIComponent(JSON.stringify(prepareMessageData(recipientId, item, fname, lname)))
    if (index === 0) {
      batch.push({ "method": "POST", "name": `message${index + 1}`, "relative_url": "v2.6/me/messages", "body": recipient + "&" + message + "&" + messagingType +  "&" + tag})
    } else {
      batch.push({ "method": "POST", "name": `message${index + 1}`, "depends_on": `message${index}`, "relative_url": "v2.6/me/messages", "body": recipient + "&" + message + "&" + messagingType +  "&" + tag})
    }
    if (index === (payload.length - 1)) {
      logger.serverLog(TAG, `Batch: ${JSON.stringify(batch)}`)
      sendBroadcast(JSON.stringify(batch), page, res, subscriberNumber, subscribersLength)
    }
  })
}
/* eslint-enable */

function uploadOnFacebook (payloadItem, pageAccessToken) {
  return new Promise((resolve, reject) => {
    let dir = path.resolve(__dirname, '../../../../broadcastFiles/')
    let fileReaderStream = fs.createReadStream(dir + '/userfiles/' + payloadItem.fileurl.name)
    let type = payloadItem.componentType === 'media' ? payloadItem.mediaType : payloadItem.componentType
    const messageData = {
      'message': JSON.stringify({
        'attachment': {
          'type': type,
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
          payloadItem.fileurl.attachment_id = resp.body.attachment_id
          logger.serverLog(TAG, `broadcast after attachment: ${JSON.stringify(payloadItem)}`)
          resolve(payloadItem)
        }
      })
  })
}

function addModuleIdIfNecessary (payload, broadcastId) {
  for (let i = 0; i < payload.length; i++) {
    if (payload[i].buttons && payload[i].buttons.length > 0) {
      payload[i].buttons.forEach((button) => {
        if (button.url) {
          let temp = button.url.split('/')
          let urlId = temp[temp.length - 1]
          URL.findOne({_id: mongoose.Types.ObjectId(urlId)}, (err, URLObject) => {
            if (err) {
              logger.serverLog(TAG, `Line# 676: update module id failed for url: ${JSON.stringify(err)}`)
            }
            let module = URLObject.module
            module.id = broadcastId
            URLObject.module = module
            console.log(URLObject)
            URLObject.save((err2, savedurl) => {
              if (err) {
                logger.serverLog(TAG, `Line# 681: save url failed.: ${JSON.stringify(err)}`)
              }
              console.log(savedurl)
            })
          })
        }
      })
    } else if (payload[i].componentType === 'gallery') {
      payload[i].cards.forEach((card) => {
        card.buttons.forEach((button) => {
          if (button.url) {
            let temp = button.url.split('/')
            let urlId = temp[temp.length - 1]
            URL.findOne({_id: urlId}, (err, URLObject) => {
              if (err) {
                logger.serverLog(TAG, `Line# 696: update module id failed for url: ${JSON.stringify(err)}`)
              }
              URLObject.module.id = broadcastId
              URLObject.save((err2, savedurl) => {
                if (err) {
                  logger.serverLog(TAG, `Line# 701: save url failed.: ${JSON.stringify(err)}`)
                }
              })
            })
          }
        })
      })
    } else if (payload[i].componentType === 'list') {
      payload[i].listItems.forEach((element, lindex) => {
        if (element.buttons && element.buttons.length > 0) {
          element.buttons.forEach((button, bindex) => {
            if (button.url) {
              let temp = button.url.split('/')
              let urlId = temp[temp.length - 1]
              URL.findOne({_id: urlId}, (err, URLObject) => {
                if (err) {
                  logger.serverLog(TAG, `Line# 717: update module id failed for url: ${JSON.stringify(err)}`)
                }
                URLObject.module.id = broadcastId
                URLObject.save((err2, savedurl) => {
                  if (err) {
                    logger.serverLog(TAG, `Line# 722: save url failed.: ${JSON.stringify(err)}`)
                  }
                })
              })
            }
          })
        }
      })
    }
  }
}

function updateBroadcastSeen (req) {
  BroadcastPage.update({ pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
  { seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at updating broadcast seen ${JSON.stringify(err)}`)
    }
  })
}

function updatePollSeen (req) {
  PollPage.update({ pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
  { seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at updating poll seen ${JSON.stringify(err)}`)
    }
  })
}

function updateSurveySeen (req) {
  SurveyPage.update({ pageId: req.recipient.id, subscriberId: req.sender.id, seen: false },
  { seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
  })
}

function updateLivechatSeen (req) {
  LiveChat.update({sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id, seen: false, datetime: { $lte: new Date(req.read.watermark) }},
  { seenDateTime: new Date(req.read.watermark), seen: true }, { multi: true }, (err, updated) => {
    if (err) {
      logger.serverLog(TAG, `ERROR at updating live chat seen ${JSON.stringify(err)}`)
    }
    LiveChat.findOne({ sender_fb_id: req.recipient.id, recipient_fb_id: req.sender.id }, (err, chat) => {
      if (err) {
        logger.serverLog(TAG, `ERROR at finding live chat message in updateLivechatSeen ${JSON.stringify(err)}`)
      }
      logger.serverLog(TAG, `CHAT with updated seen ${req.recipient.id} ${req.sender.id} ${JSON.stringify(chat)}`)
      if (chat) {
        require('./../../../config/socketio').sendMessageToClient({
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
}

function updateAutopostingSeen (req) {
  AutopostingSubscriberMessages.distinct('autoposting_messages_id',
  { subscriberId: req.sender.id, pageId: req.recipient.id, seen: false },
  (err, AutopostingMessagesIds) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    AutopostingSubscriberMessages.update({subscriberId: req.sender.id, pageId: req.recipient.id, seen: false, datetime: { $lte: new Date(req.read.watermark) }},
    { seen: true }, { multi: true }, (err, updated) => {
      if (err) {
        logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
      }
      AutopostingMessagesIds.forEach(autopostingMessagesId => {
        AutopostingMessages.update({ _id: autopostingMessagesId },
        { $inc: { seen: 1 } }, { multi: true }, (err, updated) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
        })
      })
    })
  })
}

function updateSequenceSeen (req) {
  Subscribers.findOne({ senderId: req.sender.id }).exec((err, subscriber) => {
    if (err) {
      return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    if (subscriber) {
      SequenceSubscriberMessages.distinct('messageId',
        { subscriberId: subscriber._id, seen: false },
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
              datetime: { $lte: new Date(req.read.watermark) }
            },
            { seen: true },
            { multi: true }, (err, updated) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }

              sequenceMessagesIds.forEach((sequenceMessagesId, sIndex) => {
                SequenceMessages.update(
                  { _id: sequenceMessagesId },
                  { $inc: { seen: 1 } },
                  { multi: true }, (err, updated) => {
                    if (err) {
                      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                    }
                    // Logic to capture all seen messages for a sequence
                    let smIds = []   // Will contain the message ids against a specific sub AND sequnce
                    let length = sequenceMessagesIds.length - 1
                    // Checking if the last index and all seen have been inserted
                    if (sIndex === length) {
                      // Finding all the sequences of the subscriber
                      SequenceSubscribers.find({ subscriberId: subscriber._id }, (err, seqsubs) => {
                        if (err) {
                          logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                        }

                        if (seqsubs) {
                          // Iterating for each sequence
                          seqsubs.forEach((seqSub) => {
                            // finding messages of all sequences one by one
                            SequenceMessages.find({ sequenceId: seqSub.seqeunceId }, (err, sequenceMessages) => {
                              if (err) {
                                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                              }
                              // Inserting message ids against a specific subscriber and sequence
                              for (let i = 0, length = sequenceMessages.length; i < length; i++) {
                                smIds[i] = sequenceMessages[i]._id
                              }
                              // Finding all seen messages of that sequence
                              SequenceSubscriberMessages.find({ subscriberId: subscriber._id, seen: true, messageId: { $in: smIds } }, (err, seqsubmessages) => {
                                if (err) {
                                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                                }
                                // Checking if all the message of sequence have been seen
                                if (sequenceMessages.length === seqsubmessages.length) {
                                  // It means that all of the messages of sequence have been seen
                                  // Now we need to see if this sequence is added in trigger of any other sequences

                                  Sequences.find({ companyId: subscriber.companyId },
                                    (err, sequences) => {
                                      if (err) {
                                        return logger.serverLog(TAG, `ERROR getting sequence ${JSON.stringify(err)}`)
                                      }
                                      if (sequences) {
                                        sequences.forEach(sequence => {
                                          if (sequence.trigger && sequence.trigger.event) {
                                            logger.serverLog(TAG, `seqSub ${JSON.stringify(seqSub)}`)
                                            if (sequence.trigger.event === 'seen_all_sequence_messages' && (JSON.stringify(sequence.trigger.value) === JSON.stringify(seqSub.sequenceId))) {
                                              SequenceSubscribers.find({ subscriberId: subscriber._id, sequenceId: sequence._id }, (err, sequenceSubscriber) => {
                                                if (err) {
                                                  logger.serverLog(TAG,
                                                    `Internal Server Error ${JSON.stringify(err)}`)
                                                }
                                                if (sequenceSubscriber.length < 1) {
                                                  logger.serverLog(TAG, `ERROR getting sequence ${JSON.stringify(seqSub.sequenceId)}`)
                                                  SequenceMessages.find({ sequenceId: sequence._id }, (err, messages) => {
                                                    if (err) {
                                                      logger.serverLog(TAG, `ERROR getting sequence message${JSON.stringify(err)}`)
                                                    }
                                                    let sequenceSubscriberPayload = {
                                                      sequenceId: sequence._id,
                                                      subscriberId: subscriber._id,
                                                      companyId: subscriber.companyId,
                                                      status: 'subscribed'
                                                    }
                                                    const sequenceSubcriber = new SequenceSubscribers(sequenceSubscriberPayload)

                                                    sequenceSubcriber.save((err, subscriberCreated) => {
                                                      if (err) {
                                                        return logger.serverLog(TAG, `ERROR saving sequence subscriber{JSON.stringify(err)}`)
                                                      } else {
                                                        // insert socket.io code here
                                                        logger.serverLog(TAG, `Subscribed to sequence successfully`)
                                                      }
                                                      if (messages) {
                                                        messages.forEach(message => {
                                                          if (message.schedule.condition === 'immediately') {
                                                            SequenceUtility.addToMessageQueue(sequence._id, new Date(), message._id)
                                                          } else {
                                                            let d1 = new Date()
                                                            if (message.schedule.condition === 'hours') {
                                                              d1.setHours(d1.getHours() + Number(message.schedule.days))
                                                            } else if (message.schedule.condition === 'minutes') {
                                                              d1.setMinutes(d1.getMinutes() + Number(message.schedule.days))
                                                            } else if (message.schedule.condition === 'day(s)') {
                                                              d1.setDate(d1.getDate() + Number(message.schedule.days))
                                                            }
                                                            let utcDate = new Date(d1)
                                                            SequenceUtility.addToMessageQueue(sequence._id, utcDate, message._id)
                                                          }
                                                        })
                                                      }
                                                    })
                                                  })
                                                }
                                              })
                                            }
                                          }
                                        })
                                      }
                                    })
                                }
                              })  // seqsubmessages find ends here
                            })   // sequence messages find ends here
                          })   // seqsubs Foreach ends here
                        }
                      })   // Sequence Subscriber find ends here
                    }
                  })  // Sequence Message Update ends here
              })
            })
        })
    }
  })
}

const downloadVideo = (data) => {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/userfiles/')
  return new Promise((resolve, reject) => {
    let video = youtubedl(data.url)
    let downloaded = 0
    // let stream

    video.on('info', (info) => {
      console.log('Download started')
      console.log('filename: ' + info.filename)
      console.log('size: ' + info.size)
      // let size = info.size
      // if (size < 25000000) {
      //   stream = video.pipe(fs.createWriteStream(`${dir}/bot-video.mp4`))
      //   stream.on('error', (error) => {
      //     stream.end()
      //     reject(util.inspect(error))
      //   })
      //   stream.on('finish', () => {
      //     resolve(`${dir}/bot-video.mp4`)
      //   })
      // } else {
      //   resolve('ERR_LIMIT_REACHED')
      // }
    })
    let stream = video.pipe(fs.createWriteStream(`${dir}/bot-video.mp4`))
    video.on('data', (chunk) => {
      downloaded += chunk.length
      console.log(`Downloaded ${downloaded / 1000000}MB`)
      if (downloaded > 5000000) {
        stream.end()
        resolve(`bot-video.mp4`)
      }
    })
    stream.on('error', (error) => {
      stream.end()
      reject(util.inspect(error))
    })
    stream.on('finish', () => {
      resolve(`bot-video.mp4`)
    })
  })
}

const deleteVideo = () => {
  let dir = path.resolve(__dirname, '../../../../broadcastFiles/userfiles/')
  let serverPath = dir + '/bot-video.mp4'
  return new Promise((resolve, reject) => {
    fs.unlink(serverPath, (error) => {
      if (error) {
        reject(util.inspect(error))
      } else {
        resolve('Deleted successfully!')
      }
    })
  })
}

exports.prepareSendAPIPayload = prepareSendAPIPayload
exports.prepareBroadCastPayload = prepareBroadCastPayload
exports.parseUrl = parseUrl
exports.validateInput = validateInput
exports.applyTagFilterIfNecessary = applyTagFilterIfNecessary
exports.applySurveyFilterIfNecessary = applySurveyFilterIfNecessary
exports.applyPollFilterIfNecessary = applyPollFilterIfNecessary
exports.getBatchData = getBatchData
exports.prepareMessageData = prepareMessageData
exports.uploadOnFacebook = uploadOnFacebook
exports.addModuleIdIfNecessary = addModuleIdIfNecessary
exports.updateBroadcastSeen = updateBroadcastSeen
exports.updatePollSeen = updatePollSeen
exports.updateSurveySeen = updateSurveySeen
exports.updateLivechatSeen = updateLivechatSeen
exports.updateAutopostingSeen = updateAutopostingSeen
exports.updateSequenceSeen = updateSequenceSeen
exports.downloadVideo = downloadVideo
exports.deleteVideo = deleteVideo
