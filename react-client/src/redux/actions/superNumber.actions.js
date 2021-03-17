import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showCheckouts(body, data) {
  if (body.nextPageParameters) {
    return {
      type: ActionTypes.SHOW_CHECKOUTS,
      checkouts: data.checkouts,
      count: data.count,
      nextPageParameters: data.nextPageParameters
    }
  } else {
    return {
      type: ActionTypes.SHOW_CHECKOUTS_OVERWRITE,
      checkouts: data.checkouts,
      count: data.count,
      nextPageParameters: data.nextPageParameters
    }
  }
}

export function showOrders(body, data) {
  if (body.nextPageParameters) {
    return {
      type: ActionTypes.SHOW_ORDERS,
      orders: data.orders,
      count: data.count,
      nextPageParameters: data.nextPageParameters
    }
  } else {
    return {
      type: ActionTypes.SHOW_ORDERS_OVERWRITE,
      orders: data.orders,
      count: data.count,
      nextPageParameters: data.nextPageParameters
    }
  }
}

export function fetchTemplates (body) {
  return (dispatch) => {
    callApi('supernumber/fetchTemplates', 'post', body).then(res => {
      console.log('response from fetchTemplates', res)
      if (res.status === 'success') {
        dispatch({
          type: ActionTypes.SHOW_COMMERCE_TEMPLATES,
          data: res.payload
        })
      }
    })
  }
}

export function fetchOrders (body, cb) {
  return (dispatch) => {
    callApi('shopify/fetchOrders', 'post', body).then(res => {
      console.log('response from fetchOrders', res)
      if (res.status === 'success') {
        if (cb) cb(res.payload)
        dispatch(showOrders(body, res.payload))
      }
    })
  }
}

export function fetchCheckouts (body, cb) {
  return (dispatch) => {
    callApi('shopify/fetchCheckouts', 'post', body).then(res => {
      console.log('response from fetchCheckouts', res)
      if (res.status === 'success') {
        if (cb) cb(res.payload)
        dispatch(showCheckouts(body, res.payload))
      }
    })
  }
}

export function sendManualMessage (body, cb) {
  return (dispatch) => {
    callApi('supernumber/sendManualMessage', 'post', body).then(res => {
      console.log('response from sendManualMessage', res)
      if (cb) cb(res)
    })
  }
}
export function createSuperNumberPreferences (data, msg) {
  return (dispatch) => {
    callApi(`supernumber`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Changes saved successfully')
          dispatch({
            type: ActionTypes.SAVE_SUPERNUMBER_PRFERENCES,
            data: res.payload
          })
        } else {
          msg.error(res.description || res.payload || 'Failed to save changes')
        }
      })
  }
}


export function updateSuperNumberPreferences(data, msg) {
  return (dispatch) => {
    callApi(`supernumber/update`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Changes saved successfully')
        } else {
          msg.error(res.description || res.payload || 'Failed to save changes')
        }
      })
  }
}

export function fetchSuperNumberPreferences(msg) {
  return (dispatch) => {
    callApi(`supernumber`, 'get')
      .then(res => {
        if (res.status === 'success') {
          dispatch({
            type: ActionTypes.SAVE_SUPERNUMBER_PRFERENCES,
            data: res.payload
          })
        } else {
          msg.error(res.description || res.payload || 'Failed to save changes')
        }
      })
  }
}

export function fetchSummarisedAnalytics(body, cb) {
  return (dispatch) => {
    callApi(`supernumber/fetchSummarisedAnalytics`, 'post', body)
      .then(res => {
        console.log('response from fetchSummarisedAnalytics', res)
        if (res.status === 'success') {
          dispatch({
            type: ActionTypes.GET_SUMMARISED_ANALYTICS,
            data: res.payload
          })
          if (cb) cb(res)
        }
      })
  }
}

export function fetchDetailedAnalytics(body, cb) {
  return (dispatch) => {
    callApi(`supernumber/fetchDetailedAnalytics`, 'post', body)
      .then(res => {
        console.log('response from fetchDetailedAnalytics', res)
        if (res.status === 'success') {
          dispatch({
            type: ActionTypes.GET_DETAILED_ANALYTICS,
            data: res.payload
          })
          if (cb) cb(res)
        }
      })
  }
}

export function fetchMessageLogs(body, cb) {
  return (dispatch) => {
    callApi(`supernumber/fetchMessageLogs`, 'post', body)
      .then(res => {
        console.log('response from fetchMessageLogs', res)
        if (res.status === 'success') {
          dispatch({
            type: ActionTypes.GET_MESSAGE_LOGS,
            messageLogs: res.payload.messageLogs,
            count: res.payload.count
          })
          if (cb) cb(res)
        }
      })
  }
}
