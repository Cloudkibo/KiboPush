import { combineReducers } from 'redux'

import {basicInfo} from './basicinfo.reducer'
import {loginInfo} from './login.reducer.js'
import {signupInfo} from './signup.reducer.js'
import {settingsInfo} from './settings.reducer'
import {pagesInfo} from './pages.reducer'
import {subscribersInfo} from './subscribers.reducer'
import {dashboardInfo} from './dashboard.reducer'
import {broadcastsInfo} from './broadcast.reducer'
import {pollsInfo} from './poll.reducer'
import {surveysInfo} from './surveys.reducer.js'
import {workflowsInfo} from './workflows.reducer.js'
import {autopostingInfo} from './autoposting.reducer.js'
import {convosInfo} from './convos.reducer.js'
import {growthToolsInfo} from './growthTools.reducer.js'
import {liveChat} from './livechat.reducer.js'
import {templatesInfo} from './templates.reducer.js'
import {listsInfo} from './customerLists.reducer.js'
import {invitationsInfo} from './invitations.reducer.js'
import {membersInfo} from './members.reducer.js'
import {menuInfo} from './menu.reducer.js'
import {backdoorInfo} from './backdoor.reducer'

const appReducer = combineReducers({
  basicInfo,
  loginInfo,
  signupInfo,
  pagesInfo,
  subscribersInfo,
  surveysInfo,
  backdoorInfo,
  broadcastsInfo,
  workflowsInfo,
  pollsInfo,
  dashboardInfo,
  autopostingInfo,
  convosInfo,
  growthToolsInfo,
  liveChat,
  settingsInfo,
  menuInfo,
  templatesInfo,
  invitationsInfo,
  membersInfo,
  listsInfo
})

export default appReducer
