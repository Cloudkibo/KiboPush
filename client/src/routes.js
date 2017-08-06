import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './sub.app.js';
import Home from './containers/home';
import Login from './containers/login/login';
import Subscriber from './containers/subscriber/subscriber';
import Stats from './containers/stats/stats';
import Broadcast from './containers/broadcast/broadcast';
import Page from './containers/page/page';
import AddPage from './containers/page/addPage';
import CreateBroadcast from './containers/broadcast/CreateBroadcast';
import Surveys from './containers/survey/surveys';
import ViewSurvey from './containers/survey/ViewSurvey';
import AddSurvey from './containers/survey/add_survey';
import SurveyResult from './containers/survey/SurveyResult';
import CreateWorkflow from './containers/workflows/CreateWorkflow';
import Workflows from './containers/workflows/Workflows';
import EditBroadcast from './containers/broadcast/EditBroadcast';
import CreatePoll from './containers/polls/CreatePoll';
import Poll from './containers/polls/poll';
import PollResult from './containers/polls/PollResult';
import SubscribeToMessenger from './containers/subscribeToMessenger/subscribeToMessenger';
import auth from './utility/auth.service';

function requireAuth(nextState, replace) {
  console.log(nextState);
  auth.putNext(nextState.location.pathname);
  if (!auth.loggedIn()) {
    console.log('you are not logged in.');
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

function redirectAuthUsers(nextState, replace) {
  if (auth.loggedIn()) {
    console.log('you are logged in. You cant go here.');
    /**
     * We don't want to use hashhistory in router.
     * Pressing refresh takes us to the root route
     * So, we store the current route in cookie "next"
     * so after each refresh, we check, if we are logged
     * in and next cookie is there, we redirect to that route.
     * At logout, we remove the next cookie, so login will
     * take to index route.
     */
    if (auth.getNext() && auth.getNext() !== '') {
      const next = auth.getNext();
      auth.removeNext();
      replace({
        pathname: next,
        state: { nextPathname: nextState.location.pathname }
      });
    } else {
      replace({
        pathname: '/dashboard',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Login} onEnter={redirectAuthUsers} />
    <Route path="/dashboard" component={Home} onEnter={requireAuth} />
    <Route path="/subscribers" component={Subscriber} onEnter={requireAuth} />
    <Route path="/broadcasts" component={Broadcast} onEnter={requireAuth} />
    <Route path="/pages" component={Page} onEnter={requireAuth} />
    <Route path="/addPages" component={AddPage} onEnter={requireAuth} />
    <Route path="/surveys" component={Surveys} onEnter={requireAuth} />
    <Route path="/createbroadcast" component={CreateBroadcast} onEnter={requireAuth} />
    <Route path="/createworkflow" component={CreateWorkflow} onEnter={requireAuth} />
    <Route path="/workflows" component={Workflows} onEnter={requireAuth} />
    <Route path="/editbroadcast" component={EditBroadcast} onEnter={requireAuth} />
    <Route path="/createpoll" component={CreatePoll} onEnter={requireAuth} />
    <Route path="/poll" component={Poll} onEnter={requireAuth} />
    <Route path="/stats" component={Stats} />
    <Route path="/subscribeToMessenger" component={SubscribeToMessenger} onEnter={requireAuth} />
    <Route path="/addsurvey" component={AddSurvey} onEnter={requireAuth} />
    <Route path="/pollResult" component={PollResult} onEnter={requireAuth} />
    <Route path="/surveyResult" component={SurveyResult} onEnter={requireAuth} />
    <Route path="/viewsurvey/:id" component={ViewSurvey} />
  </Route>

);

export default routes;
