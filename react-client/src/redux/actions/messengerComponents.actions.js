import callApi from '../../utility/api.caller.service'
import * as ActionTypes from '../constants/constants'

export function showMessengerComponents (data) {
  data = [
    {_id: 1, componentName: 'one', status: 'published', category: 'category1'},
    {_id: 2, componentName: 'two', status: 'published', category: 'category2'},
    {_id: 3, componentName: 'three', status: 'published', category: 'category3'},
    {_id: 4, componentName: 'four', status: 'published', category: 'category4'}
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

export function createMessengerComponent (data, msg) {
  return (dispatch) => {
    callApi('messenger_components', 'post', data)
    .then(res => {
       if (res.status === 'success') {
         msg.success('Saved successfully')
       } else {
         msg.error(res.description || 'Failed to save Messenger Component')
       }
     })
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
