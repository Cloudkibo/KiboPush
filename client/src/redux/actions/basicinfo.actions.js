import * as ActionTypes from '../constants/constants';
import callApi from '../../utility/api.caller.service';

export function setBrowserName(data) {
  return {
    type: ActionTypes.LOAD_BROWSER_NAME,
    data
  };
}
export function showuserdetails(data) {
  return {
    type: ActionTypes.LOAD_USER_DETAILS,
    data
  };
}

export function getuserdetails() {
  console.log('getuserdetails');   
 
  return (dispatch) => {
    callApi('users').then(res => dispatch(showuserdetails(res.payload)));
  };
};
export function setBrowserVersion(data) {
  return {
    type: ActionTypes.LOAD_BROWSER_VERSION,
    data
  };
}

