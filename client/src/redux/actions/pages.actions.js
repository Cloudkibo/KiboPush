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

export function loadMyPagesList() {
    console.log('loadPagesList called');	
    return (dispatch) => {
    callApi('pages').then(res => dispatch(updatePagesList(res)));
  };
}

export function removePage(page) {
    console.log('loadPagesList called');	
    return (dispatch) => {
    callApi('pages/disable','post',page).then(res => {
      if(res.status == 200){
        loadMyPagesList();
      }
    });
  };
}

export function loadOtherPagesList(token, data) {
  console.log('loadOtherPagesList called');	
    return (dispatch) => {
    callApi('pages/otherPages').then(res => dispatch(updateOtherPages(res)));
  };
}
