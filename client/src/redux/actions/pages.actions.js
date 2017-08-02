/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants';
import callApi from '../../utility/api.caller.service';
import auth from '../../utility/auth.service';

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
export function addPages(token) {
    console.log('addPages called');
    return (dispatch) => {
    callApi(`pages/addpages/`,'post',{accessToken:token}).then(res => dispatch(updateOtherPages(res.payload)));
  };
}

export function loadMyPagesList() {
    console.log('loadPagesList called');
    var userid = ''//this will be the _id of user object	
    return (dispatch) => {
    callApi(`pages/${userid}`).then(res => dispatch(updatePagesList(res.payload)));
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
