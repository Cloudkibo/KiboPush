const request = require('request')
const logger = require('../../../components/logger')
const TAG = 'api/smart_replies/utility.js'

exports.uploadToFacebook = (url, pageAccessToken) => {
  return new Promise((resolve, reject) => {
    const messageData = {
      'message': JSON.stringify({
        'attachment': {
          'type': 'video',
          'payload': {
            'url': url,
            'is_reusable': true
          }
        }
      })
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
          logger.serverLog(TAG, `unable to upload video on Facebook ${JSON.stringify(err)}`)
          reject(err)
        } else {
          logger.serverLog(TAG, `video uploaded on Facebook ${JSON.stringify(resp.body)}`)
          resolve(resp.body.attachment_id)
        }
      })
  })
}

exports.sendMessage = (messageData, pageAccessToken) => {
  request(
    {
      'method': 'POST',
      'json': true,
      'formData': messageData,
      'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
        pageAccessToken
    },
    (err, res) => {
      if (err) {
        return logger.serverLog(TAG,
          `At send message live chat ${JSON.stringify(err)}`)
      } else {
        if (res.statusCode !== 200) {
          logger.serverLog(TAG,
            `At send message live chat response ${JSON.stringify(
              res.body.error)}`)
        } else {
          logger.serverLog(TAG, `Response sent to Messenger: ${JSON.stringify(messageData)}`)
        }
      }
    })
}
