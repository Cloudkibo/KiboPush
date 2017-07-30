/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants';
import callApi from '../../utility/api.caller.service';

export function updatePagesList(data){
  console.log("My Pages", data);
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  };
}

export function updateOtherPages(data){
  console.log("Other Pages", data);
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  };
}

export function loadMyPagesList(token, data) {
    console.log('loadPagesList called');	
    return (dispatch) => {
    callApi('pages').then(res => dispatch(updatePagesList(res)));
  };
}

export function loadOtherPagesList(token, data) {
  console.log('loadOtherPagesList called');	
    return (dispatch) => {
    callApi('pages/otherPages').then(res => dispatch(updateOtherPages(res)));
  };
}
