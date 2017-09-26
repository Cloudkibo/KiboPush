/**
 * Created by sojharo on 19/09/2017.
 */

const logger = require('../../components/logger')
const TAG = 'api/broadcast/broadcasts.utility.js'
const fs = require('fs')

function prepareSendAPIPayload (subscriberId, body, cb) {
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
    let fileReaderStream = fs.createReadStream(body.fileurl)
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
    deleteFile(body.fileurl)
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
                'image_url': body.fileurl,
                'subtitle': body.description,
                'buttons': body.buttons
              }
            ]
          }
        }
      })
    }
    deleteFile(body.fileurl)
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
            'elements': [
              {
                'title': 'Welcome to KiboPush',
                'image_url': 'https://visualhunt.com/photos/l/7/details-studies-book.jpg',
                'subtitle': 'Send broadcast to your page audience.',
                'buttons': [
                  {
                    'type': 'web_url',
                    'url': 'http://kibopush.com',
                    'title': 'View Website'
                  }
                ]
              },
              {
                'title': 'Welcome to KiboEngage',
                'image_url': 'https://visualhunt.com/photos/l/7/details-studies-book.jpg',
                'subtitle': 'Engage your customers. Give them real time support.',
                'buttons': [
                  {
                    'type': 'web_url',
                    'url': 'http://kiboengage.kibosupport.com',
                    'title': 'View Website'
                  }
                ]
              }
            ]
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
    userId: req.user._id
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

function deleteFile (fileurl) {
  logger.serverLog(TAG,
    `Inside deletefile file Broadcast, fileurl = ${fileurl}`)
  // unlink file
  fs.unlink(fileurl, function (err) {
    if (err) {
      logger.serverLog(TAG, err)
    } else {
      logger.serverLog(TAG, 'file deleted')
    }
  })
}

exports.prepareSendAPIPayload = prepareSendAPIPayload
exports.prepareBroadCastPayload = prepareBroadCastPayload
