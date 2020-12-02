import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function showMessengerComponents (data) {
  data = [
    {_id: 1, componentName: 'one', status: 'published', category: 'category1', preferences: {height: 'tall', sharingEnabled: true}},
    {_id: 2, componentName: 'two', status: 'published', category: 'category2', preferences: {height: 'compact', sharingEnabled: false}},
    {_id: 3, componentName: 'three', status: 'published', category: 'category3', preferences: {height: 'tall', sharingEnabled: true}},
    {_id: 4, componentName: 'four', status: 'published', category: 'category4', preferences: {height: 'tall', sharingEnabled: true}},
  ]
  return {
    type: ActionTypes.SHOW_MESSENGER_COMPONENTS,
    data
  }
}

export function getMessengerComponents () {
  return (dispatch) => {
    callApi('messenger_components').then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(showMessengerComponents(res.payload))
      }
    })
  }
}

export function createMessengerComponent (data, cb) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    // fetch(`${API_URL}/messenger_components`, {
    //   method: 'post',
    //   body: data,
    //   // eslint-disable-next-line no-undef
    //   headers: new Headers({
    //     'Authorization': `Bearer ${auth.getToken()}`
    //   })
    // }).then((res) => res.json()).then((res) => res).then(res => {
    //   console.log('response from createMessengerComponent', res)
    //   cb(res)
    // })
    cb({status: 'success', description: 'filed'})
  }
}

export function editMessengerComponent (data, msg) {
  return (dispatch) => {
    callApi('messenger_components/edit', 'post', data)
    .then(res => {
      if (res.status === 'success') {
        msg.success('Saved successfully')
      } else {
        msg.error(res.description || 'Failed to save Messenger Component')
      }
    })
  }
}
