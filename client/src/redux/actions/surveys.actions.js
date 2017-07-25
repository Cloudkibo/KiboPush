import * as ActionTypes from '../constants/constants';

export function loadSurveysList() {
	//here we will fetch list of subscribers from endpoint
  console.log('loadSurveysList called');		
  var data = [{title: 'Survey 1',subtitle:'This is a test survey',createdAt:Date.now()}];	
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data
  };
}
