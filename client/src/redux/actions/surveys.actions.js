/* eslint-disable no-undef */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showSurveys (data) {
  console.log('updateSurveysList')
  console.log(data)
  let surveys = data.surveys
  let pagesurveys = data.surveypages
  // let responsesCount = data.responsesCount

  for (let j = 0; j < surveys.length; j++) {
    let pagesurvey = pagesurveys.filter((c) => c.surveyId === surveys[j]._id)
    surveys[j].sent = pagesurvey.length// total sent
    let pagesurveyTapped = pagesurvey.filter((c) => c.seen === true)
    surveys[j].seen = pagesurveyTapped.length // total tapped
    surveys[j].responses = surveys[j].isresponded
    // for (let i = 0; i < responsesCount.length; i++) {
    //   if (responsesCount[i]._id === surveys[j]._id) {
    //     surveys[j].responses = responsesCount[i].count
    //     break
    //   } else {
    //     surveys[j].responses = 0
    //   }
    // }
    // for (let i = 0; i < responsesCount.length; i++) {
    //   if (responsesCount[i].surveyId === surveys[j]._id) {
    //     surveys[j].responses = responsesCount[i].count
    //   }
    // }
    console.log('updated surveys')
    console.log(surveys[j])
  }
  var newSurvey = surveys.reverse()
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data: newSurvey
  }
}

export function submitresponse (data) {
  return {
    type: ActionTypes.SUBMIT_SURVEY,
    response: data
  }
}
export function showSurveyQuestions (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_QUESTIONS,
    survey: data.survey,
    questions: data.questions
  }
}

export function loadSurveysList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadSurveysList called')
  return (dispatch) => {
    callApi('surveys').then(res => dispatch(showSurveys(res.payload)))
  }
}
export function sendsurvey (survey, msg) {
  console.log('send survey called')
  return (dispatch) => {
    callApi(`surveys/send`, 'post', survey)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Survey sent successfully')
          dispatch(sendSurveySuccess())
        } else {
          msg.error('Cannot send survey')
          dispatch(sendSurveyFailure())
        }
      })
  }
}
export function getsurveyform (id) {
  return (dispatch) => {
    callApi(`surveys/showquestions/${id}`)
      .then(res => dispatch(showSurveyQuestions(res.payload)))
  }
}

export function submitsurvey (survey) {
  return (dispatch) => {
    callApi(`surveys/submitresponse`, 'post', survey)
      .then(res => dispatch(submitresponse(res.payload)))
  }
}
export function createsurvey (survey) {
  console.log('Creating survey')
  console.log(survey)
  return (dispatch) => {
    callApi('surveys/create', 'post', survey)
      .then(res => dispatch(addSurvey(res)))
  }
}

export function addSurvey (data) {
  // here we will add the broadcast
  /* if (data.status == 'success') {
    alert('Survey created successfully.')
  } else {
    alert('Error occurred in creating surveys')
  } */
  console.log(data)
  return {
    type: ActionTypes.ADD_SURVEY,
    data
  }
 // browserHistory.push('/surveys')
}

export function sendSurveySuccess () {
  return {
    type: ActionTypes.SEND_SURVEY_SUCCESS
  }
}

export function sendSurveyFailure () {
  return {
    type: ActionTypes.SEND_SURVEY_FAILURE
  }
}

export function showSurveyResponse (data) {
  /* const survey =
   {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   }

   const questions = [
   {
   _id: '10',
   statement: 'How would you rate our new product?',
   options: ['Excellent', 'Good', 'Bad'],
   type: 'multichoice',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   }
   },
   {
   _id: '11',
   statement: 'Any feedback you want to give?',
   options: [],
   type: 'text',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   }
   },
   {
   _id: '12',
   statement: 'Which color do you like?',
   options: ['Peach', 'Orange', 'Red'],
   type: 'multichoice',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   }
   }
   ]
   const responses = [
   {
   _id: '20',
   response: 'Excellent',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '10',
   statement: 'How would you rate our new product?',
   options: ['Excellent', 'Good', 'Bad'],
   type: 'multichoice'
   },
   subscriberId: {
   _id: 'a',
   firstName: 'Zarmeen',
   lastName: 'Nasim',
   gender: 'Female'
   }
   },
   {
   _id: '21',
   response: 'Feedback from the customer X',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '11',
   statement: 'Any feedback you want to give?',
   options: [],
   type: 'text'
   },

   subscriberId: {
   _id: 'b',
   firstName: 'Sojharo',
   lastName: 'Mangi',
   gender: 'Male'
   }
   },
   {
   _id: '23',
   response: 'Good',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '10',
   statement: 'How would you rate our new product?',
   options: ['Excellent', 'Good', 'Bad'],
   type: 'multichoice'
   },
   subscriberId: {
   _id: 'b',
   firstName: 'Sojharo',
   lastName: 'Mangi',
   gender: 'Male'
   }
   },
   {
   _id: '22',
   response: 'Feedback from the customer Y',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '11',
   statement: 'Any feedback you want to give?',
   options: [],
   type: 'text'
   },

   subscriberId: {
   _id: 'c',
   firstName: 'Sumaira',
   lastName: 'Saeed',
   gender: 'Female'
   }
   },
   {
   _id: '24',
   response: 'Red',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '12',
   statement: 'Which color do you like?',
   options: ['Peach', 'Orange', 'Red'],
   type: 'multichoice'

   },
   subscriberId: {
   _id: 'b',
   firstName: 'Sojharo',
   lastName: 'Mangi',
   gender: 'Male'
   }
   },
   {
   _id: '25',
   response: 'Red',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '12',
   statement: 'Which color do you like?',
   options: ['Peach', 'Orange', 'Red'],
   type: 'multichoice'

   },
   subscriberId: {
   _id: 'c',
   firstName: 'Sumaira',
   lastName: 'Saeed',
   gender: 'Female'
   }
   },
   {
   _id: '26',
   response: 'Orange',
   surveyId: {
   _id: '1',
   title: 'Product Satisfaction',
   description: 'The survey to check our new product satisfaction from customers'
   },
   questionId: {
   _id: '12',
   statement: 'Which color do you like?',
   options: ['Peach', 'Orange', 'Red'],
   type: 'multichoice'

   },
   subscriberId: {
   _id: 'a',
   firstName: 'Zarmeen',
   lastName: 'Nasim',
   gender: 'Female'
   }
   }
   ] */
  console.log('show survey responses', data)
  return {
    type: ActionTypes.ADD_RESPONSES,
    survey: data.survey,
    questions: data.questions,
    responses: data.responses
  }
}
export function loadsurveyresponses (surveyid) {
  // surveyid is the _id of survey
  console.log('loadsurveyresponses called')
  return (dispatch) => {
    callApi(`surveys/${surveyid}`)
      .then(res => dispatch(showSurveyResponse(res.payload)))
  }
}
