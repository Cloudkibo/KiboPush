
import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './sub.app.js'
import Home from './containers/home'
//  import Login from './containers/login/login'
import Login from './containers/login/new'
import LoginSignup from './containers/login/loginSignup'
import Signup from './containers/signup/signup'
import ResendVerificationEmail from './containers/signup/resendEmail'
import ForgotPassword from './containers/login/resetPassword'
import Subscriber from './containers/subscriber/subscriber'
import OperationalDashboard from './containers/operationalDashboard/operationalDashboard'
import StackedBar from './containers/dashboard/stackedBar'
import MainMenu from './containers/menu/menu'
import CreateMessage from './containers/menu/CreateMessage'
import GrowthTools from './containers/GrowthTools/growthTools'
import ShareOptions from './containers/GrowthTools/ShareOptions'
import CustomerMatching from './containers/GrowthTools/customerMatchingUsingPhNum'
import NonSubscribersList from './containers/GrowthTools/nonSubscribersList'
import Stats from './containers/stats/stats'
import Broadcast from './containers/broadcast/broadcast'
import Convo from './containers/convo/convo'
import Page from './containers/page/page'
import AddPage from './containers/page/addPage'
import InviteSubscribers from './containers/page/InviteSubscribers'
import CreateBroadcast from './containers/broadcast/CreateBroadcast'
import CreateConvo from './containers/convo/CreateConvo'
import Surveys from './containers/survey/surveys'
import ViewSurvey from './containers/survey/ViewSurvey'
import SubmitSurvey from './containers/survey/SubmitSurvey'
import ViewSurveyDetail from './containers/survey/ViewSurveyDetail'
import AddSurvey from './containers/survey/add_survey'
import SurveyResult from './containers/survey/SurveyResult'
import CreateWorkflow from './containers/workflows/CreateWorkflow'
import EditWorkflow from './containers/workflows/EditWorkflow'
import UserGuide from './containers/userGuide/userGuide'
import Workflows from './containers/workflows/Workflows'
import EditBroadcast from './containers/broadcast/EditBroadcast'
import CreatePoll from './containers/polls/CreatePoll'
import Poll from './containers/polls/poll'
import PollResult from './containers/polls/PollResult'
import ViewPoll from './containers/polls/ViewPoll'
import UserDetails from './containers/operationalDashboard/userDetails'
import ViewPollDetail from './containers/operationalDashboard/pollDetails'
import UserBroadcasts from './containers/operationalDashboard/userBroadcasts'
import SurveyDetails from './containers/operationalDashboard/surveyDetails'
import ViewBroadcastDetail from './containers/operationalDashboard/broadcastDetails'
import PageSubscribers from './containers/operationalDashboard/pageSubscribers'
import UserPolls from './containers/operationalDashboard/userPolls'
import UserSurveys from './containers/operationalDashboard/userSurveys'
import SurveysByDays from './containers/operationalDashboard/surveysByDays'
import PollsByDays from './containers/operationalDashboard/pollsByDays'
import BroadcastsByDays from './containers/operationalDashboard/broadcastsByDays'
import SubscribeToMessenger from './containers/subscribeToMessenger/subscribeToMessenger'
import UserGuideBroadcasts from './containers/userGuide/userGuideBroadcasts'
import UserGuideSurveys from './containers/userGuide/userGuideSurveys'
import UserGuidePolls from './containers/userGuide/userGuidePolls'
import UserGuideWorkflows from './containers/userGuide/userGuideWorkflows'
import Autoposting from './containers/autoposting/autoposting'
import AutopostingMessages from './containers/autoposting/autoposting_messages'
import ItemSettings from './containers/autoposting/itemSettings'
import LiveChat from './containers/liveChat/live'
import Settings from './containers/settings/settings'
import CreateSurvey from './containers/templates/createSurvey'
import CreateTemplatePoll from './containers/templates/createPoll'
import Template from './containers/templates/templates'
import TemplatePoll from './containers/templates/templatePolls'
import TemplateSurvey from './containers/templates/templateSurveys'
import TemplateBroadcasts from './containers/templates/templateBroadcasts'
import CreateBroadcastTemplate from './containers/templates/createBroadcastTemplate'
import ViewBroadcastTemplate from './containers/templates/viewBroadcastTemplate'
import EditBroadcastTemplate from './containers/templates/editBroadcastTemplate'
import ViewTemplateSurvey from './containers/templates/viewSurvey'
import ViewTemplatePoll from './containers/templates/viewPoll'
import EditPoll from './containers/templates/editPoll'
import EditSurvey from './containers/templates/editSurvey'
import Categories from './containers/templates/categories'
import ShowTemplateSurveys from './containers/survey/showTemplates'
import EditTemplateSurvey from './containers/survey/editTemplate'
import ShowTemplatePolls from './containers/polls/showTemplates'
import EditTemplatePoll from './containers/polls/editTemplate'
import ViewTemplatePollUser from './containers/polls/viewTemplate'
import ViewTemplateSurveyUser from './containers/survey/viewTemplate'
import ShowTemplateBroadcasts from './containers/convo/showTemplates'
import EditTemplateBroadcast from './containers/convo/editTemplate'
import Invitations from './containers/invitations/invitations'
import InviteMembers from './containers/invitations/inviteMember'
import Members from './containers/members/members'
import Connect from './containers/facebookConnect/connect'
import WelcomeMessage from './containers/welcomeMessage/welcomeMessage'
import ViewWelcomeMessage from './containers/welcomeMessage/viewMessage'
import SegmentedLists from './containers/segmentedLists/segmentedLists'
import CustomerLists from './containers/GrowthTools/customerLists'
import CustomerListDetails from './containers/GrowthTools/customerListDetails'
import PhoneList from './containers/segmentedLists/listDetails'
import CreateSubList from './containers/segmentedLists/createSubList'
import AddPageWizard from './containers/wizard/addPage'
import InviteUsingLinkWizard from './containers/wizard/inviteUsingLink'
import GreetingTextWizard from './containers/wizard/greetingText'
import WelcomeMessageWizard from './containers/wizard/welcomeMessage'
import AutopostingWizard from './containers/wizard/autoposting'
import WorkflowWizard from './containers/wizard/workflow'
import MenuWizard from './containers/wizard/menu'
import FinishWizard from './containers/wizard/finish'
import auth from './utility/auth.service'

