const fs = require('fs')
const path = require('path')
// eslint-disable-next-line no-unused-vars
const logger = require('../../components/logger')
// eslint-disable-next-line no-unused-vars
const TAG = 'api/facebook_posts/facebook_posts.utility.js'

function prepareSendAPIPayload (body) {
  let payload = {}
  if (body.componentType === 'text') {
    payload = {
      'message': body.text
    }
    return payload
  } else if (['image', 'audio', 'file', 'video'].indexOf(
      body.componentType) > -1) {
    // let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
    // let fileReaderStream = fs.createReadStream(dir + '/' + body.id)
    payload = {
      // 'message': JSON.stringify({
      //   'attachment': {
      //     'type': body.componentType,
      //     'payload': {}
      //   }
      // }),
      // 'filedata': fileReaderStream
      'url': body.url
    }
    return payload
    // todo test this one. we are not removing as we need to keep it for live chat
    // if (!isForLiveChat) deleteFile(body.fileurl)
  }
  return payload
}
exports.prepareSendAPIPayload = prepareSendAPIPayload
