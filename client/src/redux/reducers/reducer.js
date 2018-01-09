import { combineReducers } from 'redux'

import {basicInfo} from './basicinfo.reducer'
import {APIInfo} from './settings.reducer'
import {pagesInfo} from './pages.reducer'
import {subscribersInfo} from './subscribers.reducer'
import {dashboardInfo, sentSeenInfo} from './dashboard.reducer'
import {broadcastsInfo} from './broadcast.reducer'
import {pollsInfo} from './poll.reducer'
import {surveysInfo} from './surveys.reducer.js'
import {workflowsInfo} from './workflows.reducer.js'
import {autopostingInfo} from './autoposting.reducer.js'
import {convosInfo} from './convos.reducer.js'
import {getFileUploadResponse} from './growthTools.reducer.js'
import {liveChat} from './livechat.reducer.js'
import {templatesInfo} from './templates.reducer.js'
import {indexByPage, getCurrentMenuItem, menuInfo} from './menu.reducer.js'
import {UsersInfo, PagesInfo, BroadcastsInfo, PageSubscribersInfo, PollsInfo, SurveysInfo, getCurrentUser, getCurrentPage, dataObjectsInfo, topPagesInfo, getCurrentSurvey, SurveyDetailsInfo, getCurrentPoll, PollDetailsInfo, broadcastsGraphInfo, pollsGraphInfo, surveysGraphInfo, sessionsGraphInfo} from './backdoor.reducer'

const appReducer = combineReducers({
  basicInfo,
  pagesInfo,
  subscribersInfo,
  surveysInfo,
  broadcastsInfo,
  workflowsInfo,
  pollsInfo,
  dashboardInfo,
  sentSeenInfo,
  broadcastsGraphInfo,
  pollsGraphInfo,
  surveysGraphInfo,
  sessionsGraphInfo,
  autopostingInfo,
  convosInfo,
  UsersInfo,
  dataObjectsInfo,
  topPagesInfo,
  PagesInfo,
  BroadcastsInfo,
  PageSubscribersInfo,
  PollsInfo,
  SurveysInfo,
  getCurrentUser,
  getCurrentPage,
  getCurrentSurvey,
  getCurrentPoll,
  SurveyDetailsInfo,
  PollDetailsInfo,
  getFileUploadResponse,
  liveChat,
  APIInfo,
  indexByPage,
  getCurrentMenuItem,
  menuInfo,
  templatesInfo
})

export default appReducer
