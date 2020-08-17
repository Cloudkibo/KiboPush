import { combineReducers } from 'redux'

import { abandonedInfo } from './abandonedCarts.reducer'
import { autopostingInfo } from './autoposting.reducer.js'
import { backdoorInfo } from './backdoor.reducer'
import { basicInfo } from './basicinfo.reducer'
import { billingPricingInfo } from './billingPricing.reducer'
import { botIntentsInfo } from './smat_replies_intnets.reducer'
import { botsInfo } from './smart_replies.reducer'
import { broadcastsInfo } from './broadcast.reducer'
import { businessGatewayInfo } from './businessGateway.reducer'
import { chatbotsInfo } from './chatbotAutomation.reducer'
import { contactsInfo } from './contacts.reducer'
import { convosInfo } from './convos.reducer.js'
import { customFieldInfo } from './customFields.reducer'
import { dashboardInfo } from './dashboard.reducer'
import { demoSSAInfo } from './demoSSA.reducer'
import { featuresInfo } from './features.reducer'
import { feedsInfo } from './rssIntegration.reducer'
import { googleSheetsInfo } from './googleSheets.reducer'
import { growthToolsInfo } from './growthTools.reducer.js'
import { hubSpotInfo } from './hubSpot.reducer'
import { invitationsInfo } from './invitations.reducer.js'
import { landingPagesInfo } from './landingPages.reducer'
import { listsInfo } from './customerLists.reducer.js'
import { liveChat } from './livechat.reducer.js'
import { loginInfo } from './login.reducer.js'
import { membersInfo } from './members.reducer.js'
import { menuInfo } from './menu.reducer.js'
import { messengerAdsInfo } from './messengerAds.reducer'
import { messengerCodeInfo } from './messengerCode.reducer'
import { messengerRefURLInfo } from './messengerRefURL.reducer'
import { notificationsInfo } from './notifications.reducer'
import { overlayWidgetsInfo } from './overlayWidgets.reducer'
import { pagesInfo } from './pages.reducer'
import { permissionsInfo } from './permissions.reducer'
import { pollsInfo } from './poll.reducer'
import { postsInfo } from './commentCapture.reducer'
import { sequenceInfo } from './sequence.reducer'
import { settingsInfo } from './settings.reducer'
import { signupInfo } from './signup.reducer.js'
import { smsBroadcastsInfo } from './smsBroadcasts.reducer'
import { smsChatInfo } from './smsChat.reducer'
import { smsWhatsAppDashboardInfo } from './smsWhatsAppDashboard.reducer'
import { socketInfo } from './socket.reducer'
import { sponsoredMessagingInfo } from './sponsoredMessaging.reducer'
import { subscribersInfo } from './subscribers.reducer'
import { surveysInfo } from './surveys.reducer.js'
import { tagsInfo } from './tags.reducer'
import { teamsInfo } from './teams.reducer'
import { templatesInfo } from './templates.reducer.js'
import { usageInfo } from './usage.reducer'
import { whatsAppBroadcastsInfo } from './whatsAppBroadcasts.reducer'
import { whatsAppChatInfo } from './whatsAppChat.reducer'
import { whatsAppChatbot } from './whatsAppChatbot.reducer'

const appReducer = combineReducers({
  abandonedInfo,
  autopostingInfo,
  backdoorInfo,
  basicInfo,
  billingPricingInfo,
  botIntentsInfo,
  botsInfo,
  broadcastsInfo,
  businessGatewayInfo,
  chatbotsInfo,
  contactsInfo,
  convosInfo,
  customFieldInfo,
  dashboardInfo,
  demoSSAInfo,
  featuresInfo,
  feedsInfo,
  googleSheetsInfo,
  growthToolsInfo,
  hubSpotInfo,
  invitationsInfo,
  landingPagesInfo,
  listsInfo,
  liveChat,
  loginInfo,
  membersInfo,
  menuInfo,
  messengerAdsInfo,
  messengerCodeInfo,
  messengerRefURLInfo,
  notificationsInfo,
  overlayWidgetsInfo,
  pagesInfo,
  permissionsInfo,
  pollsInfo,
  postsInfo,
  sequenceInfo,
  settingsInfo,
  signupInfo,
  smsBroadcastsInfo,
  smsChatInfo,
  smsWhatsAppDashboardInfo,
  socketInfo,
  sponsoredMessagingInfo,
  subscribersInfo,
  surveysInfo,
  tagsInfo,
  teamsInfo,
  templatesInfo,
  usageInfo,
  whatsAppBroadcastsInfo,
  whatsAppChatInfo,
  whatsAppChatbot
})

export default appReducer
