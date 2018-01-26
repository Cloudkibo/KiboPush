import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function createsurvey (survey) {
  console.log('Creating survey')
  console.log(survey)
  return (dispatch) => {
    callApi('templates/createSurvey', 'post', survey)
      .then(res => dispatch(addSurvey(res)))
  }
}

export function addPoll (data, msg) {
  console.log('response from createpoll', data)
  return {
    type: ActionTypes.ADD_TEMPLATE_POLL,
    data
  }
}
export function createpoll (poll) {
  console.log('Creating survey')
  console.log(poll)
  return (dispatch) => {
    callApi('templates/createPoll', 'post', poll)
      .then(res => dispatch(addPoll(res)))
  }
}

export function addSurvey (data, msg) {
  console.log('response from createsurvey', data)
  if (data.status === 'success') {
    msg.success('Survey created successfully')
  }
  return {
    type: ActionTypes.ADD_TEMPLATE_SURVEY,
    data
  }
}
export function addCategory (data, msg) {
  return (dispatch) => {
    callApi('templates/createCategory', 'post', data)
      .then(res => {
        console.log('response from addCategory', res)
        if (res.status === 'success') {
          msg.success('Category added successfully')
          dispatch(loadCategoriesList())
        } else {
          msg.error('Please enter a category')
        }
      })
  }
}
export function showCategories (data) {
  return {
    type: ActionTypes.LOAD_CATEGORY_LIST,
    data
  }
}
export function loadCategoriesList () {
  console.log('loadCartegoriesList called')
  return (dispatch) => {
    callApi('templates/allCategories').then(res => dispatch(showCategories(res.payload)))
  }
}
export function showSurveys (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_SURVEYS_LIST,
    data
  }
}
export function loadSurveysList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadSurveysList called')
  return (dispatch) => {
    callApi('templates/allSurveys').then(res => dispatch(showSurveys(res.payload)))
  }
}
export function showPolls (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_POLLS_LIST,
    data
  }
}
export function loadPollsList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadPollsList called')
  return (dispatch) => {
    callApi('templates/allPolls').then(res => dispatch(showPolls(res.payload)))
  }
}
export function updateSurveyDetails (data) {
  console.log('updateSurveysDetails', data.payload.survey)
  console.log('updateSurveysDetails', data.payload.questions)
  return {
    type: ActionTypes.LOAD_TEMPLATE_SURVEY_DETAILS,
    survey: data.payload.survey,
    questions: data.payload.questions
  }
}
export function updatePollDetails (data) {
  console.log('updatePollDetails', data.payload)

  return {
    type: ActionTypes.LOAD_TEMPLATE_POLL_DETAILS,
    data: data.payload
  }
}
export function loadSurveyDetails (id) {
  console.log('loadSurveyDetails called: ', id)
  return (dispatch) => {
    callApi(`templates/surveyDetails/${id}`)
      .then(res => dispatch(updateSurveyDetails(res)))
  }
}
export function loadPollDetails (id) {
  console.log('loadPollDetails called: ', id)
  return (dispatch) => {
    callApi(`templates/pollDetails/${id}`)
      .then(res => dispatch(updatePollDetails(res)))
  }
}
export function deletePoll (id, msg) {
  return (dispatch) => {
    callApi(`templates/deletePoll/${id}`, 'delete')
      .then(res => {
        console.log('Response Delete', res)
        if (res.status === 'success') {
          msg.success('Poll template deleted')
          dispatch(loadPollsList())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete poll template. ${res.description}`)
          } else {
            msg.error('Failed to delete poll template')
          }
        }
      })
  }
}
export function deleteSurvey (id, msg) {
  return (dispatch) => {
    callApi(`templates/deleteSurvey/${id}`, 'delete')
      .then(res => {
        console.log('Response Delete', res)
        if (res.status === 'success') {
          msg.success('Survey template deleted')
          dispatch(loadSurveysList())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete survey template. ${res.description}`)
          } else {
            msg.error('Failed to delete survey template')
          }
        }
      })
  }
}
export function deleteCategory (id) {
  return (dispatch) => {
    callApi(`templates/deleteCategory/${id}`, 'delete')
      .then(res => {
        dispatch(loadCategoriesList())
      })
  }
}
export function editCategory (data, msg) {
  console.log(data)
  return (dispatch) => {
    callApi('templates/editCategory', 'post', data)
      .then(res => {
        console.log(res)
        if (res.status === 'success') {
          msg.success('Category saved successfully')
          dispatch(loadCategoriesList())
        } else {
          msg.error('Category edit failure')
        }
      })
  }
}
export function editPoll (data, msg) {
  console.log(data)
  return (dispatch) => {
    callApi('templates/editPoll', 'post', data)
      .then(res => {
        console.log(res)
        if (res.status === 'success') {
          msg.success('Poll saved successfully')
          dispatch(loadPollsList())
        } else {
          msg.error('Poll edit failure')
        }
      })
  }
}
export function editSurvey (data, msg) {
  console.log(data)
  return (dispatch) => {
    callApi('templates/editSurvey', 'post', data)
      .then(res => {
        console.log(res)
        if (res.status === 'success') {
          msg.success('Survey edited successfully')
          dispatch(loadPollsList())
        } else {
          msg.error('Survey edit failure')
        }
      })
  }
}

