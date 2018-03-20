import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function createsurvey (survey) {
  return (dispatch) => {
    callApi('templates/createSurvey', 'post', survey)
      .then(res => dispatch(addSurvey(res)))
  }
}

export function addPoll (data, msg) {
  return {
    type: ActionTypes.ADD_TEMPLATE_POLL,
    data
  }
}
export function createpoll (poll) {
  return (dispatch) => {
    callApi('templates/createPoll', 'post', poll)
      .then(res => dispatch(addPoll(res)))
  }
}

export function addSurvey (data, msg) {
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
  return (dispatch) => {
    callApi('templates/allCategories').then(res => dispatch(showCategories(res.payload)))
  }
}
export function showSurveys (data) {
  data = data.reverse()
  return {
    type: ActionTypes.LOAD_TEMPLATE_SURVEYS_LIST,
    data
  }
}
export function loadSurveysList () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('templates/allSurveys').then(res => dispatch(showSurveys(res.payload)))
  }
}
export function showPolls (data) {
  data = data.reverse()
  return {
    type: ActionTypes.LOAD_TEMPLATE_POLLS_LIST,
    data
  }
}
export function loadPollsList () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('templates/allPolls').then(res => dispatch(showPolls(res.payload)))
  }
}
export function updateSurveyDetails (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_SURVEY_DETAILS,
    survey: data.payload.survey,
    questions: data.payload.questions
  }
}
export function updatePollDetails (data) {

  return {
    type: ActionTypes.LOAD_TEMPLATE_POLL_DETAILS,
    data: data.payload
  }
}
export function loadSurveyDetails (id) {
  return (dispatch) => {
    callApi(`templates/surveyDetails/${id}`)
      .then(res => dispatch(updateSurveyDetails(res)))
  }
}
export function loadPollDetails (id) {
  return (dispatch) => {
    callApi(`templates/pollDetails/${id}`)
      .then(res => dispatch(updatePollDetails(res)))
  }
}
export function deletePoll (id, msg) {
  return (dispatch) => {
    callApi(`templates/deletePoll/${id}`, 'delete')
      .then(res => {
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
export function deleteCategory (id, msg) {
  return (dispatch) => {
    callApi(`templates/deleteCategory/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Category deleted successfully')
          dispatch(loadCategoriesList())
        }
      })
  }
}
export function editCategory (data, msg) {
  return (dispatch) => {
    callApi('templates/editCategory', 'post', data)
      .then(res => {
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
  return (dispatch) => {
    callApi('templates/editPoll', 'post', data)
      .then(res => {
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
  return (dispatch) => {
    callApi('templates/editSurvey', 'post', data)
      .then(res => {
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
  return (dispatch) => {
    callApi(`templates/broadcastDetails/${id}`)
      .then(res => dispatch(updateBroadcastDetails(res)))
  }
}

export function updateBroadcastDetails (data) {
  return {
    type: ActionTypes.LOAD_TEMPLATE_BROADCAST_DETAILS,
    data: data.payload
  }
}

export function showBroadcasts (data) {
  data = data.reverse()
  return {
    type: ActionTypes.LOAD_TEMPLATE_BROADCASTS_LIST,
    data
  }
}

export function loadBroadcastsList () {
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
  return (dispatch) => {
    callApi('templates/createBroadcast', 'post', broadcast)
      .then(res => dispatch(addConvoTemplate(res, msg)))
  }
}

export function addConvoTemplate (data, msg) {
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
  return (dispatch) => {
    callApi('templates/editBroadcast', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          msg.success('Broadcast updated successfully.')
          dispatch(loadBroadcastsList())
        } else {
          msg.error('Failed to update broadcast.')
        }
      })
  }
}
