import * as ActionTypes from '../constants/constants';
import callApi from '../../utility/api.caller.service';


export function showSurveys(data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data
  };
  
}


export function loadSurveysList() {
	//here we will fetch list of subscribers from endpoint
  console.log('loadSurveysList called');		
  return (dispatch) => {
    callApi('surveys').then(res => dispatch(showSurveys(res.payload)));
  };
}

export function createsurvey(survey) {
  console.log('Creating survey');
  console.log(survey)    
  return (dispatch) => {
    callApi('surveys/create','post',survey).then(res => dispatch(addSurvey(res.payload)));
  };
};
 
export function addSurvey(data) {
	//here we will add the broadcast
  console.log(data)
  return {
    type: ActionTypes.ADD_SURVEY,
    data
  };
}

export function showSurveyResponse(data){
  return {
    type: ActionTypes.ADD_RESPONSES,
    data
  }; 
}
export function loadsurveyresponses(surveyid) {
  //surveyid is the _id of survey
  console.log('loadsurveyresponses called');    
  return (dispatch) => {
    callApi(`surveys/${surveyid}`).then(res => dispatch(showSurveyResponse(res.payload.responses)));
  };
}
