
import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './sub.app.js'
import Home from './containers/home'
import Login from './containers/login/login'
import Subscriber from './containers/subscriber/subscriber'
import OperationalDashboard from './containers/operationalDashboard/operationalDashboard'
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
import UserBroadcasts from './containers/operationalDashboard/userBroadcasts'
import PageSubscribers from './containers/operationalDashboard/pageSubscribers'
import SubscribeToMessenger from './containers/subscribeToMessenger/subscribeToMessenger'
import UserGuideBroadcasts from './containers/userGuide/userGuideBroadcasts'
import UserGuideSurveys from './containers/userGuide/userGuideSurveys'
import UserGuidePolls from './containers/userGuide/userGuidePolls'
import UserGuideWorkflows from './containers/userGuide/userGuideWorkflows'
import Autoposting from './containers/autoposting/autoposting'
import ItemSettings from './containers/autoposting/itemSettings'
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
  if (auth.loggedIn()) {
    console.log('you are logged in. You cant go here.', nextState)
    replace({
      pathname: '/dashboard',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Login} onEnter={redirectAuthUsers} />
    <Route path='/operationalDashboard' component={OperationalDashboard} onEnter={requireAuth} />
    <Route path='/dashboard' component={Home} onEnter={requireAuth} />
    <Route path='/subscribers' component={Subscriber} onEnter={requireAuth} />
    <Route path='/broadcasts' component={Broadcast} onEnter={requireAuth} />
    <Route path='/convos' component={Convo} onEnter={requireAuth} />
    <Route path='/autoposting' component={Autoposting} onEnter={requireAuth} />
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
    <Route path='/submitsurveyresponse' component={SubmitSurvey} />
    <Route path='/invitesubscribers' component={InviteSubscribers} onEnter={requireAuth} />
    <Route path='/userDetails' component={UserDetails} onEnter={requireAuth} />
    <Route path='/pageSubscribers' component={PageSubscribers} onEnter={requireAuth} />
    <Route path='/userBroadcasts' component={UserBroadcasts} onEnter={requireAuth} />
  </Route>

)

export default routes
