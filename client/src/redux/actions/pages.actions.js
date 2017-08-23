/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePagesList (data) {
  console.log('My Pages', data)
  /* var data = [{
    '_id': '598c1afb8936443ddaea5f54',
    'pageId': '272774036462658',
    'pageName': 'Cafe',
    'accessToken': 'EAAUTvApDOEYBAPchwYRoj4G1E3IzgFmyc864QFLo0hetRtf0IN6YOIOlxEZAwEE5WJUq30i6DU64BgjjcGWukk1JZAXQF8i6PmTIsWaZAdZAVtMh4OCBpft7ZAUipjA53afjRq2ntSKEgzW0rhLQdvcLei5ZC88RZBrDe0CH4WT5AZDZD',
    'userId': '598c1ae28936443ddaea5f53',
    'connected': true,
    '__v': 0
  },
  {
    '_id': '598c1afb8936443ddaea5f55',
    'pageId': '446734445680752',
    'pageName': 'TestProducts',
    'accessToken': 'EAAUTvApDOEYBADBBEagcB9pmZBQZCMyaznJpM3IDhzUjUZCWetTSKhPZCJo2c2ctM09wiLsfZBRDRue07Cmc1ePCOF01flGKs0euyziCBy2pXO5ZA4KLlUTJwUSJrT5WZB0WG8Lw2dLhvCxexlPKAmXPRp6mvCLeyJB0XYhRKJysgZDZD',
    'userId': '598c1ae28936443ddaea5f53',
    'connected': true,
    '__v': 0
  }] */
  return {

    type: ActionTypes.LOAD_PAGES_LIST,
    data
  }
}

export function updateOtherPages (data) {
  console.log('Other Pages', data)
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  }
}

export function enablePage (page) {
  console.log('enablePage called')
  console.log(page)
  return (dispatch) => {
    callApi(`pages/enable/`, 'post', page)
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}
export function addPages () {
  return (dispatch) => {
    callApi(`pages/addpages/`).then(res => {
      dispatch(updateOtherPages(res.payload))
      console.log('Response From Add Pages', res.payload)
    })
  }
}

export function loadMyPagesList () {
  console.log('loadPagesList called')

  // var userid = ''// this will be the _id of user object
  return (dispatch) => {
    callApi(`pages`).then(res => dispatch(updatePagesList(res.payload)))
  }
}

export function removePage (page) {
  console.log('loadPagesList called')
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
      .then(res => dispatch(updatePagesList(res.payload)))
  }
}
export function loadOtherPagesList () {
  console.log('loadOtherPagesList called')
  return (dispatch) => {
    callApi('pages/otherPages')
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}
