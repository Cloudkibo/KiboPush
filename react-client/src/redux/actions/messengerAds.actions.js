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

export function clearMessengerAd () {
  return {
    type: ActionTypes.CLEAR_MESSENGER_AD,
    data: null
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
        let data = res.payload
        let jsonMessages = data.jsonAdMessages
        for (var l = jsonMessages.length-1; l >= 0; l--) {
          for (let i = 0; i < jsonMessages[l].messageContent.length; i++) {
            let messageContent = jsonMessages[l].messageContent[i]
            if (messageContent.cards) {
              for (let j = 0; j < messageContent.cards.length; j++) {
                for (let k = 0; k < messageContent.cards[j].buttons.length; k++) {
                  if (messageContent.cards[j].buttons[k].payload && messageContent.cards[j].buttons[k].type === 'postback') {
                    let buttonPayload = JSON.parse(messageContent.cards[j].buttons[k].payload)
                    if (Number.isInteger(buttonPayload)) {
                      jsonMessages[l].messageContent[i].cards[j].buttons[k].payload = JSON.stringify([{action: 'send_message_block', blockUniqueId: buttonPayload+''}])
                    }
                  }
                }
              }
            } else if (messageContent.buttons) {
              for (let j = 0; j < messageContent.buttons.length; j++) {
                if (messageContent.buttons[j].payload && messageContent.buttons[j].type === 'postback') {
                  let buttonPayload = JSON.parse(messageContent.buttons[j].payload)
                  if (Number.isInteger(buttonPayload)) {
                    jsonMessages[l].messageContent[i].buttons[j].payload = JSON.stringify([{action: 'send_message_block', blockUniqueId: buttonPayload+''}])
                  }
                }
              }
            }
          } 
        }
        let payload = {
          // pageId: data.jsonAd.pageId,
          jsonAdId: data.jsonAd._id,
          title: data.jsonAd.title,
          jsonAdMessages: jsonMessages
        }
        dispatch(saveCurrentJsonAd(payload))
        updatePreview(res.payload)
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
        msg.error('Failed to delete JSON Ad')
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
          let data = res.payload
          let payload = {
            // pageId: data.jsonAd.pageId,
            jsonAdId: data.jsonAd._id,
            title: data.jsonAd.title,
            jsonAdMessages: data.jsonAdMessages
          }
          dispatch(saveCurrentJsonAd(payload))
          msg.success('JSON Ad saved successfully')
          handleSave()
        } else {
          msg.error('Unable to save JSON Ad')
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
          let data = res.payload
          let payload = {
            // pageId: data.jsonAd.pageId,
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
    let data = JSON.parse(obj)
    let jsonAd = {}
    for (let i = 0; i < data.length; i++) {
      if (!data[i].jsonAdMessageParentId) {
        jsonAd = data[i]
        break
      }
    }
    let jsonObject = []
    for (let j = 0; j < jsonAd.messageContent.length; j++) {
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
  let buttonPayload = []
  let button = {}
  if (body.buttons && body.buttons.length > 0) {
    for (let i = 0; i < body.buttons.length; i++) {
      button = body.buttons[i]
      let jsonAdMessageId
      if (button.payload && button.type === 'postback') {
        let postbackPayload = JSON.parse(button.payload)
        for (let j = 0; j < data.length; j++) {
          for (let k = 0; k < postbackPayload.length; k++) {
            if ((postbackPayload[k].blockUniqueId).toString() === (data[j].jsonAdMessageId).toString()) {
              jsonAdMessageId = data[j]._id
              break
            }
          }
        }
        button.payload = 'JSONAD-' + jsonAdMessageId
      } else if (button.type === 'web_url') {
        if (button.newUrl) {
          delete button.newUrl
        }
      }
      if (button.id) {
        delete button.id
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
          'url': body.file ? body.file.fileurl.url : body.fileurl.url
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
    let cards = []
    if (body.cards && body.cards.length > 0) {
      for (let m = 0; m < body.cards.length; m++) {
        let cButtons = []
        let card = {}
        card.title = body.cards[m].title
        card.image_url = body.cards[m].image_url
        card.subtitle = body.cards[m].subtitle
        card.description = body.cards[m].description
        let cardButtons = body.cards[m].buttons
        if (cardButtons) {
          for (let c = 0; c < cardButtons.length; c++) {
            let cbutton = cardButtons[c]
            let jsonAdMessageId
            if (cbutton.payload && cbutton.type === 'postback') {
              for (let j = 0; j < data.length; j++) {
                if ((cbutton.payload).toString() === (data[j].jsonAdMessageId).toString()) {
                  jsonAdMessageId = data[j]._id
                  break
                }
              }
            cbutton.payload = 'JSONAD-' + jsonAdMessageId
            } else if (cbutton.type === 'web_url') {
              if (cbutton.newUrl) {
                delete cbutton.newUrl
              }
            }
            cButtons.push(cbutton)
          }
        }
        card.buttons = cButtons
        cards.push(card)
      }
    }
    payload = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': cards
        }
      }
    }
  } else if (body.componentType === 'list') {
    if (body.listItems && body.listItems.length > 0) {
      for (let l = 0; l < body.listItems.length; l++) {
        let lButtons = []
        let listButtons = body.listItems[l].buttons
        if (listButtons) {
          for (let u = 0; u < listButtons.length; u++) {
            let lbutton = listButtons[u]
            if (lbutton.type === 'web_url') {
              if (lbutton.newUrl) {
                delete lbutton.newUrl
              }
            }
            lButtons.push(lbutton)
          }
          body.listItems[l].buttons = lButtons
        }
        if (body.listItems[l].fileurl) {
          delete body.listItems[l].fileurl
        }
        if (body.listItems[l].id !== null) {
          delete body.listItems[l].id
        }
      }
    }
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
