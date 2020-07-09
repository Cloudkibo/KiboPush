import * as ActionTypes from '../constants/constants'
import {localeCodeToEnglish} from '../../utility/utils'

export function handleAction (actionType, data) {
  return {
    type: actionType,
    data
  }
}

export function getLocales (data) {
  if (data.length > 0) {
    var locale = [{ value: data[0].facebookInfo.locale, label: data[0].facebookInfo.locale }]
    var tempLocale = [data[0].facebookInfo.locale]
    for (var i = 1; i < data.length; i++) {
      if (data[i].facebookInfo && tempLocale.indexOf(data[i].facebookInfo.locale) === -1) {
        var temp = { value: data[i].facebookInfo.locale, label: data[i].facebookInfo.locale }
        locale.push(temp)
        tempLocale.push(data[i].facebookInfo.locale)
      }
    }
    return locale
  }
}

export function updateUsersList (data, originalData) {
  if (originalData.first_page && (originalData.search_value !== '' || originalData.locale_value !== '' || originalData.gender_value !== '')) {
    return {
      type: ActionTypes.LOAD_USERS_LIST_FILTERS,
      data: data.users,
      count: data.count
        // locale: getLocales(data.users)
    }
  } else {
    return {
      type: ActionTypes.LOAD_USERS_LIST,
      data: data.users,
      count: data.count
        // locale: getLocales(data.users)
    }
  }
}

export function updateLocales (dict) {
  let convertedData = []
  for (var key in dict){
    convertedData.push({value: key, text: dict[key]})
  }
  return {
    type: ActionTypes.LOAD_LOCALES_LIST_BACKDOOR,
    data: convertedData
  }
}
export function updateAllLocales (data) {
  let convertedData = []
  for (let i = 0; i < data.length; i++) {
    convertedData.push({value: data[i], text: localeCodeToEnglish(data[i])})
  }
  return {
    type: ActionTypes.LOAD_LOCALES_LIST_BACKDOOR,
    data: convertedData
  }
}

export function updateDataObjectsCount (data) {
  return {
    type: ActionTypes.LOAD_DATA_OBJECTS_LIST,
    data: data.payload
  }
}

export function updateTopPages (data) {
  return {
    type: ActionTypes.LOAD_TOP_PAGES_LIST,
    data: data.payload
  }
}

export function updatePagesList (data) {
  return {
    type: ActionTypes.LOAD_BACKDOOR_PAGES_LIST,
    data: data.pages,
    count: data.count
  }
}

export function updateMessagesCount (data) {
  return {
    type: ActionTypes.LOAD_MESSAGES_COUNT,
    data: data
  }
}

export function updateSurveysGraphData (data) {
  return {
    type: ActionTypes.UPDATE_SURVEYS_GRAPH,
    data
  }
}
export function deleteAccountResponse (data) {
  return {
    type: ActionTypes.DELETE_ACCOUNT_RESPONSE,
    data
  }
}
export function updatePollsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_POLLS_GRAPH,
    data
  }
}

export function updatePollsByDays (data) {
  return {
    type: ActionTypes.UPDATE_POLLS_BY_DAYS,
    polls: data.polls,
    count: data.count
  }
}

export function updateCommentCaptures (data) {
  return {
    type: ActionTypes.UPDATE_COMMENT_CAPTURES,
    commentCaptures: data.commentCaptures,
    count: data.count
  }
}

export function updateChatBots (data) {
  return {
    type: ActionTypes.UPDATE_CHAT_BOTS,
    chatbots: data.chatbots,
    count: data.count
  }
}

export function updateSurveysByDays (data) {
  return {
    type: ActionTypes.UPDATE_SURVEYS_BY_DAYS,
    surveys: data.surveys,
    count: data.count
  }
}

export function updateBroadcastsByDays (data) {
  return {
    type: ActionTypes.UPDATE_BROADCASTS_BY_DAYS,
    broadcasts: data.broadcasts,
    count: data.count
  }
}

export function updateBroadcastsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_BROADCASTS_GRAPH,
    data
  }
}

export function updateSessionsGraphData (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS_GRAPH,
    data
  }
}

export function updateBroadcastsList (data) {
  return {
    type: ActionTypes.LOAD_BROADCASTS_LIST,
    data: data.broadcasts,
    count: data.count
  }
}

export function updatePollList (data) {
  return {
    type: ActionTypes.LOAD_POLLS_LIST,
    data: data.polls,
    count: data.count
  }
}

export function updateSurveysList (data) {
  return {
    type: ActionTypes.LOAD_SURVEYS_LIST,
    data: data.surveys,
    count: data.count
  }
}

export function updateSurveyDetails (data) {
  return {
    type: ActionTypes.LOAD_SURVEY_DETAILS,
    survey: data.payload.survey,
    questions: data.payload.questions,
    responses: data.payload.responses
  }
}

export function updatePageSubscribersList (data) {
  return {
    type: ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST,
    data: data.subscribers,
      //  locale: getLocales(data.subscribers),
    count: data.count
  }
}

export function updatePollDetails (data) {
  return {
    type: ActionTypes.LOAD_POLL_DETAILS,
    data: data.payload
  }
}

export function updateUniquePagesDetails (data) {
  return {
    type: ActionTypes.LOAD_UNIQUE_PAGES_DETAILS,
    data: data.payload
  }
}

export function updateCompanyInfo (data) {
  return {
    type: ActionTypes.LOAD_COMPANY_INFO,
    data
  }
}

export function updateSubscribersWithTags (data) {
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_WITH_TAGS,
    data: data.payload
  }
}

export function updateCurrentPageOwners (data) {
  return {
    type: ActionTypes.LOAD_PAGE_OWNERS,
    data: data.payload
  }
}

export function updateCurrentPageTags (data) {
  return {
    type: ActionTypes.LOAD_PAGE_TAGS,
    data: data.payload
  }
}

export function updatePageAdmins (data) {
  return {
    type: ActionTypes.UPDATE_PAGE_ADMINS,
    data
  }
}

export function saveUserInformation (user) {
  return {
    type: ActionTypes.SAVE_USER_INFORMATION,
    data: user
  }
}
export function savePageInformation (page) {
  return {
    type: ActionTypes.SAVE_PAGE_INFORMATION,
    data: page
  }
}
export function saveSurveyInformation (survey) {
  return {
    type: ActionTypes.SAVE_SURVEY_INFORMATION,
    data: survey
  }
}
export function saveCurrentPoll (poll) {
  return {
    type: ActionTypes.SAVE_CURRENT_POLL,
    data: poll
  }
}
export function fileStatus (data) {
  return {
    type: ActionTypes.DOWNLOAD_FILE,
    data
  }
}
