/**
 * Created by sojharo on 19/09/2017.
 */

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

exports.prepareSendAPIPayload = prepareSendAPIPayload
exports.prepareBroadCastPayload = prepareBroadCastPayload
