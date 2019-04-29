import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showUnansweredQueries (data) {
  return {
    type: ActionTypes.SHOW_UNANSWERED_QUERIES,
    data
  }
}

export function showBotsList (data) {
  return {
    type: ActionTypes.SHOW_BOTS,
    data
  }
}

export function showAnalytics (data) {
  return {
    type: ActionTypes.SHOW_ANALYTICS,
    data
  }
}

export function showBotsListNew (data) {
  return {
    type: ActionTypes.SHOW_BOTS_NEW,
    bots: data.bots,
    count: data.count
  }
}

export function showCreatedBot (data) {
  console.log('data', data)
  return {
    type: ActionTypes.SHOW_CREATED_BOT,
    data
  }
}

export function showBotDetails (data) {
  console.log('data', data)
  return {
    type: ActionTypes.SHOW_BOT_DETAILS,
    data
  }
}

export function applyBotTemplate (data) {
  return {
    type: ActionTypes.APPLY_BOT_TEMPLATE,
    data
  }
}

export function showWaitingReplyList (data) {
  return {
    type: ActionTypes.SHOW_WAITING_REPLY_LIST,
    data
  }
}
export function loadBotsList () {
  return (dispatch) => {
    callApi('bots')
      .then(res => {
        console.log('Response from server', JSON.stringify(res))
        if (res.status === 'success') {
          console.log('List the sequence of bots', res.payload)
          dispatch(showBotsList(res.payload))
        } else {
          console.log('Something went wrong in fetching bots', JSON.stringify(res))
        }
      }).catch((err) => {
        console.log('In catch cant process bot list', err)
      })
  }
}

export function loadAnalytics () {
  return (dispatch) => {
    callApi('bots/analytics')
      .then(res => {
        console.log('Response from server', JSON.stringify(res))
        if (res.status === 'success') {
          console.log('List the sequence of bots', res.payload)
          dispatch(showAnalytics(res.payload))
        } else {
          console.log('Something went wrong in fetching bots', JSON.stringify(res))
        }
      }).catch((err) => {
        console.log('In catch cant process bot list', err)
      })
  }
}

export function loadBotsListNew (data) {
  console.log('data', data)
  return (dispatch) => {
    callApi('bots/allBots', 'post', data)
      .then(res => {
        console.log('Response from server', JSON.stringify(res))
        if (res.status === 'success') {
          dispatch(showBotsListNew(res.payload))
        } else {
          console.log('Something went wrong in fetching bots', JSON.stringify(res))
        }
      }).catch((err) => {
        console.log('In catch cant process bot list', err)
      })
  }
}

export function createBot (data, msg) {
  console.log('createBot data', data)
  return (dispatch) => {
    callApi('bots/create', 'post', data)
      .then(res => {
        console.log('response from createBot', res)
        if (res.status === 'success') {
          dispatch(showCreatedBot(res.payload))
        } else {
          msg.error(res.description)
        }
      })
  }
}

export function editBot (data, msg) {
  return (dispatch) => {
    console.log('Creating Bot', data)
    callApi('bots/edit', 'post', data)
      .then(res => {
        console.log('response from server: ', res)
        if (res.status === 'success') {
          dispatch(loadBotsList())
        } else {
          msg.error(JSON.stringify(res.payload))
        }
      })
  }
}

export function updateStatus (data) {
  return (dispatch) => {
    callApi('bots/updateStatus', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(loadBotsList())
        }
      })
  }
}

export function deleteBot (id, msg) {
  return (dispatch) => {
    callApi('bots/delete/', 'post', {botId: id})
      .then(res => {
        console.log('response from deleteBot', res)
        if (res.status === 'success') {
          dispatch(loadBotsList())
          msg.success('Bot deleted successfully')
        }
      })
  }
}

export function botDetails (id) {
  return (dispatch) => {
    console.log('Calling Bot details api')
    callApi('bots/botDetails/', 'post', {botId: id})
      .then(res => {
        if (res.status === 'success') {
          console.log('Bot Details', res.payload)
          dispatch(showBotDetails(res.payload))
        }
      })
  }
}

export function loadPoliticsBotTemplate () {
  return (dispatch) => {
    callApi('templates/getPoliticsBotTemplate')
    .then(res => {
      if (res.status === 'success') {
        dispatch(applyBotTemplate(res.payload))
      }
    })
  }
}

export function loadWaitingReplyList () {
  return (dispatch) => {
    callApi('bots/waitingReply')
    .then(res => {
      if (res.status === 'success') {
        dispatch(showWaitingReplyList(res.payload))
      }
    })
  }
}

export function loadWaitingSubscribers (id) {
  return (dispatch) => {
    console.log('Calling load waiting subscribers api')
    callApi('bots/fetchWaitingSubscribers/', 'post', {botId: id})
      .then(res => {
        console.log('response from loadWaitingSubscribers', res)
        if (res.status === 'success') {
          dispatch(showWaitingReplyList(res.payload))
        }
      })
  }
}

export function removeWaitingSubscribers (id) {
  return (dispatch) => {
    console.log('Calling remove waiting subscribers api')
    callApi('bots/removeWaitingSubscribers/', 'post', {_id: id})
      .then(res => {
        if (res.status === 'success') {
          console.log('Result of Deleting waiting subscriber: ' + res.payload)
        }
      })
  }
}

export function loadUnansweredQuestions (id) {
  return (dispatch) => {
    console.log('Calling load unanswered questions api')
    callApi('bots/fetchUnansweredQueries/', 'post', {botId: id})
      .then(res => {
        console.log('response from loadUnansweredQuestions', res)
        if (res.status === 'success') {
          dispatch(showUnansweredQueries(res.payload))
        }
      })
  }
}
