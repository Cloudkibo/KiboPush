import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateSubscribersList (data) {
  console.log('Data Fetched From Subscribers', data)
  if (!data[0]) {
    return {
      type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
      data: [],
      locale: []
    }
  }
  var locale = [data[0].locale]
  for (var i = 1; i < data.length; i++) {
    if (locale.indexOf(data[i].locale) === -1) {
      locale.push(data[i].locale)
    }
  }
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
    data,
    locale
  }
}

export function updateAllSubscribersList (data) {
  console.log('Data Fetched From All Subscribers', data)
  if (!data[0]) {
    return {
      type: ActionTypes.LOAD_ALL_SUBSCRIBERS_LIST,
      data: [],
      locale: []
    }
  }
  var locale = [data[0].locale]
  for (var i = 1; i < data.length; i++) {
    if (locale.indexOf(data[i].locale) === -1) {
      locale.push(data[i].locale)
    }
  }
  let subscribed = data.filter(subscriber => subscriber.isSubscribed)
  let unsubscribed = data.filter(subscriber => !subscriber.isSubscribed)
  let subscribersData = subscribed.concat(unsubscribed)
  return {
    type: ActionTypes.LOAD_ALL_SUBSCRIBERS_LIST,
    data: subscribersData,
    locale
  }
}

export function loadSubscribersList () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('subscribers').then(res => dispatch(updateSubscribersList(res)))
  }
}

export function loadAllSubscribersList () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('subscribers/allSubscribers').then(res => dispatch(updateAllSubscribersList(res)))
  }
}
