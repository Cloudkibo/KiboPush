import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './sub.app.js';
import Home from './containers/home';
import Login from './containers/login/login';
import Subscriber from './containers/subscriber/subscriber';
import Broadcast from './containers/broadcast/broadcast';

const routes = (
   <Route path="/dashboard" component={App}>
     <IndexRoute  component={Home} />
     <Route path="/login" component={Login}  />
     <Route path="/subscribers" component={Subscriber}  />
     <Route path="/broadcasts" component={Broadcast}  />
  </Route>
);

export default routes;
