/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showCustomerLists (data) {
  return {
    type: ActionTypes.LOAD_CUSTOMER_LISTS,
    data
  }
}
export function loadCustomerLists () {
  console.log('loadCustomerLists called')
  return (dispatch) => {
    callApi('lists/allLists')
      .then(res => dispatch(showCustomerLists(res.payload)))
  }
}

export function loadPhoneNumbersLists () {
  console.log('loadPhoneNumbersLists called')
}

export function addList (data, msg) {
  console.log('response from createList', data)
  return {
    type: ActionTypes.ADD_NEW_LIST,
    data
  }
}
export function createSubList (list) {
  console.log('Creating list')
  console.log(list)
  return (dispatch) => {
    callApi('lists/createList', 'post', list)
      .then(res => dispatch(addList(res)))
  }
}