// ********* Broadcast Templates ************** //
export function loadBroadcastDetails (id) {
  console.log('loadBroadcastDetails called: ', id)
  return (dispatch) => {
    callApi(`templates/broadcastDetails/${id}`)
      .then(res => dispatch(updateBroadcastDetails(res)))
  }
}

export function updateBroadcastDetails (data) {
  console.log('updateBroadcastDetails', data.payload)

  return {
    type: ActionTypes.LOAD_TEMPLATE_BROADCAST_DETAILS,
    data: data.payload
  }
}

export function showBroadcasts (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_BROADCASTS_LIST,
    data
  }
}

export function loadBroadcastsList () {
  console.log('loadBroadcastsList called')
  return (dispatch) => {
    callApi('templates/allBroadcasts').then(res => dispatch(showBroadcasts(res.payload)))
  }
}

export function saveBroadcastInformation (broadcast) {
  return {
    type: ActionTypes.SAVE_BROADCAST_INFORMATION,
    data: broadcast
  }
}

export function createBroadcast (broadcast, msg) {
  console.log('Creating broadcast')
  console.log(broadcast)
  return (dispatch) => {
    callApi('templates/createBroadcast', 'post', broadcast)
      .then(res => dispatch(addConvoTemplate(res, msg)))
  }
}

export function addConvoTemplate (data, msg) {
  console.log('response from createBroadcast', data)
  if (data.status === 'success') {
    msg.success('Broadcast created successfully')
  } else {
    msg.error('Broadcast creation failed.')
  }
  return {
    type: ActionTypes.ADD_TEMPLATE_BROADCAST,
    data
  }
}

export function deleteBroadcast (id, msg) {
  return (dispatch) => {
    callApi(`templates/deleteBroadcast/${id}`, 'delete')
      .then(res => {
        console.log('Response Delete', res)
        if (res.status === 'success') {
          msg.success('Broadcast template deleted')
          dispatch(loadBroadcastsList())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete broadcast template. ${res.description}`)
          } else {
            msg.error('Failed to delete broadcast template')
          }
        }
      })
  }
}

export function editBroadcast (data, msg) {
  console.log(data)
  return (dispatch) => {
    callApi('templates/editBroadcast', 'post', data)
      .then(res => {
        console.log(res)
        if (res.status === 'success') {
          msg.success('Broadcast updated successfully.')
          dispatch(loadBroadcastsList())
        } else {
          msg.error('Failed to update broadcast.')
        }
      })
  }
}
