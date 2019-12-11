import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function botIntentsList(data) {
    return {
        type: ActionTypes.SHOW_BOT_INTENTS,
        data
    }
}

export function loadBotIntents(botId) {
    return (dispatch) => {
        callApi('intents/query', 'post', { botId: botId })
            .then(res => {
                if (res.status === 'success') {
                    dispatch(botIntentsList(res.payload))
                } else {
                    console.log('Something went wrong in fetching bot intnets', JSON.stringify(res))
                }
            }).catch((err) => {
                console.log('In catch cant process bot list', err)
            })
    }
}

export function createIntent(data, msg, cb) {
    return (dispatch) => {
        callApi('intents', 'post', data)
            .then(res => {
                console.log('response from server: ', res)
                if (res.status === 'success') {
                    dispatch(loadBotIntents(data.botId))
                    msg.success(res.payload)
                } else {
                    msg.error(res.payload)
                }
                cb(res)
            })
    }
}

export function editIntent(data, msg, cb) {
    return (dispatch) => {
        callApi('intent/edit', 'post', data)
            .then(res => {
                console.log('response from server: ', res)
                if (res.status === 'success') {
                    dispatch(loadBotIntents(data.botId))
                    msg.success(res.payload)
                } else {
                    msg.error(res.payload)
                }
                cb(res.status)
            })
    }
}

export function deleteIntnet (id, password, msg, cb) {
    return (dispatch) => {
      callApi('intent/delete', 'post', {intentId: id})
        .then(res => {
          console.log('response from delete Intent', res)
          if (res.status === 'success') {
            dispatch(loadBotIntents(id))
            msg.success('Intent deleted successfully')
          }
           else {
            msg.error(res.payload)
           }
           cb(res.status)
        })
    }
  }