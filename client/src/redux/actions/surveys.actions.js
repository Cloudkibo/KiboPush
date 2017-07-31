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

export function showSurveyResponse(){
  const survey = [
    {
      _id: '1',
      title: 'Product Satisfaction',
      description: 'The survey to check our new product satisfaction from customers',
    },
  ];
  const questions = [
    {
      _id: '10',
      statement: 'How would you rate our new product?',
      options: ['Excellent', 'Good', 'Bad'],
      type: 'multichoice',
      surveyId: {
        _id: '1',
        title: 'Product Satisfaction',
        description: 'The survey to check our new product satisfaction from customers',
      },
    },
    {
      _id: '11',
      statement: 'Any feedback you want to give?',
      options: [],
      type: 'text',
      surveyId: {
        _id: '1',
        title: 'Product Satisfaction',
        description: 'The survey to check our new product satisfaction from customers',
      },
    },
  ];
  const responses = [
    {
      _id: '20',
      response: 'Excellent',
      surveyId: {
        _id: '1',
        title: 'Product Satisfaction',
        description: 'The survey to check our new product satisfaction from customers',
      },
      questionId: {
        _id: '10',
        statement: 'How would you rate our new product?',
        options: ['Excellent', 'Good', 'Bad'],
        type: 'multichoice',
      }
    },
    {
      _id: '21',
      response: 'Feedback from the customer X',
      surveyId: {
        _id: '1',
        title: 'Product Satisfaction',
        description: 'The survey to check our new product satisfaction from customers',
      },
      questionId: {
        _id: '11',
        statement: 'Any feedback you want to give?',
        options: [],
        type: 'text',
      },
    },
    {
      _id: '22',
      response: 'Feedback from the customer Y',
      surveyId: {
        _id: '1',
        title: 'Product Satisfaction',
        description: 'The survey to check our new product satisfaction from customers',
      },
      questionId: {
        _id: '11',
        statement: 'Any feedback you want to give?',
        options: [],
        type: 'text',
      },
    },
  ];
  const dummyData = {
    survey,
    questions,
    responses,
  };

  return {
    type: ActionTypes.ADD_RESPONSES,
    data: dummyData,
  };
}
export function loadsurveyresponses(surveyid) {
  //surveyid is the _id of survey
  console.log('loadsurveyresponses called');
  return (dispatch) => {
    callApi(`surveys/${surveyid}`).then(res => dispatch(showSurveyResponse(res.payload)));
  };
}
