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
import {teamsInfo} from './teams.reducer'
import {tagsInfo} from './tags.reducer'
import {notificationsInfo} from './notifications.reducer'
import {botsInfo} from './smart_replies.reducer'
import {sequenceInfo} from './sequence.reducer'
import {postsInfo} from './commentCapture.reducer'
import {billingPricingInfo} from './billingPricing.reducer'
import {permissionsInfo} from './permissions.reducer'
import {featuresInfo} from './features.reducer'
import {usageInfo} from './usage.reducer'

const appReducer = combineReducers({
  basicInfo,
  loginInfo,
  signupInfo,
  pagesInfo,
  subscribersInfo,
  surveysInfo,
  backdoorInfo,
  broadcastsInfo,
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
  listsInfo,
  teamsInfo,
  tagsInfo,
  notificationsInfo,
  botsInfo,
  sequenceInfo,
  postsInfo,
  billingPricingInfo,
  permissionsInfo,
  featuresInfo,
  usageInfo
})

export default appReducer
