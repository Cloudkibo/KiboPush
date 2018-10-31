const logger = require('../../../components/logger')
const TAG = 'api/smart_replies/bots.controller.js'
const utility = require('./../broadcasts/broadcasts.utility')
const fs = require('fs')
const youtubedl = require('youtube-dl')
const path = require('path')
const needle = require('needle')
const request = require('request')
const Bots = require('./Bots.model')
const Pages = require('../pages/Pages.model')
const util = require('util')

const dir = path.resolve(__dirname, '../../../../smart-replies-files/')

const downloadVideo = (data) => {
  return new Promise((resolve, reject) => {
    let video = youtubedl(data.url, ['--format=18'], { cwd: __dirname })

    video.on('info', (info) => {
      logger.serverLog(TAG, 'Download started')
      logger.serverLog(TAG, 'filename: ' + info.filename)
      logger.serverLog(TAG, 'size: ' + info.size)
    })

    let stream = video.pipe(fs.createWriteStream(`${dir}bot-video.mp4`))
    stream.on('error', (error) => {
      stream.end()
      reject(util.inspect(error))
    })
    stream.on('finish', () => {
      resolve(`${dir}bot-video.mp4`)
    })
  })
}

const uploadVideo = (data) => {
  return new Promise((resolve, reject) => {
    needle.get(
      `https://graph.facebook.com/v2.10/${data.pageId}?fields=access_token&access_token=${data.userAccessToken}`,
      (err, resp2) => {
        if (err) {
          logger.serverLog(TAG, `Failed to get page access_token ${JSON.stringify(err)}`)
          reject(util.inspect(err))
        }
        let pageAccessToken = resp2.body.access_token
        let fileReaderStream = fs.createReadStream(`${dir}${data.serverPath}`)
        const messageData = {
          'message': JSON.stringify({
            'attachment': {
              'type': 'video',
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
              logger.serverLog(TAG, `Failed to upload attachment on Facebook ${JSON.stringify(err)}`)
              reject(util.inspect(err))
            } else {
              logger.serverLog(TAG, `video uploaded on Facebook ${JSON.stringify(resp.body)}`)
              resolve(resp.body.attachment_id)
            }
          })
      })
  })
}

const deleteVideo = (data) => {
  return new Promise((resolve, reject) => {
    fs.unlink(data.serverPath, (error) => {
      if (error) {
        reject(util.inspect(error))
      } else {
        resolve('Deleted successfully!')
      }
    })
  })
}

const fetchPage = (botId) => {
  return new Promise((resolve, reject) => {
    Bots.findOne({_id: botId}).exec()
      .then(bot => {
        Pages.findOne({_id: bot.pageId}).populate('userId').exec()
          .then(page => {
            resolve(page)
          })
          .catch(err => {
            reject(util.inspect(err))
          })
      })
      .catch(err => {
        reject(util.inspect(err))
      })
  })
}

exports.getMessageData = (data) => {
  return new Promise((resolve, reject) => {
    let messageData = {}
    if (data.attachment_id) {
      logger.serverLog(TAG, `video message`)
      messageData = {
        'recipient': JSON.stringify({
          'id': data.senderId
        }),
        'message': JSON.stringify({
          'attachment': {
            'type': 'video',
            'payload': {
              'attachment_id': data.attachment_id
            }
          }
        })
      }
      resolve(messageData)
    } else if (data.videoLink) {
      logger.serverLog(TAG, `template message`)
      messageData = {
        'recipient': JSON.stringify({
          'id': data.senderId
        }),
        'message': JSON.stringify({
          'attachment': {
            'type': 'attachment',
            'payload': {
              'template_type': 'open_graph',
              'elements': [
                {
                  'url': data.videoLink
                }
              ]
            }
          }
        })
      }
      resolve(messageData)
    } else {
      logger.serverLog(TAG, `text message`)
      messageData = utility.prepareSendAPIPayload(
        data.senderId,
        { 'componentType': 'text',
          'text': data.answer + '  (Bot)',
          'buttons': [{ 'type': 'postback',
            'title': 'Talk to Agent',
            'payload': JSON.stringify(data.postbackPayload)
          }] },
        data.subscriber.firstName,
        data.subscriber.lastName,
        true)
      resolve(messageData)
    }
  })
}

exports.updatePayloadForVideo = (botId, payload) => {
  return new Promise((resolve, reject) => {
    /* eslint-disable no-useless-escape */
    let videoRegex = new RegExp(`^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$`, 'g')
    let YouTubeRegex = new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+', 'g')
    /* eslint-enable no-useless-escape */
    for (let i = 0; i < payload.length; i++) {
      if (videoRegex.test(payload[i].answer)) {
        // Check if youtube url
        if (YouTubeRegex.test(payload[i].answer)) {
          let data = {
            url: payload[i].answer
          }
          // fetch page data
          let fetchedPage = fetchPage(botId)
          // download youtube video
          let downloadedVideo = fetchedPage.then(result => {
            data.userAccessToken = result.userId.facebookInfo
            data.pageId = result.pageId
            downloadVideo(data)
          })
          // upload on facebook
          let uploadedVideo = downloadedVideo.then(path => {
            data.serverPath = path
            uploadVideo(data)
          })
          // delete video
          uploadedVideo.then(attachmentId => {
            data.attachment_id = attachmentId
            payload[i].attachment_id = attachmentId
            deleteVideo(data)
          })
        } else {
          payload[i].videoLink = payload[i].answer
        }
      }
      if (i === (payload.length - 1)) {
        resolve(payload)
      }
    }
  })
}
