/**
 * Created by sojharo on 19/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/broadcast/broadcasts.controller.js'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const utility = require('../../components/utility')

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
        if (body.payload[i].text === undefined) return false
        if (body.payload[i].buttons) {
          for (let j = 0; j < body.payload[i].buttons.length; j++) {
            if (body.payload[i].buttons[j].type === 'web_url') {
              if (!utility.validateUrl(body.payload[i].buttons[j].url)) return false
            }
          }
        }
      }
      if (body.payload[i].componentType === 'card') {
        if (body.payload[i].title === undefined) return false
        if (body.payload[i].fileurl === undefined) return false
        if (body.payload[i].image_url === undefined) return false
        if (body.payload[i].description === undefined) return false
        if (body.payload[i].buttons === undefined) return false
        if (body.payload[i].buttons.length === 0) return false
        if (!utility.validateUrl(body.payload[i].image_url)) return false
        for (let j = 0; j < body.payload[i].buttons.length; j++) {
          if (body.payload[i].buttons[j].type === 'web_url') {
            if (!utility.validateUrl(body.payload[i].buttons[j].url)) return false
          }
        }
      }
      if (body.payload[i].componentType === 'gallery') {
        if (body.payload[i].cards === undefined) return false
        if (body.payload[i].cards.length === 0) return false
        for (let j = 0; j < body.payload[i].cards.length; j++) {
          if (body.payload[i].cards[j].title === undefined) return false
          if (body.payload[i].cards[j].image_url === undefined) return false
          if (body.payload[i].cards[j].subtitle === undefined) return false
          if (body.payload[i].cards[j].buttons === undefined) return false
          if (body.payload[i].cards[j].buttons.length === 0) return false
          if (!utility.validateUrl(body.payload[i].cards[j].image_url)) return false
          for (let k = 0; k < body.payload[i].cards[j].buttons.length; k++) {
            if (body.payload[i].cards[j].buttons[k].type === 'web_url') {
              if (!utility.validateUrl(body.payload[i].cards[j].buttons[k].url)) return false
            }
          }
        }
      }
    }
  }

  return true
}

function prepareSendAPIPayload (subscriberId, body, isForLiveChat) {
  logger.serverLog(TAG,
    `subscriberId: ${body}`)
  logger.serverLog(TAG,
    `body: ${JSON.stringify(
      body)}`)
  logger.serverLog(TAG,
    `body: ${body}`)
  let payload = {}
  if (body.componentType === 'text' && !body.buttons) {
    payload = {
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
    let fileReaderStream = fs.createReadStream(dir + '/' + body.fileurl.id)
    payload = {
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
    // todo test this one. we are not removing as we need to keep it for live chat
    // if (!isForLiveChat) deleteFile(body.fileurl)
  } else if (['gif', 'sticker', 'thumbsUp'].indexOf(
      body.componentType) > -1) {
    payload = {
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
  }
  return payload
}

function prepareBroadCastPayload (req) {
  let broadcastPayload = {
    platform: req.body.platform,
    payload: req.body.payload,
    userId: req.user._id,
    title: req.body.title
  }
  if (req.body.isSegmented) {
    broadcastPayload.isSegmented = true
    broadcastPayload.segmentationPageIds = (req.body.pageIds)
      ? req.body.pageIds
      : null
    broadcastPayload.segmentationGender = (req.body.gender)
      ? req.body.gender
      : null
    broadcastPayload.segmentationLocale = (req.body.locale)
      ? req.body.locale
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

exports.prepareSendAPIPayload = prepareSendAPIPayload
exports.prepareBroadCastPayload = prepareBroadCastPayload
exports.parseUrl = parseUrl
exports.validateInput = validateInput
