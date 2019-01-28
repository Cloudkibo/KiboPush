import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllMessengerAds (data) {
  return {
    type: ActionTypes.SHOW_MESSENGER_ADS,
    data
  }
}
export function saveCurrentJsonAd (data) {
  return {
    type: ActionTypes.SAVE_CURRENT_JSON_AD,
    data
  }
}

export function setDefaultAdMessage (data) {
  return {
    type: ActionTypes.SET_DEFAULT_JSON_AD,
    data
  }
}

export function showJSONCode (data) {
  return {
    type: ActionTypes.SHOW_JSON_CODE,
    data
  }
}
export function updateCurrentJsonAd (messengerAd, updateKey, updateValue, edit) {
  return (dispatch) => {
    console.log('updateKey', updateKey)
    console.log('updateValue', updateValue)
    if (edit) {
      messengerAd = edit
    } else {
      messengerAd[updateKey] = updateValue
    }
    dispatch(saveCurrentJsonAd(messengerAd))
  }
}
export function fetchMessengerAds () {
  return (dispatch) => {
    callApi('jsonAd').then(res => {
      console.log('response from fetchMessengerAds', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllMessengerAds(res.payload))
      }
    })
  }
}
export function fetchMessengerAd (jsonAdId, updatePreview) {
  return (dispatch) => {
    callApi(`jsonAd/${jsonAdId}`).then(res => {
      console.log('response from fetchMessengerAd', res)
      if (res.status === 'success' && res.payload) {
        var data = res.payload
        var payload = {
          pageId: data.jsonAd.pageId,
          jsonAdId: data.jsonAd._id,
          title: data.jsonAd.title,
          jsonAdMessages: data.jsonAdMessages
        }
        dispatch(saveCurrentJsonAd(payload))
        updatePreview()
      }
    })
  }
}
export function deleteMessengerAd (id, msg) {
  return (dispatch) => {
    callApi(`jsonAd/delete/${id}`, 'delete').then(res => {
      console.log('response from delete json ad', res)
      if (res.status === 'success') {
        msg.success('JSON ad has been deleted')
        dispatch(fetchMessengerAds())
      } else {
        msg.error('Failed to delete Messenger Ad')
      }
    })
  }
}

export function saveJsonAd (data, msg, handleSave) {
  console.log('data in saveMessengerAd', data)
  return (dispatch) => {
    callApi('jsonAd/create', 'post', data)
      .then(res => {
        console.log('response from messengerAds', res)
        if (res.status === 'success') {
          var data = res.payload
          var payload = {
            pageId: data.jsonAd.pageId,
            jsonAdId: data.jsonAd._id,
            title: data.jsonAd.title,
            jsonAdMessages: data.jsonAdMessages
          }
          dispatch(saveCurrentJsonAd(payload))
          msg.success('Json Ad saved successfully')
          handleSave()
        } else {
          msg.error('Unable to save Json Ad')
        }
      })
  }
}

export function editJsonAd (data, msg, handleEdit) {
  console.log('data in saveMessengerAd', data)
  return (dispatch) => {
    callApi('jsonAd/edit', 'post', data)
      .then(res => {
        console.log('response from messengerAds', res)
        if (res.status === 'success') {
          var data = res.payload
          var payload = {
            pageId: data.jsonAd.pageId,
            jsonAdId: data.jsonAd._id,
            title: data.jsonAd.title,
            jsonAdMessages: data.jsonAdMessages
          }
          dispatch(saveCurrentJsonAd(payload))
          handleEdit()
          msg.success('Message saved successfully')
        } else {
          msg.error('Unable to save message')
        }
      })
  }
}
export function createJsonPayload (obj) {
  return (dispatch) => {
    var data = JSON.parse(obj)
    var jsonAd = {}
    for (var i = 0; i < data.length; i++) {
      if (!data[i].jsonAdMessageParentId) {
        jsonAd = data[i]
        break
      }
    }
    let jsonObject = []
    for (var j = 0; j < jsonAd.messageContent.length; j++) {
      let messageJson = prepareJsonPayload(data, jsonAd.messageContent[j])
      jsonObject.push({message: messageJson})
    }
    dispatch(showJSONCode(JSON.stringify(jsonObject, null, 4)))
  }
}

const prepareJsonPayload = (data, optinMessage) => {
  let payload = {}
  let body = optinMessage
  let text = body.text
  var buttonPayload = []
  var button = {}
  if (body.buttons && body.buttons.length > 0) {
    for (var i = 0; i < body.buttons.length; i++) {
      button = body.buttons[i]
      var jsonAdMessageId
      if (button.payload && button.type === 'postback') {
        for (var j = 0; j < data.length; j++) {
          if ((button.payload).toString() === (data[j].jsonAdMessageId).toString()) {
            jsonAdMessageId = data[j]._id
            break
          }
        }
        button.payload = 'JSONAD-' + jsonAdMessageId
      } else if (button.type === 'web_url') {
        if (button.newUrl) {
          delete button.newUrl
        }
      }
      buttonPayload.push(button)
    }
  } else {
    buttonPayload = body.buttons
  }
  if (body.componentType === 'text' && !body.buttons) {
    payload = {
      'text': text,
      'metadata': 'This is a meta data'
    }
  } else if (body.componentType === 'text' && body.buttons) {
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': text,
          'buttons': buttonPayload
        }
      }
    }
  } else if (['image', 'audio', 'file', 'video'].indexOf(
    body.componentType) > -1) {
    payload = {
      'attachment': {
        'type': body.componentType,
        'payload': {
          'url': body.fileurl.url
        }
      }
    }
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
              'buttons': buttonPayload
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
          'buttons': buttonPayload
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
              'url': body.fileurl.url,
              'media_type': body.mediaType,
              'buttons': buttonPayload
            }
          ]
        }
      }
    }
  }
  return payload
}
