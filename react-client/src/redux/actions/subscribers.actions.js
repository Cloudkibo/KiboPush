import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import {localeCodeToEnglish} from '../../utility/utils'

export function updateCustomFieldForSubscriber (data) {
  return {
    type: ActionTypes.UPDATE_CUSTOM_FIELD_FOR_SUBSCRIBER,
    data
  }
}

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

export function updateSubscribersCount (data) {
  console.log('subscribers count', data)
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_COUNT,
    data
  }
}

export function updateAllLocales (data) {
  let convertedData = []
  for (let i = 0; i < data.length; i++) {
    convertedData.push({value: data[i], text: localeCodeToEnglish(data[i])})
  }
  return {
    type: ActionTypes.LOAD_LOCALES_LIST,
    data: convertedData
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

export function updateAllSubscribersListNew (data) {
  console.log('Data Fetched From All Subscribers', data)
  if (!data.subscribers[0]) {
    return {
      type: ActionTypes.LOAD_ALL_SUBSCRIBERS_LIST_NEW,
      data: [],
      locale: [],
      count: 0
    }
  }
  var locale = [data.subscribers[0].locale]
  for (var i = 1; i < data.subscribers.length; i++) {
    if (locale.indexOf(data.subscribers[i].locale) === -1) {
      locale.push(data.subscribers[i].locale)
    }
  }
  // let subscribed = data.subscribers.filter(subscriber => subscriber.isSubscribed)
  // let unsubscribed = data.subscribers.filter(subscriber => !subscriber.isSubscribed)
  // let subscribersData = subscribed.concat(unsubscribed)
  return {
    type: ActionTypes.LOAD_ALL_SUBSCRIBERS_LIST_NEW,
    data: data.subscribers,
    locale: locale,
    count: data.count
  }
}

export function loadSubscribersList () {
  // here we will fetch list of subscribers from endpoint
    return (dispatch) => {
      callApi('subscribers').then(res => {
        if (res.status === 'success') {
          dispatch(updateSubscribersList(res.payload))
        } else {
          dispatch(updateSubscribersList([]))
        }
    })
  }
}

export function loadAllSubscribersList () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('subscribers/allSubscribers').then(res => {
      if (res.status === 'success') {
        dispatch(updateAllSubscribersList(res.payload))
      } else {
        dispatch(updateAllSubscribersList([]))
      }
    })
  }
}

export function updateSubscriberPicture(subscriberId, profilePic) {
  return {
    type: ActionTypes.UPDATE_SUBSCRIBER_PICTURE,
    subscriberId,
    profilePic
  }
}

export function updatePicture (subscriberData, callback) {
  console.log('updatePicture data', subscriberData)
  return (dispatch) => {
    callApi('subscribers/updatePicture', 'post', subscriberData).then(res => {
      if (res.status === 'success') {
        console.log('succesfully updated profile picture for ', subscriberData)
        if (callback) {
          callback(res.payload)
        }
        dispatch(updateSubscriberPicture(subscriberData.subscriber._id, res.payload))
      } else {
        if (subscriberData.subscriber.gender === 'female') {
          if (callback) {
            callback('https://i.pinimg.com/236x/50/28/b5/5028b59b7c35b9ea1d12496c0cfe9e4d.jpg')
          }
          dispatch(updateSubscriberPicture(subscriberData.subscriber._id,'https://i.pinimg.com/236x/50/28/b5/5028b59b7c35b9ea1d12496c0cfe9e4d.jpg'))
        } else {
          if (callback) {
            callback('https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg')
          }
          dispatch(updateSubscriberPicture(subscriberData.subscriber._id, 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'))
        }
      }
    })
  }
}

export function loadAllSubscribersListNew (data, callback) {
  // here we will fetch list of subscribers from endpoint
  console.log('data', data)
  return (dispatch) => {
    callApi('subscribers/getAll', 'post', data).then(res => {
      console.log('response from subscribers', res)
      if(callback) {
        callback(res)
      }
      else {
      dispatch(updateAllSubscribersListNew(res.payload))
      }
    })
  }
}

export function allLocales () {
  return (dispatch) => {
    callApi('subscribers/allLocales').then(res => dispatch(updateAllLocales(res.payload)))
  }
}

export function unSubscribe (data, handleSubscription) {
  return (dispatch) => {
    callApi('subscribers/unSubscribe', 'post', data).then(res => {
      handleSubscription(res, 'unsub')
    })
  }
}

export function subscribe (id, handleSubscription) {
  return (dispatch) => {
    callApi(`subscribers/subscribeBack/${id}`)
      .then(res => {
        handleSubscription(res, 'sub')
      })
  }
}

export function loadSubscribersCount (data) {
  return (dispatch) => {
    callApi('subscribers/getCount', 'post', data).then(res =>
      dispatch(updateSubscribersCount(res.payload))
    )
  }
}