function requireAuth (nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectAuthUsers (nextState, replace) {
  // console.log('auth', auth.getNext())
  if (auth.loggedIn()) {
    // if (auth.getNext() === 'addPages') {
    //   auth.removeNext()
    //   return replace({
    //     pathname: '/addPages',
    //     state: { nextPathname: nextState.location.pathname }
    //   })
    // }
    console.log('you are logged in. You cant go here.', nextState)
    replace({
      pathname: '/dashboard',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={LoginSignup} onEnter={redirectAuthUsers} />
    <Route path='/login' component={Login} onEnter={redirectAuthUsers} />
    <Route path='/signup' component={Signup} />
    <Route path='/resendVerificationEmail' component={ResendVerificationEmail} />
    <Route path='/forgotPassword' component={ForgotPassword} />
    <Route path='/resetPassword' component={ForgotPassword} />
    <Route path='/operationalDashboard' component={OperationalDashboard} onEnter={requireAuth} />
    <Route path='/dashboard' component={Home} onEnter={requireAuth} />
    <Route path='/subscribers' component={Subscriber} onEnter={requireAuth} />
    <Route path='/broadcasts' component={Broadcast} onEnter={requireAuth} />
    <Route path='/convos' component={Convo} onEnter={requireAuth} />
    <Route path='/autoposting' component={Autoposting} onEnter={requireAuth} />
    <Route path='/autoposting-messages' component={AutopostingMessages} onEnter={requireAuth} />
    <Route path='/autoposting-itemsettings' component={ItemSettings} onEnter={requireAuth} />
    <Route path='/pages' component={Page} onEnter={requireAuth} />
    <Route path='/addPages' component={AddPage} onEnter={requireAuth} />
    <Route path='/surveys' component={Surveys} onEnter={requireAuth} />
    <Route path='/createbroadcast' component={CreateBroadcast} onEnter={requireAuth} />
    <Route path='/createconvo' component={CreateConvo} onEnter={requireAuth} />
    <Route path='/createworkflow' component={CreateWorkflow} onEnter={requireAuth} />
    <Route path='/workflows' component={Workflows} onEnter={requireAuth} />
    <Route path='/editbroadcast' component={EditBroadcast} onEnter={requireAuth} />
    <Route path='/createpoll' component={CreatePoll} onEnter={requireAuth} />
    <Route path='/editworkflow' component={EditWorkflow} onEnter={requireAuth} />
    <Route path='/userGuide' component={UserGuide} />
    <Route path='/userGuide-broadcasts' component={UserGuideBroadcasts} />
    <Route path='/userGuide-surveys' component={UserGuideSurveys} />
    <Route path='/userGuide-polls' component={UserGuidePolls} />
    <Route path='/userGuide-workflows' component={UserGuideWorkflows} />
    <Route path='/poll' component={Poll} onEnter={requireAuth} />
    <Route path='/stats' component={Stats} />
    <Route path='/subscribeToMessenger' component={SubscribeToMessenger} onEnter={requireAuth} />
    <Route path='/addsurvey' component={AddSurvey} onEnter={requireAuth} />
    <Route path='/pollResult' component={PollResult} onEnter={requireAuth} />
    <Route path='/pollView' component={ViewPoll} onEnter={requireAuth} />
    <Route path='/surveyResult' component={SurveyResult} onEnter={requireAuth} />
    <Route path='/viewsurvey/:id/:subscriberid' component={ViewSurvey} onEnter={requireAuth} />
    <Route path='/viewsurveydetail' component={ViewSurveyDetail} onEnter={requireAuth} />
    <Route path='/viewPollDetail' component={ViewPollDetail} onEnter={requireAuth} />
    <Route path='/viewBroadcastDetail' component={ViewBroadcastDetail} onEnter={requireAuth} />
    <Route path='/submitsurveyresponse' component={SubmitSurvey} />
    <Route path='/invitesubscribers' component={InviteSubscribers} onEnter={requireAuth} />
    <Route path='/userDetails' component={UserDetails} onEnter={requireAuth} />
    <Route path='/pageSubscribers' component={PageSubscribers} onEnter={requireAuth} />
    <Route path='/userBroadcasts' component={UserBroadcasts} onEnter={requireAuth} />
    <Route path='/userPolls' component={UserPolls} onEnter={requireAuth} />
    <Route path='/userSurveys' component={UserSurveys} onEnter={requireAuth} />
    <Route path='/growthTools' component={GrowthTools} onEnter={requireAuth} />
    <Route path='/shareOptions' component={ShareOptions} onEnter={requireAuth} />
    <Route path='/customerMatchingUsingPhNum' component={CustomerMatching} onEnter={requireAuth} />
    <Route path='/nonSubscribersList' component={NonSubscribersList} onEnter={requireAuth} />
    <Route path='/live' component={LiveChat} onEnter={requireAuth} />
    <Route path='/menu' component={MainMenu} onEnter={requireAuth} />
    <Route path='/createMessage' component={CreateMessage} onEnter={requireAuth} />
    <Route path='/stackedBar' component={StackedBar} onEnter={requireAuth} />
    <Route path='/surveyDetails' component={SurveyDetails} onEnter={requireAuth} />
    <Route path='/settings' component={Settings} onEnter={requireAuth} />
    <Route path='/createSurvey' component={CreateSurvey} onEnter={requireAuth} />
    <Route path='/createTemplatePoll' component={CreateTemplatePoll} onEnter={requireAuth} />
    <Route path='/templates' component={Template} onEnter={requireAuth} />
    <Route path='/templatePolls' component={TemplatePoll} onEnter={requireAuth} />
    <Route path='/templateSurveys' component={TemplateSurvey} onEnter={requireAuth} />
    <Route path='/templateBroadcasts' component={TemplateBroadcasts} onEnter={requireAuth} />
    <Route path='/createBroadcastTemplate' component={CreateBroadcastTemplate} onEnter={requireAuth} />
    <Route path='/viewBroadcastTemplate' component={ViewBroadcastTemplate} onEnter={requireAuth} />
    <Route path='/editBroadcastTemplate' component={EditBroadcastTemplate} onEnter={requireAuth} />
    <Route path='/viewSurvey' component={ViewTemplateSurvey} onEnter={requireAuth} />
    <Route path='/viewPoll' component={ViewTemplatePoll} onEnter={requireAuth} />
    <Route path='/editPoll' component={EditPoll} onEnter={requireAuth} />
    <Route path='/editSurvey' component={EditSurvey} onEnter={requireAuth} />
    <Route path='/showTemplatePolls' component={ShowTemplatePolls} onEnter={requireAuth} />
    <Route path='/showTemplateSurveys' component={ShowTemplateSurveys} onEnter={requireAuth} />
    <Route path='/editTemplatePoll' component={EditTemplatePoll} onEnter={requireAuth} />
    <Route path='/editTemplateSurvey' component={EditTemplateSurvey} onEnter={requireAuth} />
    <Route path='/viewTemplateSurveyUser' component={ViewTemplateSurveyUser} onEnter={requireAuth} />
    <Route path='/viewTemplatePollUser' component={ViewTemplatePollUser} onEnter={requireAuth} />
    <Route path='/ShowTemplateBroadcasts' component={ShowTemplateBroadcasts} onEnter={requireAuth} />
    <Route path='/categories' component={Categories} onEnter={requireAuth} />
    <Route path='/editTemplateBroadcast' component={EditTemplateBroadcast} onEnter={requireAuth} />
    <Route path='/editWelcomeMessage' component={EditTemplateBroadcast} onEnter={requireAuth} />
    <Route path='/inviteMembers' component={Invitations} onEnter={requireAuth} />
    <Route path='/newInvitation' component={InviteMembers} onEnter={requireAuth} />
    <Route path='/members' component={Members} onEnter={requireAuth} />
    <Route path='/connectFb' component={Connect} onEnter={requireAuth} />
    <Route path='/welcomeMessage' component={WelcomeMessage} onEnter={requireAuth} />
    <Route path='/viewWelcomeMessage' component={ViewWelcomeMessage} onEnter={requireAuth} />
    <Route path='/listDetails' component={PhoneList} onEnter={requireAuth} />
    <Route path='/segmentedLists' component={SegmentedLists} onEnter={requireAuth} />
    <Route path='/customerLists' component={CustomerLists} onEnter={requireAuth} />
    <Route path='/customerListDetails' component={CustomerListDetails} onEnter={requireAuth} />
    <Route path='/createSubList' component={CreateSubList} onEnter={requireAuth} />
    <Route path='/addPageWizard' component={AddPageWizard} onEnter={requireAuth} />
    <Route path='/inviteUsingLinkWizard' component={InviteUsingLinkWizard} onEnter={requireAuth} />
    <Route path='/greetingTextWizard' component={GreetingTextWizard} onEnter={requireAuth} />
    <Route path='/welcomeMessageWizard' component={WelcomeMessageWizard} onEnter={requireAuth} />
    <Route path='/autopostingWizard' component={AutopostingWizard} onEnter={requireAuth} />
    <Route path='/workflowWizard' component={WorkflowWizard} onEnter={requireAuth} />
    <Route path='/menuWizard' component={MenuWizard} onEnter={requireAuth} />
    <Route path='/finishWizard' component={FinishWizard} onEnter={requireAuth} />
    <Route path='/surveysByDays' component={SurveysByDays} onEnter={requireAuth} />
    <Route path='/pollsByDays' component={PollsByDays} onEnter={requireAuth} />
    <Route path='/broadcastsByDays' component={BroadcastsByDays} onEnter={requireAuth} />
  </Route>

)

export default routes
