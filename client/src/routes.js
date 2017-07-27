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
import AddSurvey from './containers/survey/add_survey';

import CreateWorkflow from './containers/workflows/CreateWorkflow';
import Workflows from './containers/workflows/Workflows';
import EditBroadcast from './containers/broadcast/EditBroadcast';
import CreatePoll from './containers/polls/CreatePoll';
import Poll from './containers/polls/poll';
import SubscribeToMessenger from './containers/subscribeToMessenger/subscribeToMessenger';
import auth from './utility/auth.service';

function requireAuth(nextState, replace) {
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
    replace({
      pathname: '/dashboard',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

const routes = (
  //  <Route path="/" component={App}>
  //    <IndexRoute component={Login} onEnter={ redirectAuthUsers } />
  //    <Route path="/dashboard" component={Home} onEnter={ requireAuth } />
  //    <Route path="/subscribers" component={Subscriber} onEnter={ requireAuth } />
  //    <Route path="/broadcasts" component={Broadcast} onEnter={ requireAuth } />
  //    <Route path="/pages" component={Page} onEnter={ requireAuth } />
  //    <Route path="/addPages" component={AddPage} onEnter={ requireAuth } />
  //    <Route path="/surveys" component={Surveys} onEnter={ requireAuth } />
  //    <Route path="/createbroadcast" component={CreateBroadcast} onEnter={ requireAuth } />
  //    <Route path="/createworkflow" component={CreateWorkflow} onEnter={ requireAuth } />
  //    <Route path="/workflows" component={Workflows} onEnter={ requireAuth } />
  //    <Route path="/editbroadcast" component={EditBroadcast} onEnter={ requireAuth } />
  //    <Route path="/createpoll" component={CreatePoll} onEnter={ requireAuth } />
  //    <Route path="/poll" component={Poll} onEnter={ requireAuth }/>
      // <Route path="/stats" component={Stats}/>
  //    <Route path="/subscribeToMessenger" component={SubscribeToMessenger} onEnter={requireAuth}/>
    // <Route path="/addsurvey" component={AddSurvey}/>
  //    </Route>

     <Route path="/" component={App}>
        <IndexRoute component={Login}  />
        <Route path="/dashboard" component={Home} />
        <Route path="/subscribers" component={Subscriber} />
        <Route path="/broadcasts" component={Broadcast}/>
        <Route path="/pages" component={Page}/>
        <Route path="/addPages" component={AddPage}/>
        <Route path="/surveys" component={Surveys}/>
        <Route path="/createbroadcast" component={CreateBroadcast}/>
        <Route path="/createworkflow" component={CreateWorkflow} />
        <Route path="/workflows" component={Workflows}/>
        <Route path="/editbroadcast" component={EditBroadcast}/>
        <Route path="/createpoll" component={CreatePoll}/>
        <Route path="/poll" component={Poll}/>
        <Route path="/stats" component={Stats}/>
        <Route path="/subscribeToMessenger" component={SubscribeToMessenger}/>
        <Route path="/addsurvey" component={AddSurvey}/>
     </Route>

);

export default routes;
