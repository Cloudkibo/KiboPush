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
const needle = require('needle')
const request = require('request')

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
        if (body.payload[i].description === undefined ||
          body.payload[i].description === '') return false
        if (body.payload[i].buttons === undefined) return false
        if (body.payload[i].buttons.length === 0) return false
        if (!utility.validateUrl(body.payload[i].fileurl.url)) return false
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
        if (body.payload[i].buttons) {
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

function prepareMessageData (page, subscriberId, body, fname, lname) {
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
              'image_url': body.fileurl.url,
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
function getBatchData (payload, recipientId, page, sendBroadcast, fname, lname) {
  let recipient = "recipient=" + encodeURIComponent(JSON.stringify({"id": recipientId}))
  let batch = []
  logger.serverLog(TAG, `Payload received to send: ${JSON.stringify(payload)}`)
  payload.forEach((item, index) => {
    // let message = "message=" + encodeURIComponent(JSON.stringify(prepareSendAPIPayload(recipientId, item).message))
    let message = "message=" + encodeURIComponent(JSON.stringify(prepareMessageData(page, recipientId, item, fname, lname)))
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

function uploadAndSend (res, pages, broadcastPayload, recipientId, sendBroadcast, fname, lname) {
  let dir = path.resolve(__dirname, '../../../broadcastFiles/')
  pages.forEach((page, index) => {
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
        for (let i = 0; i < broadcastPayload.length; i++) {
          logger.serverLog(TAG, `broadcast data: ${JSON.stringify(broadcastPayload[i])}`)
          logger.serverLog(TAG, (['image', 'audio', 'file', 'video'].indexOf(broadcastPayload[i].componentType) > -1))
          if (['image', 'audio', 'file', 'video'].indexOf(broadcastPayload[i].componentType) > -1) {
            let fileReaderStream = fs.createReadStream(dir + '/userfiles/' + broadcastPayload[i].fileurl.name)
            const messageData = {
              'message': JSON.stringify({
                'attachment': {
                  'type': broadcastPayload[i].componentType,
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
                  broadcastPayload[i].fileurl.attachment_id = resp.body.attachment_id
                  logger.serverLog(TAG, `broadcast after attachment: ${JSON.stringify(broadcastPayload[i])}`)
                }
              })
          }
        }
        getBatchData(broadcastPayload, recipientId, page, sendBroadcast, fname, lname)
        if (index === (pages.length - 1)) {
          return res.status(200).json({
            status: 'success',
            payload: {broadcast: broadcastPayload}
          })
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
exports.uploadAndSend = uploadAndSend
