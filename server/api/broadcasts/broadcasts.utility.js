/**
 * Created by sojharo on 19/09/2017.
 */

// const logger = require('../../components/logger')
// const TAG = 'api/broadcast/broadcasts.controller.js'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/broadcast/broadcasts.utility.js'
const utility = require('../../components/utility')
const TagSubscribers = require('./../tags_subscribers/tags_subscribers.model')
const SurveyResponses = require('./../surveys/surveyresponse.model')
const PollResponses = require('./../polls/pollresponse.model')

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
        if (body.payload[i].cards === undefined) return false
        if (body.payload[i].cards.length === 0) return false
        for (let j = 0; j < body.payload[i].cards.length; j++) {
          if (body.payload[i].cards[j].title === undefined ||
            body.payload[i].cards[j].title === '') return false
          if (body.payload[i].cards[j].image_url === undefined ||
            body.payload[i].cards[j].image_url === '') return false
        }
      }
    }
  }

  return true
}

function prepareSendAPIPayload(subscriberId, body, isResponse) {
  let messageType = isResponse ? 'RESPONSE' : 'UPDATE'
  let payload = {}
  if (body.componentType === 'text' && !body.buttons) {
    payload = {
      'messaging_type': messageType,
      'recipient': JSON.stringify({
        'id': subscriberId
      }),
      'message': JSON.stringify({
        'text': body.text,
        'metadata': 'This is a meta data'
      })
    }
    return payload
  } else if (body.componentType === 'text' && body.buttons) {
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
            'text': body.text,
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
            'elements': body.cards,
            'buttons': body.buttons
          }
        }
      })
    }
  }
  return payload
}

function prepareBroadCastPayload(req, companyId) {
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

function parseUrl(text) {
  // eslint-disable-next-line no-useless-escape
  let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  let onlyUrl = ''
  if (text) {
    let testUrl = text.match(urlRegex)
    onlyUrl = testUrl && testUrl[0]
  }
  return onlyUrl
}

function applyTagFilterIfNecessary(req, subscribers, fn) {
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

function applySurveyFilterIfNecessary(req, subscribers, fn) {
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
function applyPollFilterIfNecessary(req, subscribers, fn) {
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


function prepareMessageData (subscriberId, body, name) {
  let payload = {}
  if (body.componentType === 'text' && !body.buttons) {
    if (body.text.includes('{{user_full_name}}')) {
      body.text = body.text.replace(
        '{{user_full_name}}', name)
    }
    payload = {
      'text': body.text,
      'metadata': 'This is a meta data'
    }
    return payload
  } else if (body.componentType === 'text' && body.buttons) {
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': body.text,
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
  }
  return payload
}

/* eslint-disable */
function getBatchData (payload, recipientId, page, sendBroadcast, name) {
  let recipient = "recipient=" + encodeURIComponent(JSON.stringify({"id": recipientId}))
  let batch = []  // to display typing on bubble :)
  payload.forEach((item, index) => {
    // let message = "message=" + encodeURIComponent(JSON.stringify(prepareSendAPIPayload(recipientId, item).message))
    let message = "message=" + encodeURIComponent(JSON.stringify(prepareMessageData(recipientId, item, name)))
    if (index === 0) {
      batch.push({ "method": "POST", "name": `message${index + 1}`, "relative_url": "v2.6/me/messages", "body": recipient + "&" + message })
    } else {
      batch.push({ "method": "POST", "name": `message${index + 1}`, "depends_on": `message${index}`, "relative_url": "v2.6/me/messages", "body": recipient + "&" + message })
    }
    if (index === (payload.length - 1)) {
      sendBroadcast(JSON.stringify(batch), page)
    }
  })
}
/* eslint-enable */

exports.prepareSendAPIPayload = prepareSendAPIPayload
exports.prepareBroadCastPayload = prepareBroadCastPayload
exports.parseUrl = parseUrl
exports.validateInput = validateInput
exports.applyTagFilterIfNecessary = applyTagFilterIfNecessary
exports.applySurveyFilterIfNecessary = applySurveyFilterIfNecessary
exports.applyPollFilterIfNecessary = applyPollFilterIfNecessary
exports.getBatchData = getBatchData
